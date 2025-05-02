
import { TabsTrigger } from "@/components/ui/tabs";

type TakeTabProps = {
  id: string;
  number: number;
};

export function TakeTab({ id, number }: TakeTabProps) {
  // Format the take number with leading zeros
  const formattedNumber = String(number).padStart(2, '0');
  
  return (
    <TabsTrigger key={id} value={id}>
      Take{formattedNumber}
    </TabsTrigger>
  );
}
