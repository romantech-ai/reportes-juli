import * as XLSX from 'xlsx';
import type { Report } from '@/types/report';

export function exportReportsToExcel(reports: Report[], filename: string = 'reportes'): void {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Main reports sheet
  const mainData = reports.map((report) => ({
    Fecha: report.fecha,
    Región: report.region,
    'Ciudad/Provincia': report.ciudad_provincia,
    'Rutas Visitadas': report.rutas.numero_rutas_visitadas,
    'Volumen (L)': report.volumenes.total_litros,
    'Situación Actual': report.diagnostico.situacion_actual,
    'Num. Problemas': report.diagnostico.problemas_detectados.length,
    'Num. Soluciones': report.diagnostico.soluciones_propuestas.length,
    Oportunidades: report.diagnostico.oportunidades,
    'Notas Adicionales': report.notas_adicionales,
  }));

  const wsMain = XLSX.utils.json_to_sheet(mainData);
  XLSX.utils.book_append_sheet(wb, wsMain, 'Reportes');

  // Problems sheet
  const problemsData: { Fecha: string; Región: string; Problema: string }[] = [];
  reports.forEach((report) => {
    report.diagnostico.problemas_detectados.forEach((problema) => {
      problemsData.push({
        Fecha: report.fecha,
        Región: report.region,
        Problema: problema,
      });
    });
  });

  if (problemsData.length > 0) {
    const wsProblems = XLSX.utils.json_to_sheet(problemsData);
    XLSX.utils.book_append_sheet(wb, wsProblems, 'Problemas');
  }

  // Solutions sheet
  const solutionsData: { Fecha: string; Región: string; Solución: string }[] = [];
  reports.forEach((report) => {
    report.diagnostico.soluciones_propuestas.forEach((solucion) => {
      solutionsData.push({
        Fecha: report.fecha,
        Región: report.region,
        Solución: solucion,
      });
    });
  });

  if (solutionsData.length > 0) {
    const wsSolutions = XLSX.utils.json_to_sheet(solutionsData);
    XLSX.utils.book_append_sheet(wb, wsSolutions, 'Soluciones');
  }

  // Learnings sheet
  const learningsData: { Fecha: string; Región: string; Aprendizaje: string }[] = [];
  reports.forEach((report) => {
    report.aprendizajes_clave.forEach((aprendizaje) => {
      learningsData.push({
        Fecha: report.fecha,
        Región: report.region,
        Aprendizaje: aprendizaje,
      });
    });
  });

  if (learningsData.length > 0) {
    const wsLearnings = XLSX.utils.json_to_sheet(learningsData);
    XLSX.utils.book_append_sheet(wb, wsLearnings, 'Aprendizajes');
  }

  // Rutas details sheet
  const rutasData = reports.map((report) => ({
    Fecha: report.fecha,
    Región: report.region,
    'Num. Rutas': report.rutas.numero_rutas_visitadas,
    Distribución: report.rutas.distribucion,
    Observaciones: report.rutas.observaciones,
  }));

  const wsRutas = XLSX.utils.json_to_sheet(rutasData);
  XLSX.utils.book_append_sheet(wb, wsRutas, 'Rutas');

  // Volumes details sheet
  const volumesData = reports.map((report) => ({
    Fecha: report.fecha,
    Región: report.region,
    'Total Litros': report.volumenes.total_litros,
    'Desglose por Cliente': report.volumenes.desglose_por_cliente,
    Tendencias: report.volumenes.tendencias,
  }));

  const wsVolumes = XLSX.utils.json_to_sheet(volumesData);
  XLSX.utils.book_append_sheet(wb, wsVolumes, 'Volúmenes');

  // Save
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportSingleReportToExcel(report: Report): void {
  exportReportsToExcel([report], `reporte_${report.fecha}_${report.region || 'general'}`);
}
