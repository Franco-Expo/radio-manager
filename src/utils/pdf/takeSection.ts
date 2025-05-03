
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';
import { FONT_SIZES, DOCUMENT_MARGINS, checkForPageBreak, PAGE_HEIGHT } from './documentStyles';
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
  for (let i = 0; i < sortedTakes.length; i++) {
    const take = sortedTakes[i];
    
    // Estimate height needed for take header
    const takeHeaderHeight = 16; // Approximate height for title and date
    
    // Check if we need a page break for the take header
    if (y + takeHeaderHeight > PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 10) {
      doc.addPage();
      y = DOCUMENT_MARGINS.top;
    }
    
    // Take header
    doc.setFontSize(FONT_SIZES.subtitle);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, DOCUMENT_MARGINS.left, y);
    y += 6;
    
    if (take.date) {
      doc.setFontSize(FONT_SIZES.small);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text(`Data: ${new Date(take.date).toLocaleDateString('it-IT')}`, DOCUMENT_MARGINS.left + 10, y);
      y += 7;
    }
    
    // Render songs for this take
    y = renderSongs(doc, take.songs, y);
    
    // Space between takes
    y += 8; // Space between takes
    
    // Check if we have enough space for the next take header
    if (i < sortedTakes.length - 1 && y + 15 > PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 10) {
      doc.addPage();
      y = DOCUMENT_MARGINS.top;
    }
  }
}
