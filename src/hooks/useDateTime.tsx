
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export function useDateTime() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format date as dd/MM/yyyy
  const formattedDate = format(currentDate, "dd/MM/yyyy", { locale: it });
  
  // Format time in Europe/Rome timezone
  const formattedTime = format(
    currentDate,
    "HH:mm:ss",
    { locale: it }
  );
  
  return {
    currentDate,
    formattedDate,
    formattedTime
  };
}
