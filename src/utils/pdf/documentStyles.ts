import { jsPDF } from 'jspdf';

// Constants for document styling
export const DOCUMENT_MARGINS = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

// Updated font sizes to be more like Microsoft Word standard formatting
export const FONT_SIZES = {
  title: 16,    // Reduced from 24 to be less dramatic
  subtitle: 13, // More appropriate for section headers
  normal: 11,   // Standard Word document size
  small: 10,
  footer: 9
};

// Page dimensions
export const PAGE_WIDTH = 210; // A4 width in mm
export const PAGE_HEIGHT = 297; // A4 height in mm
export const CONTENT_HEIGHT = PAGE_HEIGHT - DOCUMENT_MARGINS.top - DOCUMENT_MARGINS.bottom;

// Line height to be used for calculations
export const LINE_HEIGHT = 5;

// Line number from bottom for forced page break (49 lines from bottom)
export const FORCE_BREAK_LINE = PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - (49 * LINE_HEIGHT);

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
  
  // Set default font size and font family for the document
  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT_SIZES.normal);
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
    doc.line(DOCUMENT_MARGINS.left, PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 5, 
             pageWidth - DOCUMENT_MARGINS.right, PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 5);
    
    // Add program name on left
    doc.text(programName, DOCUMENT_MARGINS.left, PAGE_HEIGHT - DOCUMENT_MARGINS.bottom + 2);
    
    // Add page number on right
    const pageText = `Pagina ${i} di ${pageCount}`;
    const textWidth = doc.getStringUnitWidth(pageText) * FONT_SIZES.footer / doc.internal.scaleFactor;
    doc.text(pageText, pageWidth - textWidth - DOCUMENT_MARGINS.right, PAGE_HEIGHT - DOCUMENT_MARGINS.bottom + 2);
  }
}

// Helper function to check if there's enough space on the current page
export function checkForPageBreak(doc: jsPDF, y: number, requiredHeight: number): number {
  // Check if we've reached the forced break line
  if (y >= FORCE_BREAK_LINE) {
    doc.addPage();
    return DOCUMENT_MARGINS.top;
  }
  
  // Also keep the original functionality to check for space
  const maxY = PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 10;
  
  if (y + requiredHeight > maxY) {
    doc.addPage();
    return DOCUMENT_MARGINS.top;
  }
  
  return y;
}
