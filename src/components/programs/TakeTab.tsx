
import { TabsTrigger } from "@/components/ui/tabs";

type TakeTabProps = {
  id: string;
  number: number;
};

export function TakeTab({ id, number }: TakeTabProps) {
  return (
    <TabsTrigger key={id} value={id}>
      Take{String(number).padStart(2, '0')}
    </TabsTrigger>
  );
}
