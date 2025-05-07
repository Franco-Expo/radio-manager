
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [programSearchQuery, setProgramSearchQuery] = useState("");
  const [publishedSearchQuery, setPublishedSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return {
    isCollapsed,
    setIsCollapsed,
    programSearchQuery,
    setProgramSearchQuery,
    publishedSearchQuery,
    setPublishedSearchQuery,
    isMobile,
    toggleSidebar
  };
}
