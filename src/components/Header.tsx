
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout effettuato con successo");
    } catch (error) {
      console.error("Errore durante il logout:", error);
      toast.error("Errore durante il logout");
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to={isAuthenticated ? "/dashboard" : "/auth"} className="flex items-center gap-2">
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
        </div>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {showMenu && (
              <div className="absolute top-16 right-0 z-50 w-48 rounded-md bg-background shadow-lg border animate-fade-in">
                {isAuthenticated && (
                  <div className="p-2 border-b">
                    <p className="text-sm text-muted-foreground px-3 py-1">{user?.email}</p>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
                <div className="p-2">
                  <ThemeSwitcher />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            
            {isAuthenticated && (
              <div className="flex items-center gap-4">
                <span className="text-sm hidden md:inline-block">
                  {user?.email}
                </span>
                <Button
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
