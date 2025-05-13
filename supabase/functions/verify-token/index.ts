
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  token: string;
}

// In a real implementation, you would store tokens in a database
// This is a simplified in-memory storage for demonstration purposes
const tokenStore: Record<string, { token: string; expires: number }> = {};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token }: VerificationRequest = await req.json();

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: "Email and token are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Verifying token for ${email}: ${token}`);
    
    // For demonstration, any token starting with "DEMO" will be valid
    // In a real implementation, you would check against tokens stored in a database
    const valid = token.startsWith("DEMO") || (tokenStore[email]?.token === token && tokenStore[email]?.expires > Date.now());

    console.log(`Token validation result: ${valid}`);

    return new Response(
      JSON.stringify({ valid }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-token function:", error);
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
