
import { jsPDF } from 'jspdf';

// Constants for document styling
export const DOCUMENT_MARGINS = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

export const FONT_SIZES = {
  title: 24,
  subtitle: 14,
  normal: 11,
  small: 10,
  footer: 9
};

export const PAGE_HEIGHT = 280; // Height before footer

// Configure document properties
export function setupDocumentProperties(doc: jsPDF, options: {
  title: string;
  subject: string;
  author: string;
  creator: string;
}) {
  doc.setProperties({
    title: options.title,
    subject: options.subject,
    author: options.author,
    creator: options.creator
  });
}

// Set up footer for all pages
export function addFooter(doc: jsPDF, programName: string) {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.width;
    
    // Set footer style
    doc.setFontSize(FONT_SIZES.footer);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    
    // Add line above footer
    doc.setDrawColor(80);
    doc.setLineWidth(0.5);
    doc.line(20, 280, pageWidth - 20, 280);
    
    // Add program name on left
    doc.text(programName, 20, 285);
    
    // Add page number on right
    const pageText = `Pagina ${i} di ${pageCount}`;
    const textWidth = doc.getStringUnitWidth(pageText) * FONT_SIZES.footer / doc.internal.scaleFactor;
    doc.text(pageText, pageWidth - textWidth - 20, 285);
  }
}
