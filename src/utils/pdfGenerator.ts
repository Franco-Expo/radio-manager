
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
  const smallFontSize = 9;
  
  // Set document properties
  doc.setProperties({
    title: `Programma Radio - ${program.name}`,
    creator: 'Radio Manager Pro'
  });
  
  // Add title
  doc.setFontSize(titleFontSize);
  doc.setFont('helvetica', 'bold');
  doc.text(program.name, pageWidth / 2, margin, { align: 'center' });
  
  // Add date
  doc.setFontSize(smallFontSize);
  doc.setFont('helvetica', 'normal');
  const dateText = program.publishDate 
    ? `Data di pubblicazione: ${new Date(program.publishDate).toLocaleDateString('it-IT')}`
    : `Creato il: ${new Date().toLocaleDateString('it-IT')}`;
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
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, margin, yPosition);
    yPosition += 10;
    
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
    
    // Add space between takes
    yPosition += 5;
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
