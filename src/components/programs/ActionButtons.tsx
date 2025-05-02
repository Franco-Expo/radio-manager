
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type ActionButtonsProps = {
  onAddTake: () => void;
  onSaveProgram: () => void;
};

export function ActionButtons({ onAddTake, onSaveProgram }: ActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={onAddTake}>
        Aggiungi Altra Take
      </Button>
      <Button 
        variant="default" 
        onClick={onSaveProgram}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Salva il Programma
      </Button>
    </div>
  );
}
