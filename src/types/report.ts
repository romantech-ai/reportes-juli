export interface Rutas {
  numero_rutas_visitadas: number;
  distribucion: string;
  observaciones: string;
}

export interface Volumenes {
  total_litros: number;
  desglose_por_cliente: string;
  tendencias: string;
}

export interface Diagnostico {
  situacion_actual: string;
  problemas_detectados: string[];
  soluciones_propuestas: string[];
  oportunidades: string;
}

export interface Report {
  id: string;
  fecha: string;
  region: string;
  ciudad_provincia: string;
  rutas: Rutas;
  volumenes: Volumenes;
  diagnostico: Diagnostico;
  aprendizajes_clave: string[];
  notas_adicionales: string;
  transcripcion_original: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportDraft = Omit<Report, 'id' | 'createdAt' | 'updatedAt'>;

export interface WeeklySummary {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalReports: number;
  totalLitros: number;
  totalRutas: number;
  regiones: string[];
  mainProblems: string[];
  mainSolutions: string[];
}
