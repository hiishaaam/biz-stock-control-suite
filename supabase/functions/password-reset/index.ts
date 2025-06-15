
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordResetRequest {
  email: string;
  action?: 'request' | 'reset';
  token?: string;
  newPassword?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action = 'request', token, newPassword }: PasswordResetRequest = await req.json();

    console.log(`Password reset ${action} for email: ${email}`);

    if (action === 'request') {
      return await handlePasswordResetRequest(email);
    } else if (action === 'reset') {
      return await handlePasswordReset(token!, newPassword!);
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in password-reset function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

async function handlePasswordResetRequest(email: string): Promise<Response> {
  try {
    // Check rate limiting
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .from('password_reset_rate_limit')
      .select('*')
      .eq('email', email)
      .gte('last_request_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .single();

    if (rateLimitError && rateLimitError.code !== 'PGRST116') {
      throw rateLimitError;
    }

    if (rateLimitData && rateLimitData.request_count >= 3) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many password reset requests. Please try again in an hour.' 
        }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Check if user exists
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError || !userData.user) {
      // Return success even if user doesn't exist (security best practice)
      return new Response(
        JSON.stringify({ 
          message: 'If an account with this email exists, you will receive a password reset link.' 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Generate secure token
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Hash the token for storage
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const tokenHash = Array.from(new Uint8Array(hashBuffer), byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');

    // Store token in database
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: userData.user.id,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString()
      });

    if (tokenError) {
      throw tokenError;
    }

    // Update rate limiting
    if (rateLimitData) {
      await supabase
        .from('password_reset_rate_limit')
        .update({
          request_count: rateLimitData.request_count + 1,
          last_request_at: new Date().toISOString()
        })
        .eq('email', email);
    } else {
      await supabase
        .from('password_reset_rate_limit')
        .insert({
          email: email,
          request_count: 1
        });
    }

    // Send email if Resend is configured
    if (resend) {
      const resetUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'http://localhost:3000'}/reset-password?token=${token}`;
      
      await resend.emails.send({
        from: 'InvenTrack <noreply@biz-stock-control-suit.com>',
        to: [email],
        subject: 'Reset Your Password - InvenTrack',
        html: createPasswordResetEmailTemplate(resetUrl, userData.user.user_metadata?.full_name || 'User'),
      });
    }

    return new Response(
      JSON.stringify({ 
        message: 'If an account with this email exists, you will receive a password reset link.' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in handlePasswordResetRequest:', error);
    throw error;
  }
}

async function handlePasswordReset(token: string, newPassword: string): Promise<Response> {
  try {
    // Hash the provided token
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const tokenHash = Array.from(new Uint8Array(hashBuffer), byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');

    // Find and validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired reset token' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Update user password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      tokenData.user_id,
      { password: newPassword }
    );

    if (updateError) {
      throw updateError;
    }

    // Mark token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    return new Response(
      JSON.stringify({ message: 'Password reset successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in handlePasswordReset:', error);
    throw error;
  }
}

function createPasswordResetEmailTemplate(resetUrl: string, userName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #374151;
        }
        .message {
          font-size: 16px;
          margin-bottom: 30px;
          color: #6b7280;
          line-height: 1.6;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
          color: #ffffff;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s ease;
        }
        .reset-button:hover {
          transform: translateY(-2px);
        }
        .security-info {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 16px;
          margin: 30px 0;
        }
        .security-info h3 {
          color: #92400e;
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }
        .security-info p {
          color: #92400e;
          margin: 0;
          font-size: 14px;
        }
        .footer {
          background-color: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          .content {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 InvenTrack</h1>
        </div>
        <div class="content">
          <div class="greeting">Hello ${userName},</div>
          <div class="message">
            We received a request to reset your password for your InvenTrack account. 
            If you made this request, click the button below to create a new password.
          </div>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">Reset Your Password</a>
          </div>
          <div class="security-info">
            <h3>🛡️ Security Information</h3>
            <p>This link will expire in 30 minutes for your security. If you didn't request this password reset, you can safely ignore this email.</p>
          </div>
          <div class="message" style="margin-top: 30px;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #f97316; word-break: break-all;">${resetUrl}</a>
          </div>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>© 2024 InvenTrack. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
