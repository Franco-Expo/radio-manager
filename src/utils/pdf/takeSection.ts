
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';
import { FONT_SIZES, PAGE_HEIGHT } from './documentStyles';
import { renderSongs } from './songSection';

export function renderTakes(doc: jsPDF, takes: Take[], startY: number): void {
  let y = startY;
  
  // Sort takes by number
  const sortedTakes = [...takes].sort((a, b) => a.number - b.number);
  
  if (sortedTakes.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(FONT_SIZES.normal);
    doc.setTextColor(80);
    doc.text("Nessun take disponibile per questo programma", 20, y);
    return;
  }
  
  // Loop through each take
  for (const take of sortedTakes) {
    // Check if we need a new page
    if (y > PAGE_HEIGHT - 40) {
      doc.addPage();
      y = 20;
    }
    
    // Take header
    doc.setFontSize(FONT_SIZES.subtitle);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, 20, y);
    y += 8;
    
    if (take.date) {
      doc.setFontSize(FONT_SIZES.small);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text(`Data: ${new Date(take.date).toLocaleDateString('it-IT')}`, 30, y);
      y += 8;
    }
    
    // Render songs for this take
    y = renderSongs(doc, take.songs, y);
    
    // Space between takes
    y += 10; // Space between takes
  }
}
