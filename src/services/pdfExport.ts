import jsPDF from 'jspdf';
import type { Report } from '@/types/report';

export async function exportReportToPDF(report: Report): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Colors
  const primaryColor: [number, number, number] = [180, 83, 9]; // Amber-700
  const textColor: [number, number, number] = [28, 25, 23]; // Stone-900
  const mutedColor: [number, number, number] = [120, 113, 108]; // Stone-500
  const orangeColor: [number, number, number] = [234, 88, 12]; // Orange-600
  const greenColor: [number, number, number] = [22, 163, 74]; // Green-600

  // Helper function to add text with word wrap
  const addText = (
    text: string,
    x: number,
    maxWidth: number,
    fontSize: number = 10
  ) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 0.4);
  };

  // Helper to check page break
  const checkPageBreak = (height: number) => {
    if (y + height > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // ========================================
  // 1. PORTADA
  // ========================================
  // Title background
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Main title - Zona
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text(report.portada.zona || 'Reporte de Zona', margin, 30);

  // Semana
  doc.setFontSize(12);
  doc.setTextColor(...mutedColor);
  doc.text(report.portada.semana, margin, 42);

  // Fábricas badge
  if (report.portada.fabricas.length > 0) {
    const fabricasText = report.portada.fabricas.join(' | ');
    doc.setFontSize(10);
    doc.text(`Fábricas: ${fabricasText}`, margin, 52);
  }

  // Responsable
  doc.text(`Responsable: ${report.portada.responsable}`, pageWidth - margin - 50, 52);

  y = 70;

  // Objetivo
  if (report.portada.objetivo) {
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Objetivo:', margin, y);
    doc.setFont('helvetica', 'normal');
    y += 5;
    y += addText(report.portada.objetivo, margin, contentWidth);
    y += 8;
  }

  // Horizontal line
  doc.setDrawColor(217, 119, 6); // Amber-600
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ========================================
  // 2. FOTO ZONA + 3. RUTAS (misma sección)
  // ========================================
  checkPageBreak(50);
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Foto de la Zona', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 7;

  doc.setFontSize(10);
  doc.setTextColor(...textColor);

  // Quick stats row
  const stats = [];
  if (report.foto_zona.litros_mes > 0) {
    stats.push(`${report.foto_zona.litros_mes.toLocaleString('es-ES')} L/mes`);
  }
  if (report.rutas.num_rutas > 0) {
    stats.push(`${report.rutas.num_rutas} rutas`);
  }
  if (report.rutas.distancia_media_km > 0) {
    stats.push(`${report.rutas.distancia_media_km} km media`);
  }
  if (stats.length > 0) {
    doc.text(stats.join('  |  '), margin, y);
    y += 6;
  }

  if (report.foto_zona.fabricas_destino) {
    y += addText(`Fábricas destino: ${report.foto_zona.fabricas_destino}`, margin, contentWidth);
    y += 3;
  }

  if (report.foto_zona.peso_estrategico) {
    y += addText(`Peso estratégico: ${report.foto_zona.peso_estrategico}`, margin, contentWidth);
    y += 3;
  }

  y += 8;

  // Rutas y Logística
  if (report.rutas.eficiencia || report.rutas.solapes) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Rutas y Logística', margin, y);
    doc.setFont('helvetica', 'normal');
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);

    if (report.rutas.solapes) {
      y += addText(`Solapes: ${report.rutas.solapes}`, margin, contentWidth);
      y += 3;
    }
    if (report.rutas.eficiencia) {
      y += addText(`Eficiencia: ${report.rutas.eficiencia}`, margin, contentWidth);
    }
    y += 8;
  }

  // ========================================
  // 4. VOLÚMENES + 5. CALIDAD
  // ========================================
  checkPageBreak(40);
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Volúmenes y Contratos', margin, y);
  doc.setFont('helvetica', 'normal');
  y += 7;

  doc.setFontSize(10);
  doc.setTextColor(...textColor);

  const volStats = [];
  if (report.volumenes.volumen_contratado > 0) {
    volStats.push(`Contratado: ${report.volumenes.volumen_contratado.toLocaleString('es-ES')} L`);
  }
  if (report.volumenes.volumen_real > 0) {
    volStats.push(`Real: ${report.volumenes.volumen_real.toLocaleString('es-ES')} L`);
  }
  if (report.volumenes.pct_contratos_largos > 0) {
    volStats.push(`${report.volumenes.pct_contratos_largos}% contratos largos`);
  }
  if (volStats.length > 0) {
    doc.text(volStats.join('  |  '), margin, y);
    y += 6;
  }

  if (report.volumenes.concentracion_ganaderos) {
    y += addText(`Concentración: ${report.volumenes.concentracion_ganaderos}`, margin, contentWidth);
  }
  y += 8;

  // Calidad
  if (report.calidad.calidad_media || report.calidad.incidencias || report.calidad.impacto_estacional) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Calidad y Estacionalidad', margin, y);
    doc.setFont('helvetica', 'normal');
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);

    if (report.calidad.calidad_media) {
      y += addText(`Calidad media: ${report.calidad.calidad_media}`, margin, contentWidth);
      y += 3;
    }
    if (report.calidad.incidencias) {
      y += addText(`Incidencias: ${report.calidad.incidencias}`, margin, contentWidth);
      y += 3;
    }
    if (report.calidad.impacto_estacional) {
      y += addText(`Impacto estacional: ${report.calidad.impacto_estacional}`, margin, contentWidth);
    }
    y += 8;
  }

  // ========================================
  // 6. RIESGOS
  // ========================================
  if (report.riesgos.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(...orangeColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`Riesgos Detectados (${report.riesgos.length})`, margin, y);
    doc.setFont('helvetica', 'normal');
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    report.riesgos.forEach((risk) => {
      checkPageBreak(10);
      y += addText(`• ${risk}`, margin + 5, contentWidth - 5);
      y += 2;
    });
    y += 5;
  }

  // ========================================
  // 7. OPORTUNIDADES
  // ========================================
  if (report.oportunidades.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(...greenColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`Oportunidades y Propuestas (${report.oportunidades.length})`, margin, y);
    doc.setFont('helvetica', 'normal');
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    report.oportunidades.forEach((opp) => {
      checkPageBreak(10);
      y += addText(`• ${opp}`, margin + 5, contentWidth - 5);
      y += 2;
    });
    y += 5;
  }

  // ========================================
  // 8. CIERRE EJECUTIVO (destacado)
  // ========================================
  if (report.cierre_ejecutivo) {
    checkPageBreak(40);

    // Highlighted box
    doc.setFillColor(254, 249, 195); // Yellow-100
    doc.setDrawColor(217, 119, 6); // Amber-600
    doc.setLineWidth(1);
    const boxHeight = Math.max(30, doc.splitTextToSize(report.cierre_ejecutivo, contentWidth - 10).length * 5 + 20);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Cierre Ejecutivo', margin + 5, y);
    doc.setFont('helvetica', 'normal');
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    y += addText(report.cierre_ejecutivo, margin + 5, contentWidth - 10);
    y += 15;
  }

  // ========================================
  // 9. NOTAS ADICIONALES
  // ========================================
  if (report.notas_adicionales) {
    checkPageBreak(30);
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Notas Adicionales', margin, y);
    doc.setFont('helvetica', 'normal');
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    y += addText(report.notas_adicionales, margin, contentWidth);
    y += 10;
  }

  // ========================================
  // FOOTER
  // ========================================
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text(
      `Página ${i} de ${pageCount} | Reportes Juli - ${report.portada.zona}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  // Save
  const zonaSafe = (report.portada.zona || 'zona').toLowerCase().replace(/\s+/g, '_');
  const fileName = `reporte_${zonaSafe}_${report.portada.semana.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName.toLowerCase());
}
