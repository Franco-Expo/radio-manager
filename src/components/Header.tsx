
import { ThemeSwitcher } from "./ThemeSwitcher";
import { APP_NAME } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="w-full py-4 px-6 border-b bg-background flex items-center justify-between">
      <div 
        className="flex items-center cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <h1 className="font-bold text-xl md:text-2xl text-primary">{APP_NAME}</h1>
      </div>
      <ThemeSwitcher />
    </header>
  );
}
