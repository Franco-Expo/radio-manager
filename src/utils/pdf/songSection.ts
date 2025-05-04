
import { jsPDF } from 'jspdf';
import { Song } from '@/types/takes';
import { FONT_SIZES, DOCUMENT_MARGINS, checkForPageBreak, addAutoPagingText } from './documentStyles';

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
    return y + 4; // Reduced from 5
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
    const songHeaderText = `${i + 1}. ${titleText}${artistText}`;
    const songHeaderHeight = 4; // Reduced from 5
    
    // Check for page break before drawing the song title
    y = checkForPageBreak(doc, y, songHeaderHeight);
    doc.text(songHeaderText, DOCUMENT_MARGINS.left + 10, y);
    
    // Move down slightly for news, minimizing space
    y += 2; // Reduced from 3
    
    // Add news with optimized text flow
    if (song.news && song.news.trim()) {
      // Use the enhanced text rendering function for news
      doc.setFontSize(FONT_SIZES.normal);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40);
      
      const maxWidth = doc.internal.pageSize.width - DOCUMENT_MARGINS.left - DOCUMENT_MARGINS.right - 15;
      
      // Use the enhanced automatic paging text function with reduced line spacing
      y = addAutoPagingText(doc, song.news, DOCUMENT_MARGINS.left + 15, y, {
        maxWidth: maxWidth,
        lineSpacing: 0.6 // Reduced from 0.9 for much tighter spacing for news
      });
    } else {
      doc.setFontSize(FONT_SIZES.small);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      
      // Check for page break
      y = checkForPageBreak(doc, y, 4); // Reduced from 5
      doc.text("Nessuna notizia", DOCUMENT_MARGINS.left + 15, y);
      y += 3; // Reduced from 4
    }
    
    // Minimal space between songs
    y += 1; // Reduced from 2
  }
  
  return y;
}
