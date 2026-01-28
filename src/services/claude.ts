import type { ReportDraft } from '@/types/report';
import { getTodayISO } from '@/lib/utils';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `Eres un asistente especializado en estructurar reportes de visitas comerciales para la industria de distribución de combustibles/lubricantes en España.

Tu tarea es analizar la transcripción de voz del comercial y extraer información estructurada en formato JSON.

IMPORTANTE:
- Extrae SOLO la información mencionada explícitamente en la transcripción
- Si algún dato no está mencionado, usa valores por defecto sensatos o strings vacíos
- Los problemas y soluciones deben ser arrays de strings concisos
- Mantén un tono profesional y objetivo, como un diagnóstico clínico
- Responde ÚNICAMENTE con el JSON, sin explicaciones adicionales

El JSON debe seguir exactamente esta estructura:
{
  "fecha": "YYYY-MM-DD",
  "region": "nombre de la región visitada",
  "ciudad_provincia": "ciudad o provincia específica",
  "rutas": {
    "numero_rutas_visitadas": número,
    "distribucion": "descripción de la distribución de rutas",
    "observaciones": "observaciones sobre las rutas"
  },
  "volumenes": {
    "total_litros": número,
    "desglose_por_cliente": "descripción del desglose",
    "tendencias": "tendencias observadas"
  },
  "diagnostico": {
    "situacion_actual": "resumen de la situación actual del territorio/mercado",
    "problemas_detectados": ["problema 1", "problema 2"],
    "soluciones_propuestas": ["solución 1", "solución 2"],
    "oportunidades": "oportunidades de negocio identificadas"
  },
  "aprendizajes_clave": ["aprendizaje 1", "aprendizaje 2"],
  "notas_adicionales": "cualquier información adicional relevante"
}`;

export async function processTranscriptWithClaude(
  transcript: string,
  onProgress?: (progress: number) => void
): Promise<ReportDraft> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error(
      'API key no configurada. Añade VITE_CLAUDE_API_KEY en .env.local'
    );
  }

  onProgress?.(10);

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Fecha de hoy: ${getTodayISO()}

Transcripción del reporte de visita comercial:

"${transcript}"

Genera el JSON estructurado con la información extraída.`,
        },
      ],
    }),
  });

  onProgress?.(60);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Error de API: ${response.status}`
    );
  }

  const data = await response.json();
  onProgress?.(80);

  const content = data.content?.[0]?.text;
  if (!content) {
    throw new Error('Respuesta vacía de la API');
  }

  // Extract JSON from the response (handle markdown code blocks)
  let jsonStr = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  try {
    const parsed = JSON.parse(jsonStr.trim());
    onProgress?.(100);

    return {
      fecha: parsed.fecha || getTodayISO(),
      region: parsed.region || '',
      ciudad_provincia: parsed.ciudad_provincia || '',
      rutas: {
        numero_rutas_visitadas: parsed.rutas?.numero_rutas_visitadas || 0,
        distribucion: parsed.rutas?.distribucion || '',
        observaciones: parsed.rutas?.observaciones || '',
      },
      volumenes: {
        total_litros: parsed.volumenes?.total_litros || 0,
        desglose_por_cliente: parsed.volumenes?.desglose_por_cliente || '',
        tendencias: parsed.volumenes?.tendencias || '',
      },
      diagnostico: {
        situacion_actual: parsed.diagnostico?.situacion_actual || '',
        problemas_detectados: parsed.diagnostico?.problemas_detectados || [],
        soluciones_propuestas: parsed.diagnostico?.soluciones_propuestas || [],
        oportunidades: parsed.diagnostico?.oportunidades || '',
      },
      aprendizajes_clave: parsed.aprendizajes_clave || [],
      notas_adicionales: parsed.notas_adicionales || '',
      transcripcion_original: transcript,
    };
  } catch {
    throw new Error('No se pudo procesar la respuesta de la IA');
  }
}
