
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';
import { Program } from './pdf/types';
import { setupDocumentProperties, addFooter, FONT_SIZES, DOCUMENT_MARGINS, checkForPageBreak } from './pdf/documentStyles';
import { addProgramHeader } from './pdf/headerSection';

export function generatePlaylistPdf(program: Program, takes: Take[]) {
  // Create a new PDF document - A4 format
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Setup document properties
  setupDocumentProperties(doc, {
    title: `Playlist ${program.name}`,
    subject: 'Radio Program Playlist',
    author: 'Radio Manager',
    creator: 'Radio Manager App'
  });
  
  // Add program header with subtitle indicating this is a playlist
  let y = addProgramHeader(doc, program);
  
  // Add playlist subtitle
  doc.setFontSize(FONT_SIZES.subtitle);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(80);
  doc.text("Playlist", DOCUMENT_MARGINS.left, y);
  y += 8;
  
  // Sort takes by number
  const sortedTakes = [...takes].sort((a, b) => a.number - b.number);
  
  if (sortedTakes.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(FONT_SIZES.normal);
    doc.setTextColor(80);
    doc.text("Nessun take disponibile per questo programma", DOCUMENT_MARGINS.left, y);
  } else {
    // Loop through each take
    for (const take of sortedTakes) {
      // Take header
      y = checkForPageBreak(doc, y, 10);
      doc.setFontSize(FONT_SIZES.subtitle);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(`Take ${String(take.number).padStart(2, '0')}`, DOCUMENT_MARGINS.left, y);
      y += 6;
      
      // Sort songs by ID
      const sortedSongs = [...take.songs].sort((a, b) => a.id.localeCompare(b.id));
      
      if (sortedSongs.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(FONT_SIZES.small);
        doc.setTextColor(80);
        doc.text("Nessuna canzone in questa take", DOCUMENT_MARGINS.left + 10, y);
        y += 5;
      } else {
        // Reset text color for songs
        doc.setTextColor(0);
        
        // Loop through each song in the take
        for (let i = 0; i < sortedSongs.length; i++) {
          const song = sortedSongs[i];
          
          // Check for page break
          y = checkForPageBreak(doc, y, 5);
          
          // Song title with artist (without news)
          doc.setFontSize(FONT_SIZES.normal);
          doc.setFont("helvetica", "normal");
          
          // Format: Number. Title - Artist
          const titleText = song.title || "Titolo non specificato";
          const artistText = song.artist ? ` - ${song.artist}` : "";
          const songText = `${i + 1}. ${titleText}${artistText}`;
          
          doc.text(songText, DOCUMENT_MARGINS.left + 10, y);
          y += 5; // Small space between songs
        }
      }
      
      // Space between takes
      y += 5;
    }
  }
  
  // Add footer with page numbers
  addFooter(doc, `Playlist ${program.name}`);
  
  // Save the PDF
  doc.save(`Playlist_${program.name.replace(/\s+/g, '_')}.pdf`);
}
