
import { jsPDF } from "jspdf";

type Song = {
  id: string;
  title: string;
  news: string;
};

type Take = {
  id: string;
  number: number;
  songs: Song[];
  date?: Date;
};

type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
  takes?: Take[];
};

export const generateProgramPdf = (program: Program, takes: Take[]): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const titleFontSize = 18;
  const headingFontSize = 14;
  const normalFontSize = 11;
  const smallFontSize = 11;
  
  // Set document properties
  doc.setProperties({
    title: `Programma Radio - ${program.name}`,
    creator: 'Radio Manager Pro'
  });
  
  // Add title
  doc.setFontSize(titleFontSize);
  doc.setFont('helvetica', 'bold');
  doc.text(program.name, pageWidth / 2, margin, { align: 'center' });
  
  // Add publication date
  doc.setFontSize(smallFontSize);
  doc.setFont('helvetica', 'normal');
  const dateText = program.publishDate 
    ? `Data di Pubblicazione: ${new Date(program.publishDate).toLocaleDateString('it-IT')}`
    : "Pubblicazione del programma non registrata";
  doc.text(dateText, pageWidth / 2, margin + 8, { align: 'center' });
  
  let yPosition = margin + 20;
  
  // Add takes and songs
  takes.forEach((take, takeIndex) => {
    // Add page break if not enough space
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Take title
    doc.setFontSize(headingFontSize);
    doc.setFont('helvetica', 'bold');
    const takeTitle = `Take ${String(take.number).padStart(2, '0')}`;
    doc.text(takeTitle, margin, yPosition);
    
    // Aggiungiamo la data della take se disponibile
    if (take.date) {
      doc.setFontSize(smallFontSize);
      doc.setFont('helvetica', 'italic');
      const takeDate = `Data: ${new Date(take.date).toLocaleDateString('it-IT')}`;
      doc.text(takeDate, pageWidth - margin - doc.getStringUnitWidth(takeDate) * smallFontSize / doc.internal.scaleFactor, yPosition);
    }
    
    yPosition += 8;
    
    // Add songs
    take.songs.forEach((song, songIndex) => {
      // Add page break if not enough space
      if (yPosition > doc.internal.pageSize.getHeight() - margin * 2) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Song title
      doc.setFontSize(normalFontSize);
      doc.setFont('helvetica', 'bold');
      doc.text(`${songIndex + 1}. ${song.title}`, margin, yPosition);
      yPosition += 6;
      
      // Song news (split text to fit page width)
      doc.setFontSize(smallFontSize);
      doc.setFont('helvetica', 'normal');
      const textLines = doc.splitTextToSize(song.news, pageWidth - margin * 2);
      doc.text(textLines, margin, yPosition);
      yPosition += textLines.length * 5 + 10;
    });
    
    // Add separator line between takes
    if (takeIndex < takes.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
    }
  });
  
  // Add footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Radio Manager Pro', margin, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Pagina ${i} di ${totalPages}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  }
  
  // Save the PDF
  doc.save(`programma-radio-${program.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};
