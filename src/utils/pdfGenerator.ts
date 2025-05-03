
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';

export type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

export function generateProgramPdf(program: Program, takes: Take[]) {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Programma ${program.name}`,
    subject: 'Radio Program Schedule',
    author: 'Radio Manager',
    creator: 'Radio Manager App'
  });

  // Add footer to all pages
  const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();
    // For each page
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageWidth = doc.internal.pageSize.width;
      
      // Set footer styling
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100);
      
      // Add program name on left
      doc.text(program.name, 20, 285);
      
      // Add page number on right
      const pageText = `Pagina ${i} di ${pageCount}`;
      const textWidth = doc.getStringUnitWidth(pageText) * 9 / doc.internal.scaleFactor;
      doc.text(pageText, pageWidth - textWidth - 20, 285);
    }
  };
  
  // Set up initial position
  let y = 30;
  
  // Set font size to 11pt as requested
  doc.setFontSize(11);
  
  // Add program title with modern styling
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.setFontSize(26);
  
  // Calculate center position for title
  const titleWidth = doc.getStringUnitWidth(program.name) * 26 / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  
  doc.text(program.name, titleX, y);
  y += 16;
  
  // Add stylish divider
  doc.setDrawColor(0);
  doc.setLineWidth(1);
  doc.line(40, y, doc.internal.pageSize.width - 40, y);
  y += 14;
  
  // Add publication date with modern styling
  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.setFont("helvetica", "italic");
  
  const pubDateText = program.publishDate 
    ? `Pubblicato il ${new Date(program.publishDate).toLocaleDateString('it-IT')}`
    : "Data di pubblicazione non disponibile";
  
  doc.text(pubDateText, 40, y);
  y += 6;
  
  // Add generation date
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, 40, y);
  y += 16;
  
  // Sort takes by number
  const sortedTakes = [...takes].sort((a, b) => a.number - b.number);
  
  if (sortedTakes.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Nessun take disponibile per questo programma", 40, y);
  }
  
  // Loop through each take
  for (const take of sortedTakes) {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 30;
    }
    
    // Add take header with simple styling (no background)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, 30, y);
    y += 12;
    
    if (take.date) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(60);
      doc.text(`Data: ${new Date(take.date).toLocaleDateString('it-IT')}`, 40, y);
      y += 8;
    }
    
    // Sort songs by ID to maintain order
    const sortedSongs = [...take.songs].sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    
    if (sortedSongs.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text("Nessuna canzone in questa take", 40, y);
      y += 8;
    }
    
    // Reset text color for songs
    doc.setTextColor(0);
    
    // Loop through each song
    for (let i = 0; i < sortedSongs.length; i++) {
      const song = sortedSongs[i];
      
      // Check if we need a new page
      if (y > 265) {
        doc.addPage();
        y = 30;
      }
      
      // Song title with font size 11pt
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${song.title || "Titolo non specificato"}`, 40, y);
      y += 6;
      
      // Add news with font size 11pt
      if (song.news && song.news.trim()) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40);
        
        const splitText = doc.splitTextToSize(song.news, 150);
        doc.text(splitText, 50, y);
        y += 6 * Math.min(splitText.length, 1) + (splitText.length > 1 ? 3 : 0);
      } else {
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(80);
        doc.text("Nessuna notizia", 50, y);
        y += 6;
      }
      
      // Add a single line separation between songs (but not after the last song)
      if (i < sortedSongs.length - 1) {
        doc.setDrawColor(150);
        doc.setLineWidth(0.2);
        doc.line(50, y + 1, 160, y + 1);
        y += 5; // Just 1 line of separation as requested
      }
    }
    
    // Add space between takes
    y += 10;
  }
  
  // Add footer with page numbers to all pages
  addFooter(doc);
  
  // Save the PDF
  doc.save(`Programma_${program.name.replace(/\s+/g, '_')}.pdf`);
}
