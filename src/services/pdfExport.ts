import jsPDF from 'jspdf';
import type { Report } from '@/types/report';
import { formatDate } from '@/lib/utils';

export async function exportReportToPDF(report: Report): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 0.4);
  };

  // Helper to check page break
  const checkPageBreak = (height: number) => {
    if (y + height > 280) {
      doc.addPage();
      y = 20;
    }
  };

  // Title
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235); // Primary blue
  doc.text('Reporte de Visita Comercial', margin, y);
  y += 12;

  // Date and Location
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // Muted
  doc.text(formatDate(report.fecha), margin, y);
  y += 8;

  if (report.region || report.ciudad_provincia) {
    doc.text(
      [report.region, report.ciudad_provincia].filter(Boolean).join(' - '),
      margin,
      y
    );
    y += 12;
  }

  // Horizontal line
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Quick Stats
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // Foreground
  doc.text(
    `Rutas visitadas: ${report.rutas.numero_rutas_visitadas}  |  Volumen: ${report.volumenes.total_litros.toLocaleString('es-ES')} L`,
    margin,
    y
  );
  y += 12;

  // Section: Rutas
  if (report.rutas.distribucion || report.rutas.observaciones) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('Rutas', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    if (report.rutas.distribucion) {
      y += addText(`Distribución: ${report.rutas.distribucion}`, margin, contentWidth);
      y += 3;
    }
    if (report.rutas.observaciones) {
      y += addText(`Observaciones: ${report.rutas.observaciones}`, margin, contentWidth);
    }
    y += 8;
  }

  // Section: Volúmenes
  if (report.volumenes.desglose_por_cliente || report.volumenes.tendencias) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('Volúmenes', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    if (report.volumenes.desglose_por_cliente) {
      y += addText(`Desglose: ${report.volumenes.desglose_por_cliente}`, margin, contentWidth);
      y += 3;
    }
    if (report.volumenes.tendencias) {
      y += addText(`Tendencias: ${report.volumenes.tendencias}`, margin, contentWidth);
    }
    y += 8;
  }

  // Section: Diagnóstico - Situación Actual
  if (report.diagnostico.situacion_actual) {
    checkPageBreak(25);
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('Situación Actual', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    y += addText(report.diagnostico.situacion_actual, margin, contentWidth);
    y += 8;
  }

  // Section: Problemas Detectados
  if (report.diagnostico.problemas_detectados.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(239, 68, 68); // Danger red
    doc.text(`Problemas Detectados (${report.diagnostico.problemas_detectados.length})`, margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    report.diagnostico.problemas_detectados.forEach((problem) => {
      checkPageBreak(10);
      y += addText(`• ${problem}`, margin + 5, contentWidth - 5);
      y += 2;
    });
    y += 5;
  }

  // Section: Soluciones Propuestas
  if (report.diagnostico.soluciones_propuestas.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129); // Success green
    doc.text(`Soluciones Propuestas (${report.diagnostico.soluciones_propuestas.length})`, margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    report.diagnostico.soluciones_propuestas.forEach((solution) => {
      checkPageBreak(10);
      y += addText(`• ${solution}`, margin + 5, contentWidth - 5);
      y += 2;
    });
    y += 5;
  }

  // Section: Oportunidades
  if (report.diagnostico.oportunidades) {
    checkPageBreak(25);
    doc.setFontSize(12);
    doc.setTextColor(245, 158, 11); // Warning amber
    doc.text('Oportunidades', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    y += addText(report.diagnostico.oportunidades, margin, contentWidth);
    y += 8;
  }

  // Section: Aprendizajes Clave
  if (report.aprendizajes_clave.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('Aprendizajes Clave', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    report.aprendizajes_clave.forEach((learning) => {
      checkPageBreak(10);
      y += addText(`• ${learning}`, margin + 5, contentWidth - 5);
      y += 2;
    });
    y += 5;
  }

  // Section: Notas Adicionales
  if (report.notas_adicionales) {
    checkPageBreak(25);
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text('Notas Adicionales', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    y += addText(report.notas_adicionales, margin, contentWidth);
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${pageCount} | Generado con Reportes Juli`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  // Save
  const fileName = `reporte_${report.fecha}_${report.region || 'general'}.pdf`;
  doc.save(fileName.toLowerCase().replace(/\s+/g, '_'));
}
