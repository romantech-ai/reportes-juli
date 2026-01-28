import * as XLSX from 'xlsx';
import type { Report } from '@/types/report';

export function exportReportsToExcel(reports: Report[], filename: string = 'reportes'): void {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Main reports sheet
  const mainData = reports.map((report) => ({
    Zona: report.portada.zona,
    Semana: report.portada.semana,
    Fábricas: report.portada.fabricas.join(', '),
    Responsable: report.portada.responsable,
    Objetivo: report.portada.objetivo,
    'Litros/Mes': report.foto_zona.litros_mes,
    'Num. Rutas': report.rutas.num_rutas,
    'L/Ruta Media': report.rutas.litros_medios_ruta,
    'Km Media': report.rutas.distancia_media_km,
    'Vol. Contratado': report.volumenes.volumen_contratado,
    'Vol. Real': report.volumenes.volumen_real,
    '% Contratos Largos': report.volumenes.pct_contratos_largos,
    'Num. Riesgos': report.riesgos.length,
    'Num. Oportunidades': report.oportunidades.length,
    'Cierre Ejecutivo': report.cierre_ejecutivo,
    'Notas Adicionales': report.notas_adicionales || '',
  }));

  const wsMain = XLSX.utils.json_to_sheet(mainData);
  XLSX.utils.book_append_sheet(wb, wsMain, 'Reportes');

  // Riesgos sheet
  const riesgosData: { Zona: string; Semana: string; Riesgo: string }[] = [];
  reports.forEach((report) => {
    report.riesgos.forEach((riesgo) => {
      riesgosData.push({
        Zona: report.portada.zona,
        Semana: report.portada.semana,
        Riesgo: riesgo,
      });
    });
  });

  if (riesgosData.length > 0) {
    const wsRiesgos = XLSX.utils.json_to_sheet(riesgosData);
    XLSX.utils.book_append_sheet(wb, wsRiesgos, 'Riesgos');
  }

  // Oportunidades sheet
  const oportunidadesData: { Zona: string; Semana: string; Oportunidad: string }[] = [];
  reports.forEach((report) => {
    report.oportunidades.forEach((oportunidad) => {
      oportunidadesData.push({
        Zona: report.portada.zona,
        Semana: report.portada.semana,
        Oportunidad: oportunidad,
      });
    });
  });

  if (oportunidadesData.length > 0) {
    const wsOportunidades = XLSX.utils.json_to_sheet(oportunidadesData);
    XLSX.utils.book_append_sheet(wb, wsOportunidades, 'Oportunidades');
  }

  // Rutas details sheet
  const rutasData = reports.map((report) => ({
    Zona: report.portada.zona,
    Semana: report.portada.semana,
    'Num. Rutas': report.rutas.num_rutas,
    'Litros Media/Ruta': report.rutas.litros_medios_ruta,
    'Distancia Media (km)': report.rutas.distancia_media_km,
    Solapes: report.rutas.solapes,
    Eficiencia: report.rutas.eficiencia,
  }));

  const wsRutas = XLSX.utils.json_to_sheet(rutasData);
  XLSX.utils.book_append_sheet(wb, wsRutas, 'Rutas');

  // Volumes details sheet
  const volumesData = reports.map((report) => ({
    Zona: report.portada.zona,
    Semana: report.portada.semana,
    'Litros/Mes': report.foto_zona.litros_mes,
    'Vol. Contratado': report.volumenes.volumen_contratado,
    'Vol. Real': report.volumenes.volumen_real,
    '% Contratos Largos': report.volumenes.pct_contratos_largos,
    'Concentración Ganaderos': report.volumenes.concentracion_ganaderos,
  }));

  const wsVolumes = XLSX.utils.json_to_sheet(volumesData);
  XLSX.utils.book_append_sheet(wb, wsVolumes, 'Volúmenes');

  // Calidad sheet
  const calidadData = reports.map((report) => ({
    Zona: report.portada.zona,
    Semana: report.portada.semana,
    'Calidad Media': report.calidad.calidad_media,
    Incidencias: report.calidad.incidencias,
    'Impacto Estacional': report.calidad.impacto_estacional,
  }));

  const wsCalidad = XLSX.utils.json_to_sheet(calidadData);
  XLSX.utils.book_append_sheet(wb, wsCalidad, 'Calidad');

  // Save
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportSingleReportToExcel(report: Report): void {
  const zonaSafe = (report.portada.zona || 'zona').toLowerCase().replace(/\s+/g, '_');
  exportReportsToExcel([report], `reporte_${zonaSafe}_${report.portada.semana.replace(/\s+/g, '_')}`);
}
