
import { APP_NAME } from "@/lib/constants";
import { useDateTime } from "@/hooks/useDateTime";
import { useIsMobile } from "@/hooks/use-mobile";

export function Footer() {
  const { formattedDate, formattedTime } = useDateTime();
  const isMobile = useIsMobile();
  
  return (
    <footer className="w-full py-2 px-4 md:py-3 md:px-6 border-t bg-background mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
        <div className="text-xs md:text-sm font-medium">
          {APP_NAME} <a href="https://studionet4.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dev by Studionet4.com</a>
        </div>
        {isMobile ? (
          <div className="text-xs text-muted-foreground">
            {formattedDate} | {formattedTime}
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
            <div className="text-sm text-muted-foreground">{formattedTime} (Europe/Rome)</div>
          </>
        )}
      </div>
    </footer>
  );
}
