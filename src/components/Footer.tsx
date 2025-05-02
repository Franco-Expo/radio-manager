
import { APP_NAME } from "@/lib/constants";
import { useDateTime } from "@/hooks/useDateTime";

export function Footer() {
  const { formattedDate, formattedTime } = useDateTime();
  
  return (
    <footer className="w-full py-3 px-6 border-t bg-background mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-sm font-medium">{APP_NAME}</div>
        <div className="text-sm text-muted-foreground">{formattedDate}</div>
        <div className="text-sm text-muted-foreground">{formattedTime} (Europe/Rome)</div>
      </div>
    </footer>
  );
}
