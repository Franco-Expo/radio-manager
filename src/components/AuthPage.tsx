
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="flex flex-col min-h-[90vh] items-center justify-center p-6">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-2">{APP_NAME}</h1>
        <p className="text-lg text-muted-foreground">{APP_DESCRIPTION}</p>
      </div>
      
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6 justify-center animate-slide-in">
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
