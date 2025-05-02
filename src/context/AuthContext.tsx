
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Traduciamo i messaggi di errore in italiano
        let errorMessage: string;
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenziali di accesso non valide";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email non confermata";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Email non valida";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Utente non trovato";
        } else {
          errorMessage = "Errore durante l'accesso";
        }
        
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Si è verificato un errore imprevisto" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        // Traduciamo i messaggi di errore in italiano
        let errorMessage: string;
        
        if (error.message.includes("User already registered")) {
          errorMessage = "L'utente è già registrato";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "La password deve essere di almeno 6 caratteri";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email non confermata";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Email non valida";
        } else {
          errorMessage = "Errore durante la registrazione";
        }
        
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Si è verificato un errore imprevisto" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // After logout, the onAuthStateChange listener will update the state
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        session,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
