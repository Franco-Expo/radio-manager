
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';

export type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

export function generateProgramPdf(program: Program, takes: Take[]) {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Programma ${program.name}`,
    subject: 'Radio Program Schedule',
    author: 'Radio Manager',
    creator: 'Radio Manager App'
  });
  
  // Add footer to all pages (will be applied to new pages too)
  const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();
    // For each page
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageWidth = doc.internal.pageSize.width;
      
      // Set footer styling
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      
      // Add program name on left
      doc.text(program.name, 20, 285);
      
      // Add page number on right
      const pageText = `Pagina ${i} di ${pageCount}`;
      const textWidth = doc.getStringUnitWidth(pageText) * 9 / doc.internal.scaleFactor;
      doc.text(pageText, pageWidth - textWidth - 20, 285);
    }
  };
  
  // Set up initial position
  let y = 20;
  
  // Add program title with improved styling
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  
  // Calculate center position for title
  const titleWidth = doc.getStringUnitWidth(program.name) * 24 / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  
  doc.text(program.name, titleX, y);
  y += 15;
  
  // Add divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;
  
  // Add publication date
  doc.setFontSize(11); // Reduced font size
  doc.setFont("helvetica", "normal");
  doc.text(
    "Data di Pubblicazione: " + (program.publishDate 
      ? new Date(program.publishDate).toLocaleDateString('it-IT') 
      : "Pubblicazione del programma non registrata"), 
    20, 
    y
  );
  y += 8; // Reduced spacing
  
  // Add generation date
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, 20, y);
  y += 10; // Reduced spacing
  
  // Sort takes by number
  const sortedTakes = [...takes].sort((a, b) => a.number - b.number);
  
  // Loop through each take
  for (const take of sortedTakes) {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    // Add take header with improved styling
    doc.setFontSize(14); // Reduced font size
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, 20, y);
    y += 6; // Reduced spacing
    
    if (take.date) {
      doc.setFontSize(11); // Reduced font size
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text(`Data: ${new Date(take.date).toLocaleDateString('it-IT')}`, 25, y);
      y += 8; // Reduced spacing
    }
    
    // Sort songs by ID to maintain order
    const sortedSongs = [...take.songs].sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    
    // Reset text color for songs
    doc.setTextColor(0, 0, 0);
    
    // Loop through each song
    for (let i = 0; i < sortedSongs.length; i++) {
      const song = sortedSongs[i];
      
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(11); // Reduced font size 
      doc.setFont("helvetica", "bold");
      doc.text(`Brano: ${song.title}`, 30, y);
      y += 6; // Reduced spacing
      
      // Add news without background
      if (song.news && song.news.trim()) {
        doc.setFontSize(11); // Reduced font size
        doc.setFont("helvetica", "normal");
        
        // Removed background styling
        
        const splitText = doc.splitTextToSize(`News: ${song.news}`, 150);
        doc.text(splitText, 40, y);
        y += 6 * splitText.length + 2; // More compact spacing
      } else {
        y += 2; // Minimal spacing when no news
      }
      
      // Add thin line separator between songs (but not after the last song)
      if (i < sortedSongs.length - 1) {
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.2);
        doc.line(40, y + 1, 170, y + 1);
        y += 3; // Just 1 line of separation
      }
    }
    
    // Add a subtle divider between takes if there were songs
    if (sortedSongs.length > 0) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(20, y, 190, y);
      y += 6; // Only 2 rows of separation (approximately)
    } else {
      y += 4; // Reduced spacing
    }
  }
  
  // Add footer with page numbers to all pages
  addFooter(doc);
  
  // Save the PDF
  doc.save(`Programma_${program.name.replace(/\s+/g, '_')}.pdf`);
}
