
import { jsPDF } from 'jspdf';
import { Take } from '@/types/takes';

export type Program = {
  id: string;
  name: string;
  publishDate: Date | null;
};

export function generateProgramPdf(program: Program, takes: Take[]) {
  // Crea un nuovo documento PDF
  const doc = new jsPDF();
  
  // Imposta proprietà del documento
  doc.setProperties({
    title: `Programma ${program.name}`,
    subject: 'Radio Program Schedule',
    author: 'Radio Manager',
    creator: 'Radio Manager App'
  });

  // Aggiungi piè di pagina a tutte le pagine
  const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();
    // Per ogni pagina
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageWidth = doc.internal.pageSize.width;
      
      // Imposta stile piè di pagina
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100);
      
      // Aggiungi nome programma a sinistra
      doc.text(program.name, 20, 285);
      
      // Aggiungi numero pagina a destra
      const pageText = `Pagina ${i} di ${pageCount}`;
      const textWidth = doc.getStringUnitWidth(pageText) * 9 / doc.internal.scaleFactor;
      doc.text(pageText, pageWidth - textWidth - 20, 285);
    }
  };
  
  // Posizione iniziale
  let y = 20;
  
  // Dimensione font 11pt come richiesto
  doc.setFontSize(11);
  
  // Titolo del programma con stile moderno
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.setFontSize(24);
  
  // Calcola posizione centrale per titolo
  const titleWidth = doc.getStringUnitWidth(program.name) * 24 / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  
  doc.text(program.name, titleX, y);
  y += 12;
  
  // Divisore stilizzato
  doc.setDrawColor(80);
  doc.setLineWidth(0.5);
  doc.line(40, y, doc.internal.pageSize.width - 40, y);
  y += 12;
  
  // Data di pubblicazione
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.setFont("helvetica", "italic");
  
  const pubDateText = program.publishDate 
    ? `Pubblicato il ${new Date(program.publishDate).toLocaleDateString('it-IT')}`
    : "Data di pubblicazione non disponibile";
  
  doc.text(pubDateText, 40, y);
  y += 6;
  
  // Data di generazione
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, 40, y);
  y += 16;
  
  // Ordina take per numero
  const sortedTakes = [...takes].sort((a, b) => a.number - b.number);
  
  if (sortedTakes.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Nessun take disponibile per questo programma", 40, y);
  }
  
  // Ciclo attraverso ogni take
  for (const take of sortedTakes) {
    // Verifica se serve una nuova pagina
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    
    // Intestazione take
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Take ${String(take.number).padStart(2, '0')}`, 30, y);
    y += 10;
    
    if (take.date) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text(`Data: ${new Date(take.date).toLocaleDateString('it-IT')}`, 40, y);
      y += 10;
    }
    
    // Ordina canzoni per ID per mantenere l'ordine
    const sortedSongs = [...take.songs].sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    
    if (sortedSongs.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80);
      doc.text("Nessuna canzone in questa take", 40, y);
      y += 10;
    }
    
    // Ripristina colore testo per canzoni
    doc.setTextColor(0);
    
    // Ciclo attraverso ogni canzone
    for (let i = 0; i < sortedSongs.length; i++) {
      const song = sortedSongs[i];
      
      // Verifica se serve una nuova pagina
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      // Titolo canzone
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${song.title || "Titolo non specificato"}`, 40, y);
      y += 12; // Aumentato spazio dopo il titolo
      
      // Aggiungi notizie
      if (song.news && song.news.trim()) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40);
        
        // Gestione del testo su più righe - limitato a 140 caratteri per riga
        const splitText = doc.splitTextToSize(song.news, 140);
        
        // Verifica se è necessaria una nuova pagina per il testo della notizia
        if (y + splitText.length * 6 > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(splitText, 50, y);
        
        // Aggiorna la posizione Y basata sul numero di righe (minimo 1)
        const linesCount = Math.max(1, splitText.length);
        y += 6 * linesCount + 8; // Spazio aggiuntivo dopo la notizia
      } else {
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(80);
        doc.text("Nessuna notizia", 50, y);
        y += 14;
      }
      
      // Aggiungi due linee di separazione tra canzoni (ma non dopo l'ultima)
      if (i < sortedSongs.length - 1) {
        // Verifica se c'è abbastanza spazio per le linee di separazione
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        
        // Prima linea
        doc.setDrawColor(150);
        doc.setLineWidth(0.2);
        doc.line(50, y, 160, y);
        
        // Spazio tra le linee
        y += 3;
        
        // Seconda linea
        doc.setDrawColor(150);
        doc.setLineWidth(0.2);
        doc.line(50, y, 160, y);
        
        // Spazio dopo la doppia linea
        y += 15; // Aumentato spazio tra canzoni
      }
    }
    
    // Aggiungi spazio tra takes
    y += 15;
  }
  
  // Aggiungi piè di pagina con numeri di pagina
  addFooter(doc);
  
  // Salva il PDF
  doc.save(`Programma_${program.name.replace(/\s+/g, '_')}.pdf`);
}
