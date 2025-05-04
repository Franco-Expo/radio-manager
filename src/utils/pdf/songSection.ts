
import { jsPDF } from 'jspdf';
import { Song } from '@/types/takes';
import { FONT_SIZES, DOCUMENT_MARGINS, checkForPageBreak } from './documentStyles';

export function renderSongs(doc: jsPDF, songs: Song[], startY: number): number {
  let y = startY;
  
  // Sort songs by ID to maintain order
  const sortedSongs = [...songs].sort((a, b) => {
    return a.id.localeCompare(b.id);
  });
  
  if (sortedSongs.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80);
    doc.text("Nessuna canzone in questa take", DOCUMENT_MARGINS.left + 10, y);
    return y + 7;
  }
  
  // Reset text color for songs
  doc.setTextColor(0);
  
  // Loop through each song
  for (let i = 0; i < sortedSongs.length; i++) {
    const song = sortedSongs[i];
    
    // Song title with artist
    doc.setFontSize(FONT_SIZES.normal);
    doc.setFont("helvetica", "bold");
    
    // Format: Number. Title - Artist
    const titleText = song.title || "Titolo non specificato";
    const artistText = song.artist ? ` - ${song.artist}` : "";
    const songHeaderHeight = 7;
    
    // Check for page break before drawing the song title
    y = checkForPageBreak(doc, y, songHeaderHeight);
    doc.text(`${i + 1}. ${titleText}${artistText}`, DOCUMENT_MARGINS.left + 10, y);
    
    // Move down just slightly for news (eliminating empty space)
    y += 4;
    
    // Add news
    if (song.news && song.news.trim()) {
      doc.setFontSize(FONT_SIZES.normal);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40);
      
      // Split text to respect margins
      const maxWidth = doc.internal.pageSize.width - DOCUMENT_MARGINS.left - DOCUMENT_MARGINS.right - 15;
      const splitText = doc.splitTextToSize(song.news, maxWidth);
      
      // Calculate news text height
      const newsHeight = splitText.length * 5;
      
      // Check for page break before drawing the news
      y = checkForPageBreak(doc, y, newsHeight);
      doc.text(splitText, DOCUMENT_MARGINS.left + 15, y);
      
      // Update Y position based on number of lines
      y += newsHeight;
    } else {
      doc.setFontSize(FONT_SIZES.small);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      
      // Check for page break
      y = checkForPageBreak(doc, y, 7);
      doc.text("Nessuna notizia", DOCUMENT_MARGINS.left + 15, y);
      y += 5;
    }
    
    // Minimal space between songs
    y += 3;
  }
  
  return y;
}
