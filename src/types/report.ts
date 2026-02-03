// ============================================
// Formato Ejecutivo de Reportes - Industria Lechera
// ============================================

// 1. Portada
export interface Portada {
  zona: string;              // "Castilla La Mancha"
  semana: string;            // "27 Ene - 2 Feb 2025"
  fecha: string;             // "2025-01-28" (ISO date)
  fabricas: string[];        // ["CSAN", "Jaén"]
  responsable: string;       // "Julián"
  objetivo: string;          // "Entender estructura de rutas..."
}

// 2. Foto General de la Zona
export interface FotoZona {
  litros_mes: number;        // 500000
  fabricas_destino: string;  // "CSAN y Jaén"
  peso_estrategico: string;  // "Zona crítica en verano"
}

// 3. Rutas y Logística
export interface Rutas {
  num_rutas: number;
  litros_medios_ruta: number;
  distancia_media_km: number;
  solapes: string;           // "Solape entre R1 y R3 en zona norte"
  eficiencia: string;        // "2 rutas con ocupación <80%"
}

// 4. Volúmenes y Contratos
export interface Volumenes {
  volumen_contratado: number;
  volumen_real: number;
  pct_contratos_largos: number;  // 65
  concentracion_ganaderos: string;
}

// 5. Calidad y Estacionalidad
export interface Calidad {
  calidad_media: string;
  incidencias: string;
  impacto_estacional: string;
}

// Reporte Ejecutivo Principal
export interface Report {
  id: string;
  createdAt: string;
  updatedAt: string;
  transcripcion_original: string;

  // Sync with Supabase
  remote_id?: string;  // UUID from Supabase

  // 1. Portada
  portada: Portada;

  // 2. Foto General
  foto_zona: FotoZona;

  // 3. Rutas y Logística
  rutas: Rutas;

  // 4. Volúmenes y Contratos
  volumenes: Volumenes;

  // 5. Calidad
  calidad: Calidad;

  // 6. Riesgos Detectados
  riesgos: string[];

  // 7. Oportunidades/Propuestas
  oportunidades: string[];

  // 8. Cierre Ejecutivo
  cierre_ejecutivo: string;

  // 9. Notas Adicionales (escritas a mano)
  notas_adicionales: string;
}

export type ReportDraft = Omit<Report, 'id' | 'createdAt' | 'updatedAt'>;

export interface WeeklySummary {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalReports: number;
  totalLitros: number;
  totalRutas: number;
  zonas: string[];
  mainRiesgos: string[];
  mainOportunidades: string[];
}
