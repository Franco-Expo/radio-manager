
import { useToast } from "@/hooks/use-toast";
import { generateProgramPdf } from "@/utils/pdfGenerator";
import { Program } from "@/types/programs";
import { Take } from "@/types/takes";

export function usePdfExport(
  programs: Program[],
  takes: Take[],
  selectedProgramId: string | undefined,
  setSelectedProgramId: (id: string | undefined) => void
) {
  const { toast } = useToast();
  
  const handleExportToPdf = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) {
      toast({
        title: "Errore",
        description: "Programma non trovato",
        variant: "destructive",
      });
      return;
    }
    
    // Make sure we have the takes for this specific program
    if (selectedProgramId !== programId) {
      setSelectedProgramId(programId);
      setTimeout(() => {
        try {
          generateProgramPdf(program, takes);
          toast({
            title: "PDF generato",
            description: `Il programma "${program.name}" è stato salvato come PDF`,
          });
        } catch (error) {
          toast({
            title: "Errore",
            description: "Si è verificato un errore durante la generazione del PDF",
            variant: "destructive",
          });
          console.error("PDF generation error:", error);
        }
      }, 1000); // Give time for the takes to load
    } else {
      try {
        generateProgramPdf(program, takes);
        toast({
          title: "PDF generato",
          description: `Il programma "${program.name}" è stato salvato come PDF`,
        });
      } catch (error) {
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la generazione del PDF",
          variant: "destructive",
        });
        console.error("PDF generation error:", error);
      }
    }
  };

  return {
    handleExportToPdf
  };
}
