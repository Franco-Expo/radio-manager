
import { jsPDF } from 'jspdf';

// Constants for document styling
export const DOCUMENT_MARGINS = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

export const FONT_SIZES = {
  title: 16,
  subtitle: 13,
  normal: 11,
  small: 10,
  footer: 9
};

export const PAGE_WIDTH = 210;
export const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - DOCUMENT_MARGINS.left - DOCUMENT_MARGINS.right;
const MAX_Y = PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 10;

// Calcola l'altezza della linea in base alla dimensione del font
export function getLineHeight(doc: jsPDF): number {
  return doc.getFontSize() * 1.5;
}

// Aggiunge testo con gestione automatica delle pagine
export function addAutoPagingText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: {
    maxWidth?: number,
    fontStyle?: 'normal' | 'bold' | 'italic',
    fontSize?: keyof typeof FONT_SIZES
  }
): number {
  const originalFontSize = doc.getFontSize();
  const maxWidth = options?.maxWidth || CONTENT_WIDTH;
  
  // Applica stili temporanei se specificati
  if (options?.fontSize) doc.setFontSize(FONT_SIZES[options.fontSize]);
  if (options?.fontStyle) doc.setFont(doc.getFont().fontName, options.fontStyle);

  const lineHeight = getLineHeight(doc);
  const lines = doc.splitTextToSize(text, maxWidth);

  for (const line of lines) {
    // Controllo avanzato per pagina piena
    if (y + lineHeight > MAX_Y) {
      doc.addPage();
      y = DOCUMENT_MARGINS.top;
    }

    doc.text(line, x, y);
    y += lineHeight;
  }

  // Ripristina stili originali
  doc.setFontSize(originalFontSize);
  doc.setFont(doc.getFont().fontName, 'normal');
  
  return y;
}

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
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT_SIZES.normal);
}

export function addFooter(doc: jsPDF, programName: string) {
  const pageCount = doc.getNumberOfPages();
  const footerY = PAGE_HEIGHT - DOCUMENT_MARGINS.bottom + 2;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(FONT_SIZES.footer);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    
    // Linea separatrice
    doc.setDrawColor(80);
    doc.setLineWidth(0.5);
    doc.line(
      DOCUMENT_MARGINS.left,
      PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 5,
      pageWidth - DOCUMENT_MARGINS.right,
      PAGE_HEIGHT - DOCUMENT_MARGINS.bottom - 5
    );
    
    // Testo footer
    doc.text(programName, DOCUMENT_MARGINS.left, footerY);
    
    // Numero pagina
    const pageText = `Pagina ${i} di ${pageCount}`;
    const textWidth = doc.getTextWidth(pageText);
    doc.text(pageText, pageWidth - textWidth - DOCUMENT_MARGINS.right, footerY);
  }
}

// Nuova funzione per iniziare nuovi blocchi di contenuto
export function startNewContentBlock(doc: jsPDF, y: number, spacing: number = 10): number {
  let newY = y + spacing;
  
  if (newY > MAX_Y) {
    doc.addPage();
    newY = DOCUMENT_MARGINS.top;
  }
  
  return newY;
}