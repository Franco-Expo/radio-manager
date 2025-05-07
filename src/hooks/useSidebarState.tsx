
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

export function useSidebarState() {
  const [programSearchQuery, setProgramSearchQuery] = useState("");
  const [publishedSearchQuery, setPublishedSearchQuery] = useState("");
  const isMobile = useIsMobile();
  
  // We use the shadcn sidebar context
  let sidebarState = { 
    open: true, 
    setOpen: (value: boolean) => {}, 
    state: "expanded" as "expanded" | "collapsed",
    toggleSidebar: () => {}
  };
  
  try {
    // Try to use the shadcn sidebar context if available
    const sidebar = useSidebar();
    sidebarState = {
      open: sidebar.open,
      setOpen: sidebar.setOpen,
      state: sidebar.state,
      toggleSidebar: sidebar.toggleSidebar
    };
  } catch (error) {
    // Fallback to default values if not in context
    console.log("Using default sidebar state");
  }
  
  // Is the sidebar collapsed (not open)
  const isCollapsed = sidebarState.state === "collapsed";
  
  const setIsCollapsed = (collapsed: boolean) => {
    sidebarState.setOpen(!collapsed);
  };
  
  const toggleSidebar = () => {
    sidebarState.toggleSidebar();
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
