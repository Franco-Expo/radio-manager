
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
    
    // Estimate height needed for song title and artist
    const songTitleHeight = 12; // Increased to accommodate title and artist
    
    // Check if we need a new page for the song title
    y = checkForPageBreak(doc, y, songTitleHeight);
    
    // Song title
    doc.setFontSize(FONT_SIZES.normal);
    doc.setFont("helvetica", "bold");
    
    // Format: Number. Title - Artist
    const titleText = song.title || "Titolo non specificato";
    const artistText = song.artist ? ` - ${song.artist}` : "";
    doc.text(`${i + 1}. ${titleText}${artistText}`, DOCUMENT_MARGINS.left + 10, y);
    y += 8; // Increased spacing after title/artist
    
    // Add news
    if (song.news && song.news.trim()) {
      doc.setFontSize(FONT_SIZES.normal);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40);
      
      // Split text to respect margins
      const maxWidth = doc.internal.pageSize.width - DOCUMENT_MARGINS.left - DOCUMENT_MARGINS.right - 15;
      const splitText = doc.splitTextToSize(song.news, maxWidth);
      
      // Check height needed for the news text
      const textHeight = splitText.length * 5;
      
      // Check if we need a new page for the news text
      y = checkForPageBreak(doc, y, textHeight);
      
      doc.text(splitText, DOCUMENT_MARGINS.left + 15, y);
      
      // Update Y position based on number of lines
      y += textHeight + 2;
    } else {
      doc.setFontSize(FONT_SIZES.small);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text("Nessuna notizia", DOCUMENT_MARGINS.left + 15, y);
      y += 7;
    }
    
    // Small space between songs
    y += 5; // Increased space between songs
  }
  
  return y; // Return the updated Y position
}
