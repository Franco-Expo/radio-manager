
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

export function useSidebarState() {
  const [programSearchQuery, setProgramSearchQuery] = useState("");
  const [publishedSearchQuery, setPublishedSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  // We could use the builtin sidebar state from shadcn, but this approach
  // maintains backward compatibility with the existing components
  let sidebarState = { 
    open: true, 
    setOpen: (value: boolean) => {}, 
    state: "expanded" as const 
  };
  
  try {
    // Try to use the shadcn sidebar context if available
    sidebarState = useSidebar();
  } catch (error) {
    // Fallback to default values if not in context
    console.log("Using default sidebar state");
  }
  
  const isCollapsed = sidebarState.state === "collapsed";
  
  const setIsCollapsed = (collapsed: boolean) => {
    sidebarState.setOpen(!collapsed);
  };
  
  const toggleSidebar = () => {
    sidebarState.setOpen(!sidebarState.open);
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
