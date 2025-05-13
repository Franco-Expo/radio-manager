
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VerificationTokenDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

export function VerificationTokenDialog({ 
  open, 
  onClose, 
  email,
  onSuccess
}: VerificationTokenDialogProps) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setToken("");
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleVerify = async () => {
    if (token.length !== 6) {
      setError("Inserisci un token valido a 6 caratteri");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Here we would verify the token against the database
      // For this example, we're simulating a successful verification after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verification successful
      toast({
        title: "Verifica completata",
        description: "Il tuo account è stato verificato con successo.",
      });
      
      // Call the success handler
      onSuccess();
    } catch (error: any) {
      setError("Token non valido o scaduto. Riprova.");
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    
    try {
      // Call the edge function to resend the verification email
      const { error } = await supabase.functions.invoke("send-confirmation-email", {
        body: { email, resend: true }
      });

      if (error) throw error;
      
      toast({
        title: "Email inviata",
        description: "Abbiamo inviato un nuovo token di verifica alla tua email.",
      });
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast({
        title: "Errore",
        description: "Impossibile inviare l'email. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Verifica il tuo account</DialogTitle>
          <DialogDescription className="text-center">
            Abbiamo inviato un codice di verifica a <strong>{email}</strong>.<br />
            Inserisci il codice a 6 caratteri per completare la registrazione.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <InputOTP maxLength={6} value={token} onChange={setToken}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}

          <div className="flex flex-col w-full space-y-2">
            <Button 
              onClick={handleVerify} 
              disabled={token.length !== 6 || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifica in corso...
                </>
              ) : (
                "Verifica"
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isLoading}
              className="w-full"
            >
              Invia nuovamente il codice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
