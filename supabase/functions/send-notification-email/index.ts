
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

console.log('Email function initialized. Resend configured:', !!resend);
console.log('Resend API Key present:', !!resendApiKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  type: 'welcome' | 'signin';
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, userName }: EmailRequest = await req.json();

    console.log(`Attempting to send ${type} email to: ${email}`);
    console.log(`User name: ${userName || 'Not provided'}`);

    if (!resend) {
      console.log('ERROR: Resend not configured - API key missing');
      return new Response(
        JSON.stringify({ error: 'Email service not configured - missing API key' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (!resendApiKey) {
      console.log('ERROR: RESEND_API_KEY environment variable not set');
      return new Response(
        JSON.stringify({ error: 'Email service not configured - API key not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    let subject: string;
    let htmlContent: string;

    if (type === 'welcome') {
      subject = 'Welcome to InvenTrack! 🎉';
      htmlContent = createWelcomeEmailTemplate(userName || 'User');
    } else if (type === 'signin') {
      subject = 'Sign-in Notification - InvenTrack';
      htmlContent = createSignInEmailTemplate(userName || 'User');
    } else {
      console.log('ERROR: Invalid email type:', type);
      return new Response(
        JSON.stringify({ error: 'Invalid email type' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('Attempting to send email via Resend...');
    console.log('Subject:', subject);
    console.log('To:', email);

    const emailResult = await resend.emails.send({
      from: 'InvenTrack <noreply@biz-stock-control-suit.com>',
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log('Resend response:', JSON.stringify(emailResult, null, 2));

    if (emailResult.error) {
      console.log('ERROR from Resend:', emailResult.error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: emailResult.error 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('Email sent successfully! Email ID:', emailResult.data?.id);

    return new Response(
      JSON.stringify({ 
        message: `${type} email sent successfully`,
        emailId: emailResult.data?.id 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Unexpected error in send-notification-email function:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

function createWelcomeEmailTemplate(userName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to InvenTrack</title>
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
        .features {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }
        .features h3 {
          color: #374151;
          margin: 0 0 15px 0;
          font-size: 18px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .feature-list li {
          padding: 8px 0;
          color: #6b7280;
          position: relative;
          padding-left: 25px;
        }
        .feature-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }
        .cta-button {
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
        .cta-button:hover {
          transform: translateY(-2px);
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to InvenTrack!</h1>
        </div>
        <div class="content">
          <div class="greeting">Hello ${userName},</div>
          <div class="message">
            Congratulations! Your InvenTrack account has been successfully created. 
            You're now ready to take control of your inventory management with our powerful, intuitive platform.
          </div>
          
          <div class="features">
            <h3>🚀 What you can do with InvenTrack:</h3>
            <ul class="feature-list">
              <li>Track products and inventory levels in real-time</li>
              <li>Manage suppliers and purchase orders</li>
              <li>Generate comprehensive reports and analytics</li>
              <li>Set up low stock alerts and notifications</li>
              <li>Organize products with categories and locations</li>
              <li>Scan barcodes and QR codes for quick updates</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'http://localhost:3000'}/dashboard" class="cta-button">
              Get Started Now
            </a>
          </div>

          <div class="message">
            If you have any questions or need help getting started, don't hesitate to reach out to our support team. 
            We're here to help you succeed!
          </div>
        </div>
        <div class="footer">
          <p>Thank you for choosing InvenTrack for your inventory management needs.</p>
          <p>© 2024 InvenTrack. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createSignInEmailTemplate(userName: string): string {
  const now = new Date();
  const timeString = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign-in Notification - InvenTrack</title>
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
        .signin-info {
          background-color: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 6px;
          padding: 16px;
          margin: 30px 0;
        }
        .signin-info h3 {
          color: #0c4a6e;
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }
        .signin-info p {
          color: #0c4a6e;
          margin: 0;
          font-size: 14px;
        }
        .security-notice {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 16px;
          margin: 30px 0;
        }
        .security-notice h3 {
          color: #92400e;
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }
        .security-notice p {
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Sign-in Notification</h1>
        </div>
        <div class="content">
          <div class="greeting">Hello ${userName},</div>
          <div class="message">
            We're writing to inform you that your InvenTrack account was successfully accessed.
          </div>
          
          <div class="signin-info">
            <h3>📅 Sign-in Details</h3>
            <p><strong>Time:</strong> ${timeString}</p>
            <p><strong>Account:</strong> Your InvenTrack inventory management account</p>
          </div>

          <div class="message">
            This is a routine security notification to keep you informed about access to your account. 
            No action is required on your part if this sign-in was authorized by you.
          </div>

          <div class="security-notice">
            <h3>🛡️ Security Notice</h3>
            <p>If you did not sign in to your account, please contact our support team immediately and consider changing your password.</p>
          </div>

          <div class="message">
            We take the security of your account seriously. If you have any concerns or questions about this sign-in, 
            please don't hesitate to reach out to our support team.
          </div>
        </div>
        <div class="footer">
          <p>This is an automated security notification from InvenTrack.</p>
          <p>© 2024 InvenTrack. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
