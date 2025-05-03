
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
      
      // Set footer style
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100);
      
      // Add line above footer
      doc.setDrawColor(80);
      doc.setLineWidth(0.5);
      doc.line(20, 280, pageWidth - 20, 280);
      
      // Add program name on left
      doc.text(program.name, 20, 285);
      
      // Add page number on right
      const pageText = `Pagina ${i} di ${pageCount}`;
      const textWidth = doc.getStringUnitWidth(pageText) * 9 / doc.internal.scaleFactor;
      doc.text(pageText, pageWidth - textWidth - 20, 285);
    }
  };
  
  // Initial position
  let y = 20;
  
  // Set font size to 11pt as required
  doc.setFontSize(11);
  
  // Program title with modern style
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.setFontSize(24);
  
  // Calculate center position for title
  const titleWidth = doc.getStringUnitWidth(program.name) * 24 / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  
  doc.text(program.name, titleX, y);
  y += 12;
  
  // Stylized divider at the top
  doc.setDrawColor(80);
  doc.setLineWidth(0.5);
  doc.line(20, y, doc.internal.pageSize.width - 20, y);
  y += 12;
  
  // Publication date
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.setFont("helvetica", "italic");
  
  const pubDateText = program.publishDate 
    ? `Pubblicato il ${new Date(program.publishDate).toLocaleDateString('it-IT')}`
    : "Data di pubblicazione non disponibile";
  
  doc.text(pubDateText, 20, y);
  y += 6;
  
  // Generation date
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, 20, y);
  y += 12;
  
  // Sort takes by number
  const sortedTakes = [...takes].sort((a, b) => a.number - b.number);
  
  if (sortedTakes.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Nessun take disponibile per questo programma", 20, y);
  }
  
  // Loop through each take
  for (const take of sortedTakes) {
    // Check if we need a new page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    
    // Take header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, 20, y);
    y += 8;
    
    if (take.date) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text(`Data: ${new Date(take.date).toLocaleDateString('it-IT')}`, 30, y);
      y += 8;
    }
    
    // Sort songs by ID to maintain order
    const sortedSongs = [...take.songs].sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    
    if (sortedSongs.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text("Nessuna canzone in questa take", 30, y);
      y += 8;
    }
    
    // Reset text color for songs
    doc.setTextColor(0);
    
    // Loop through each song
    for (let i = 0; i < sortedSongs.length; i++) {
      const song = sortedSongs[i];
      
      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      // Song title - more compact
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${song.title || "Titolo non specificato"}`, 30, y);
      y += 6; // Reduced space after title
      
      // Add news
      if (song.news && song.news.trim()) {
        doc.setFontSize(10); // Smaller font for news to fit more on page
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40);
        
        // Text handling - limited to 150 characters per line for better space usage
        const splitText = doc.splitTextToSize(song.news, 150);
        
        // Check if we need a new page for news text
        if (y + splitText.length * 5 > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(splitText, 35, y);
        
        // Update Y position based on number of lines (minimum 1)
        const linesCount = Math.max(1, splitText.length);
        y += 5 * linesCount + 5; // Reduced space after news
      } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(80);
        doc.text("Nessuna notizia", 35, y);
        y += 8;
      }
      
      // No separation lines between songs
      // Just add a small space between songs
      if (i < sortedSongs.length - 1) {
        y += 6; // Reduced space between songs
      }
    }
    
    // Space between takes
    y += 10; // Reduced space between takes
  }
  
  // Add footer with page numbers
  addFooter(doc);
  
  // Save the PDF
  doc.save(`Programma_${program.name.replace(/\s+/g, '_')}.pdf`);
}
