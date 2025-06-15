
-- Create password reset tokens table
CREATE TABLE public.password_reset_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_password_reset_tokens_token_hash ON public.password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access (edge functions will use service role)
CREATE POLICY "Service role can manage password reset tokens" 
  ON public.password_reset_tokens 
  FOR ALL 
  USING (true);

-- Create rate limiting table for password reset requests
CREATE TABLE public.password_reset_rate_limit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  first_request_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_request_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for rate limiting lookups
CREATE INDEX idx_password_reset_rate_limit_email ON public.password_reset_rate_limit(email);

-- Enable RLS for rate limiting table
ALTER TABLE public.password_reset_rate_limit ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage rate limiting" 
  ON public.password_reset_rate_limit 
  FOR ALL 
  USING (true);

-- Function to clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_password_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < now() OR used = true;
  
  -- Clean up old rate limiting records (older than 24 hours)
  DELETE FROM public.password_reset_rate_limit 
  WHERE last_request_at < now() - INTERVAL '24 hours';
END;
$$;
