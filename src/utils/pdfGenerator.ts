
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';

export type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

export function generateProgramPdf(program: Program, takes: Take[]) {
  const doc = new jsPDF();
  
  // Set up initial position
  let y = 20;
  
  // Add program title
  doc.setFontSize(20);
  doc.text(program.name, 20, y);
  y += 10;
  
  // Add publication date
  doc.setFontSize(12);
  doc.text(
    "Data di Pubblicazione: " + (program.publishDate 
      ? new Date(program.publishDate).toLocaleDateString('it-IT') 
      : "Pubblicazione del programma non registrata"), 
    20, 
    y
  );
  y += 15;
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Programma generato il: ${new Date().toLocaleDateString('it-IT')}`, 20, y);
  y += 10;
  
  // Sort takes by number
  const sortedTakes = [...takes].sort((a, b) => a.number - b.number);
  
  // Loop through each take
  for (const take of sortedTakes) {
    y += 10;
    doc.setFontSize(16);
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, 20, y);
    y += 8;
    
    if (take.date) {
      doc.setFontSize(12);
      doc.text(`Data: ${new Date(take.date).toLocaleDateString('it-IT')}`, 25, y);
      y += 10;
    }
    
    // Sort songs by ID to maintain order
    const sortedSongs = [...take.songs].sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    
    // Loop through each song
    for (const song of sortedSongs) {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`Brano: ${song.title}`, 30, y);
      y += 8;
      
      // Add news with word wrap
      if (song.news && song.news.trim()) {
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(`News: ${song.news}`, 160);
        doc.text(splitText, 35, y);
        y += 8 * splitText.length;
      }
      
      y += 5;
    }
  }
  
  // Save the PDF
  doc.save(`Programma_${program.name.replace(/\s+/g, '_')}.pdf`);
}
