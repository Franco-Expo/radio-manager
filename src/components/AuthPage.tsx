
import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // Show loading spinner when checking authentication status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Caricamento...</span>
      </div>
    );
  }

  const handleLoginSuccess = () => {
    toast({
      title: "Accesso riuscito!",
      description: "Benvenuto nel tuo account.",
    });
  };

  const handleRegisterSuccess = () => {
    toast({
      title: "Registrazione riuscita!",
      description: "Il tuo account è stato creato con successo.",
    });
    setActiveTab("login");
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Radio Manager</h1>
          <p className="mt-2 text-muted-foreground">
            Accedi per gestire i tuoi programmi radio
          </p>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="login">Accedi</TabsTrigger>
            <TabsTrigger value="register">Registrati</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSuccess={handleLoginSuccess} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSuccess={handleRegisterSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
