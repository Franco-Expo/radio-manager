
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await register(username, email, password);
      toast({
        title: "Registrazione completata",
        description: "Account creato con successo",
      });
    } catch (error) {
      toast({
        title: "Errore di registrazione",
        description: "Impossibile creare l'account",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full md:max-w-md card-shadow">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Registrazione</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-user">User</Label>
            <Input 
              id="register-user" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Il tuo nome utente"
              disabled={loading}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Indirizzo mail</Label>
            <Input 
              id="register-email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.com"
              disabled={loading}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input 
              id="register-password" 
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
            {loading ? "Registrazione in corso..." : "Registrati"}
          </Button>
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              Hai già un account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={onSwitchToLogin} disabled={loading}>
                Accedi
              </Button>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
