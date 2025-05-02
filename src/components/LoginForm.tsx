
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type LoginFormProps = {
  onSwitchToRegister: () => void;
};

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto su Radio Manager Pro",
      });
    } catch (error) {
      toast({
        title: "Errore di accesso",
        description: "Credenziali non valide",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full md:max-w-md card-shadow">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Accedi al tuo Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-user">User</Label>
            <Input 
              id="login-user" 
              placeholder="Il tuo nome utente"
              disabled={loading} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-email">Indirizzo mail</Label>
            <Input 
              id="login-email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.com"
              disabled={loading}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input 
              id="login-password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </Button>
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              Non hai un account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={onSwitchToRegister} disabled={loading}>
                Registrati
              </Button>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
