
import { jsPDF } from 'jspdf';
import { Song } from '@/types/takes';
import { FONT_SIZES, PAGE_HEIGHT } from './documentStyles';

export function renderSongs(doc: jsPDF, songs: Song[], startY: number): number {
  let y = startY;
  
  // Sort songs by ID to maintain order
  const sortedSongs = [...songs].sort((a, b) => {
    return a.id.localeCompare(b.id);
  });
  
  if (sortedSongs.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80);
    doc.text("Nessuna canzone in questa take", 30, y);
    return y + 8;
  }
  
  // Reset text color for songs
  doc.setTextColor(0);
  
  // Loop through each song
  for (let i = 0; i < sortedSongs.length; i++) {
    const song = sortedSongs[i];
    
    // Check if we need a new page
    if (y > PAGE_HEIGHT - 30) {
      doc.addPage();
      y = 20;
    }
    
    // Song title - more compact
    doc.setFontSize(FONT_SIZES.normal);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${song.title || "Titolo non specificato"}`, 30, y);
    y += 6; // Reduced space after title
    
    // Add news
    if (song.news && song.news.trim()) {
      doc.setFontSize(FONT_SIZES.small); // Smaller font for news to fit more on page
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40);
      
      // Text handling - limited to 150 characters per line for better space usage
      const splitText = doc.splitTextToSize(song.news, 150);
      
      // Check if we need a new page for news text
      if (y + splitText.length * 5 > PAGE_HEIGHT - 10) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(splitText, 35, y);
      
      // Update Y position based on number of lines (minimum 1)
      const linesCount = Math.max(1, splitText.length);
      y += 5 * linesCount + 5; // Reduced space after news
    } else {
      doc.setFontSize(FONT_SIZES.small);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text("Nessuna notizia", 35, y);
      y += 8;
    }
    
    // Add space between songs
    if (i < sortedSongs.length - 1) {
      y += 6; // Space between songs
    }
  }
  
  return y; // Return the updated Y position
}
