
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Eye, EyeOff, Loader2, Sparkles, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }

    // For now, we'll assume the token is valid until we try to use it
    setIsValidToken(true);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('password-reset', {
        body: {
          action: 'reset',
          token: token,
          newPassword: password
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Password reset successful!",
        description: "Your password has been updated. You can now sign in with your new password.",
      });

      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred while resetting your password. Please try again.",
        variant: "destructive",
      });
      
      // If token is invalid, mark it as such
      if (error.message?.includes('Invalid or expired')) {
        setIsValidToken(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (isValidToken === false) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-red-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-8 py-16">
          <div className="w-full max-w-md animate-scale-in">
            <div className="text-center mb-12">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Invalid Reset Link
              </h1>
              <p className="text-gray-600 animate-fade-in animation-delay-300">
                This password reset link is invalid or has expired
              </p>
            </div>

            <Card className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl mb-16">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-8">
                  <div className="animate-fade-in animation-delay-500">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      The password reset link you clicked is either invalid or has expired. 
                      This can happen if the link is older than 30 minutes or has already been used.
                    </p>
                  </div>
                  
                  <div className="space-y-4 animate-slide-in-up animation-delay-700">
                    <Link to="/forgot-password">
                      <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold h-12">
                        Request New Reset Link
                      </Button>
                    </Link>
                    
                    <Link to="/login">
                      <Button variant="outline" className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/30 hover:bg-white/70 h-12">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8 py-16">
        <div className="w-full max-w-md transform transition-all duration-700 hover:scale-105">
          {/* Brand Header with Animation */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
              <Package className="w-10 h-10 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-ping" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Set New Password
            </h1>
            <p className="text-gray-600 animate-slide-in-up animation-delay-300">
              Enter your new password below
            </p>
          </div>

          {/* Glassmorphism Card */}
          <Card className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl animate-slide-in-up animation-delay-500 mb-16">
            <CardHeader className="pt-8">
              <CardTitle className="text-2xl font-semibold text-gray-800">Create New Password</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Choose a strong password to secure your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Password Field */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="password"
                    className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-green-600' : 'text-gray-700'}`}
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Create a strong password"
                      className={`transition-all duration-300 border-2 pr-12 h-12 ${
                        focusedField === 'password' 
                          ? 'border-green-500 shadow-lg shadow-green-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-white/30"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {focusedField === 'password' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-500 to-blue-500 opacity-20 animate-pulse -z-10"></div>
                    )}
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex space-x-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Too weak'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="confirmPassword"
                    className={`transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-green-600' : 'text-gray-700'}`}
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Confirm your new password"
                      className={`transition-all duration-300 border-2 h-12 ${
                        focusedField === 'confirmPassword' 
                          ? 'border-green-500 shadow-lg shadow-green-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                      minLength={6}
                    />
                    {focusedField === 'confirmPassword' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-500 to-blue-500 opacity-20 animate-pulse -z-10"></div>
                    )}
                  </div>
                  
                  {/* Password Match Indicator */}
                  {password && confirmPassword && (
                    <div className="flex items-center space-x-2 animate-fade-in">
                      {password === confirmPassword ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <p className="text-sm text-green-600">Passwords match</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <p className="text-sm text-red-500">Passwords do not match</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 h-14 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25"
                  disabled={isLoading || password !== confirmPassword || password.length < 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>

                {/* Back Link */}
                <div className="text-center pt-4">
                  <Link 
                    to="/login" 
                    className="text-sm text-green-600 hover:text-blue-600 flex items-center justify-center transition-colors duration-300 hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
