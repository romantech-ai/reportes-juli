import type { ReportDraft } from '@/types/report';
import { getWeekRangeFromDate, getTodayISO } from '@/lib/utils';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `Eres un analista de compras de leche para una empresa láctea española. Extrae información del reporte de visita de zona y estructura en formato ejecutivo profesional.

TONO OBLIGATORIO:
- Objetivo y profesional, sin subjetividad
- NUNCA uses: "yo creo", "me parece", "pienso que", "en mi opinión"
- USA: "se observa", "se detecta", "se recomienda", "se identifica", "se constata"

VOCABULARIO PREFERIDO:
consolidación, optimización, solape, eficiencia, vencimiento, concentración, estacionalidad, ocupación, recogida, ganadero, cisterna, ruta, fábrica destino

INSTRUCCIONES:
1. Extrae SOLO información explícitamente mencionada en la transcripción
2. Si un dato no está mencionado, usa valores por defecto sensatos o strings vacíos
3. Los riesgos y oportunidades deben ser arrays de strings concisos y accionables
4. El CIERRE EJECUTIVO debe ser máximo 5 líneas resumiendo lo más importante para un director de compras
5. Responde ÚNICAMENTE con el JSON, sin explicaciones

El JSON debe seguir esta estructura:
{
  "portada": {
    "zona": "nombre de la zona visitada",
    "fabricas": ["fábricas destino mencionadas"],
    "objetivo": "objetivo principal de la visita"
  },
  "foto_zona": {
    "litros_mes": número estimado de litros mensuales,
    "fabricas_destino": "fábricas que reciben leche de esta zona",
    "peso_estrategico": "importancia estratégica de la zona"
  },
  "rutas": {
    "num_rutas": número de rutas,
    "litros_medios_ruta": litros promedio por ruta,
    "distancia_media_km": distancia media en km,
    "solapes": "descripción de solapes entre rutas si existen",
    "eficiencia": "observaciones sobre eficiencia de rutas"
  },
  "volumenes": {
    "volumen_contratado": litros contratados,
    "volumen_real": litros reales recogidos,
    "pct_contratos_largos": porcentaje de contratos a largo plazo,
    "concentracion_ganaderos": "descripción de concentración de ganaderos"
  },
  "calidad": {
    "calidad_media": "descripción de calidad media",
    "incidencias": "incidencias de calidad detectadas",
    "impacto_estacional": "variaciones estacionales observadas"
  },
  "riesgos": ["riesgo 1 priorizado", "riesgo 2"],
  "oportunidades": ["oportunidad/propuesta 1", "oportunidad 2"],
  "cierre_ejecutivo": "Resumen ejecutivo de máximo 5 líneas para dirección de compras"
}`;

export async function processTranscriptWithClaude(
  transcript: string,
  fecha?: string,
  onProgress?: (progress: number) => void
): Promise<ReportDraft> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error(
      'API key no configurada. Añade VITE_CLAUDE_API_KEY en .env.local'
    );
  }

  onProgress?.(10);

  const reportDate = fecha || getTodayISO();
  const weekRange = getWeekRangeFromDate(reportDate);

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
          content: `Semana actual: ${weekRange}
Responsable: Julián

Transcripción del reporte de visita de zona:

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
      transcripcion_original: transcript,

      // 1. Portada
      portada: {
        zona: parsed.portada?.zona || '',
        semana: weekRange,
        fecha: reportDate,
        fabricas: parsed.portada?.fabricas || [],
        responsable: 'Julián',
        objetivo: parsed.portada?.objetivo || '',
      },

      // 2. Foto General
      foto_zona: {
        litros_mes: parsed.foto_zona?.litros_mes || 0,
        fabricas_destino: parsed.foto_zona?.fabricas_destino || '',
        peso_estrategico: parsed.foto_zona?.peso_estrategico || '',
      },

      // 3. Rutas
      rutas: {
        num_rutas: parsed.rutas?.num_rutas || 0,
        litros_medios_ruta: parsed.rutas?.litros_medios_ruta || 0,
        distancia_media_km: parsed.rutas?.distancia_media_km || 0,
        solapes: parsed.rutas?.solapes || '',
        eficiencia: parsed.rutas?.eficiencia || '',
      },

      // 4. Volúmenes
      volumenes: {
        volumen_contratado: parsed.volumenes?.volumen_contratado || 0,
        volumen_real: parsed.volumenes?.volumen_real || 0,
        pct_contratos_largos: parsed.volumenes?.pct_contratos_largos || 0,
        concentracion_ganaderos: parsed.volumenes?.concentracion_ganaderos || '',
      },

      // 5. Calidad
      calidad: {
        calidad_media: parsed.calidad?.calidad_media || '',
        incidencias: parsed.calidad?.incidencias || '',
        impacto_estacional: parsed.calidad?.impacto_estacional || '',
      },

      // 6-8. Análisis
      riesgos: parsed.riesgos || [],
      oportunidades: parsed.oportunidades || [],
      cierre_ejecutivo: parsed.cierre_ejecutivo || '',
      notas_adicionales: '',
    };
  } catch {
    throw new Error('No se pudo procesar la respuesta de la IA');
  }
}
