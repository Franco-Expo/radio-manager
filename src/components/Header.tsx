
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Link } from "react-router-dom";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={isAuthenticated ? "/dashboard" : "/auth"} className="flex items-center gap-2">
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
        </div>
        
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
                onClick={logout}
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
