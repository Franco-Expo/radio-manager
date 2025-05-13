
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  username: string;
  resend?: boolean;
}

// In a real implementation, you would store tokens in a database
// This is a simplified in-memory storage for demonstration purposes
const tokenStore: Record<string, { token: string; expires: number }> = {};

// Generate a random 6-character alphanumeric token
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, username, resend = false }: EmailRequest = await req.json();

    if (!email || !username) {
      return new Response(
        JSON.stringify({ error: "Email and username are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate a verification token
    const verificationToken = generateToken();
    console.log(`Generated verification token for ${email}: ${verificationToken}`);

    // Store the token with a 15-minute expiration
    tokenStore[email] = {
      token: verificationToken,
      expires: Date.now() + 15 * 60 * 1000
    };

    // For debugging, use a fixed demo token that's always valid
    const demoToken = "DEMO" + verificationToken.substring(4);
    console.log(`Demo token for ${email}: ${demoToken}`);

    // If RESEND_API_KEY is not set, return mock response for development
    if (!Deno.env.get("RESEND_API_KEY")) {
      console.log("RESEND_API_KEY is not set, returning mock response");
      return new Response(
        JSON.stringify({ 
          id: "mock-email-id",
          from: "Francesco <francesco@studionet4.com>",
          to: [email],
          subject: resend ? "Il tuo nuovo codice di verifica" : "Conferma la tua registrazione",
          message: `Demo token: ${demoToken}`
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Francesco <francesco@studionet4.com>",
      to: [email],
      subject: resend ? "Il tuo nuovo codice di verifica" : "Conferma la tua registrazione",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333333; font-size: 24px; margin-bottom: 10px;">Benvenuto ${username}!</h1>
            <div style="width: 100px; height: 4px; background-color: #4f46e5; margin: 0 auto;"></div>
          </div>
          
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Grazie per esserti registrato alla nostra piattaforma. Siamo felici di averti con noi!
            </p>
            
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Per completare la registrazione, inserisci il seguente codice di verifica:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                ${verificationToken}
              </div>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hai problemi a inserire il codice? Per i test, puoi anche usare questo codice demo: ${demoToken}
            </p>
            
            <p style="font-size: 16px; line-height: 1.5;">
              Se hai domande o hai bisogno di assistenza, non esitare a contattarci.
            </p>
          </div>
          
          <div style="text-align: center; color: #666666; font-size: 14px;">
            <p>&copy; 2025 StudioNet4. Tutti i diritti riservati.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
