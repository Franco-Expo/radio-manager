
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';
import { Program } from './pdf/types';
import { setupDocumentProperties, addFooter } from './pdf/documentStyles';
import { addProgramHeader } from './pdf/headerSection';
import { renderTakes } from './pdf/takeSection';

export type { Program } from './pdf/types';

export function generateProgramPdf(program: Program, takes: Take[]) {
  // Create a new PDF document - A4 format
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Setup document properties
  setupDocumentProperties(doc, {
    title: `Programma ${program.name}`,
    subject: 'Radio Program Schedule',
    author: 'Radio Manager',
    creator: 'Radio Manager App'
  });
  
  // Add program header and get the updated Y position
  const startY = addProgramHeader(doc, program);
  
  // Render all takes with their songs
  renderTakes(doc, takes, startY);
  
  // Add footer with page numbers
  addFooter(doc, program.name);
  
  // Save the PDF
  doc.save(`Programma_${program.name.replace(/\s+/g, '_')}.pdf`);
}
