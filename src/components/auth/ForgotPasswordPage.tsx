
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Loader2, ArrowLeft, Mail, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md animate-scale-in">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
                <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-ping" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Check Your Email
              </h1>
              <p className="text-gray-600 animate-fade-in animation-delay-300">
                Password reset link sent successfully
              </p>
            </div>

            <Card className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl">
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <div className="animate-fade-in animation-delay-500">
                    <Mail className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-700 leading-relaxed">
                      If an account with email <strong className="text-blue-600">{email}</strong> exists, 
                      you will receive a password reset link shortly.
                    </p>
                  </div>
                  
                  <div className="pt-4 animate-slide-in-up animation-delay-700">
                    <Link to="/login">
                      <Button variant="outline" className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/30 hover:bg-white/70 transition-all duration-300 transform hover:scale-105">
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md transform transition-all duration-700 hover:scale-105">
          <div className="text-center mb-8 animate-fade-in">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
              <Package className="w-10 h-10 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-ping" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 animate-slide-in-up animation-delay-300">
              Enter your email to receive a reset link
            </p>
          </div>

          <Card className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl animate-slide-in-up animation-delay-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">Forgot Password?</CardTitle>
              <CardDescription className="text-gray-600">
                No worries! Enter your email and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="email"
                    className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-orange-600' : 'text-gray-700'}`}
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your email"
                      className={`transition-all duration-300 border-2 ${
                        focusedField === 'email' 
                          ? 'border-orange-500 shadow-lg shadow-orange-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                    />
                    {focusedField === 'email' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-orange-500 to-pink-500 opacity-20 animate-pulse -z-10"></div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reset Link
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-sm text-orange-600 hover:text-pink-600 flex items-center justify-center transition-colors duration-300 hover:underline"
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

export default ForgotPasswordPage;
