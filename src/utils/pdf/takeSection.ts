
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';
import { FONT_SIZES, DOCUMENT_MARGINS, checkForPageBreak, addAutoPagingText } from './documentStyles';
import { renderSongs } from './songSection';

export function renderTakes(doc: jsPDF, takes: Take[], startY: number): void {
  let y = startY;
  
  // Sort takes by number
  const sortedTakes = [...takes].sort((a, b) => a.number - b.number);
  
  if (sortedTakes.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(FONT_SIZES.normal);
    doc.setTextColor(80);
    doc.text("Nessun take disponibile per questo programma", DOCUMENT_MARGINS.left, y);
    return;
  }
  
  // Loop through each take
  for (const take of sortedTakes) {
    // Estimate height needed for take header
    const takeHeaderHeight = 12; // Reduced from 16
    
    // Check if we need a page break for the take header
    y = checkForPageBreak(doc, y, takeHeaderHeight);
    
    // Take header
    doc.setFontSize(FONT_SIZES.subtitle);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, DOCUMENT_MARGINS.left, y);
    y += 5; // Reduced from 6
    
    if (take.date) {
      doc.setFontSize(FONT_SIZES.small);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text(`Data: ${new Date(take.date).toLocaleDateString('it-IT')}`, DOCUMENT_MARGINS.left + 10, y);
      y += 5; // Reduced from 7
    }
    
    // Render songs for this take with improved text flow
    y = renderSongs(doc, take.songs, y);
    
    // Space between takes
    y += 6; // Reduced from 8
  }
}
