
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VerificationTokenDialog } from "@/components/VerificationTokenDialog";

const formSchema = z.object({
  username: z.string().min(3, { message: "Il nome utente deve avere almeno 3 caratteri" }),
  email: z.string().email({ message: "Email non valida" }),
  password: z.string().min(6, { message: "La password deve avere almeno 6 caratteri" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

type RegisterFormProps = {
  onSuccess?: () => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function sendConfirmationEmail(email: string, username: string) {
    try {
      const { data, error } = await supabase.functions.invoke("send-confirmation-email", {
        body: { email, username },
      });

      if (error) {
        console.error("Error sending confirmation email:", error);
        // Don't show this error to the user - registration was successful
      }
    } catch (error) {
      console.error("Exception sending confirmation email:", error);
      // Don't show this error to the user - registration was successful
    }
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setErrorMessage(null);

    const { success, error } = await register(data.email, data.password, data.username);

    if (!success) {
      setErrorMessage(error || "Errore durante la registrazione.");
      setIsLoading(false);
      return;
    }

    // Send confirmation email
    await sendConfirmationEmail(data.email, data.username);
    
    // Store the email for verification
    setRegisteredEmail(data.email);
    
    // Show verification dialog
    setShowVerification(true);
    setIsLoading(false);
  }

  const handleVerificationSuccess = () => {
    // Close the verification dialog
    setShowVerification(false);
    
    // Show success message
    toast({
      title: "Registrazione completata",
      description: "Il tuo account è stato verificato e registrato con successo.",
    });

    // Call the original success callback
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleVerificationClose = () => {
    setShowVerification(false);
    
    // Show partial success message
    toast({
      title: "Registrazione completata",
      description: "Ti abbiamo inviato un'email di verifica. Completa la verifica per accedere al tuo account.",
    });
    
    // Call the original success callback
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Utente</FormLabel>
                <FormControl>
                  <Input placeholder="Inserisci il tuo nome utente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="la-tua-email@esempio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conferma Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMessage && (
            <div className="text-sm text-destructive">{errorMessage}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrazione in corso...
              </>
            ) : (
              "Registrati"
            )}
          </Button>
        </form>
      </Form>

      <VerificationTokenDialog
        open={showVerification}
        onClose={handleVerificationClose}
        email={registeredEmail}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
}
