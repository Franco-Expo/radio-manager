
import { jsPDF } from 'jspdf';
import { Song } from '@/types/takes';
import { FONT_SIZES, DOCUMENT_MARGINS, checkForPageBreak, PAGE_HEIGHT } from './documentStyles';

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
    
    // Check for page break before starting a new song
    // We need at least 30mm of space for a song title and minimal content
    const neededSpace = 30;
    if (y + neededSpace > PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 10) {
      doc.addPage();
      y = DOCUMENT_MARGINS.top;
    }
    
    // Song title with artist
    doc.setFontSize(FONT_SIZES.normal);
    doc.setFont("helvetica", "bold");
    
    // Format: Number. Title - Artist
    const titleText = song.title || "Titolo non specificato";
    const artistText = song.artist ? ` - ${song.artist}` : "";
    doc.text(`${i + 1}. ${titleText}${artistText}`, DOCUMENT_MARGINS.left + 10, y);
    
    // Move down for news (with an empty line in between)
    y += 7; // This creates the empty line between title and news
    
    // Add news
    if (song.news && song.news.trim()) {
      doc.setFontSize(FONT_SIZES.normal);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40);
      
      // Split text to respect margins
      const maxWidth = doc.internal.pageSize.width - DOCUMENT_MARGINS.left - DOCUMENT_MARGINS.right - 15;
      const splitText = doc.splitTextToSize(song.news, maxWidth);
      
      // Check if news text will fit on current page, otherwise move to next page
      const textHeight = splitText.length * 5 + 2;
      if (y + textHeight > PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 10) {
        doc.addPage();
        y = DOCUMENT_MARGINS.top;
      }
      
      doc.text(splitText, DOCUMENT_MARGINS.left + 15, y);
      
      // Update Y position based on number of lines
      y += textHeight;
    } else {
      doc.setFontSize(FONT_SIZES.small);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text("Nessuna notizia", DOCUMENT_MARGINS.left + 15, y);
      y += 7;
    }
    
    // Space between songs
    y += 7;
    
    // Check if we have enough space for at least some content of the next song
    if (i < sortedSongs.length - 1 && y + 15 > PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 10) {
      doc.addPage();
      y = DOCUMENT_MARGINS.top;
    }
  }
  
  return y; // Return the updated Y position
}
