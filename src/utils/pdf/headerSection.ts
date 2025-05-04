
import { jsPDF } from 'jspdf';
import { FONT_SIZES, DOCUMENT_MARGINS, addAutoPagingText } from './documentStyles';
import { Program } from './types';

export function addProgramHeader(doc: jsPDF, program: Program): number {
  let y = DOCUMENT_MARGINS.top; // Starting position
  
  // Program title with modern style
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.setFontSize(FONT_SIZES.title);
  
  // Calculate center position for title
  const titleWidth = doc.getStringUnitWidth(program.name) * FONT_SIZES.title / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  
  doc.text(program.name, titleX, y);
  y += 9; // Reduced from 8
  
  // Stylized divider at the top
  doc.setDrawColor(80);
  doc.setLineWidth(0.5);
  doc.line(DOCUMENT_MARGINS.left, y, doc.internal.pageSize.width - DOCUMENT_MARGINS.right, y);
  y += 4; // Reduced from 8
  
  // Publication date
  doc.setFontSize(FONT_SIZES.small);
  doc.setTextColor(80);
  doc.setFont("helvetica", "italic");
  
  const pubDateText = program.publishDate 
    ? `Pubblicato il ${new Date(program.publishDate).toLocaleDateString('it-IT')}`
    : "Data di pubblicazione non disponibile";
  
  doc.text(pubDateText, DOCUMENT_MARGINS.left, y);
  y += 3; // Reduced from 4
  
  // Generation date
  doc.setFontSize(FONT_SIZES.small);
  doc.setTextColor(80);
  doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, DOCUMENT_MARGINS.left, y);
  y += 14; // Reduced from 8
  
  return y; // Return the new Y position
}
