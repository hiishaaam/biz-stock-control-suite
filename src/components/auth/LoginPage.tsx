
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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

      {/* Main Content with increased padding for better scrolling */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8 py-16">
        <div className="w-full max-w-md transform transition-all duration-700 hover:scale-105">
          {/* Brand Header with Animation - increased margin */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
              <Package className="w-10 h-10 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-ping" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              InvenTrack
            </h1>
            <p className="text-gray-600 animate-slide-in-up animation-delay-300">
              Welcome back to your inventory universe
            </p>
          </div>

          {/* Glassmorphism Card with extra bottom margin */}
          <Card className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl animate-slide-in-up animation-delay-500 mb-16">
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-semibold text-gray-800">Sign In</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Field with Animation - increased spacing */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="email" 
                    className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-700'}`}
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
                      className={`transition-all duration-300 border-2 h-12 ${
                        focusedField === 'email' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                    />
                    {focusedField === 'email' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-pulse -z-10"></div>
                    )}
                  </div>
                </div>

                {/* Password Field with Animation - increased spacing */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="password"
                    className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-600' : 'text-gray-700'}`}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className={`transition-all duration-300 border-2 pr-12 h-12 ${
                        focusedField === 'password' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    {focusedField === 'password' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-pulse -z-10"></div>
                    )}
                  </div>
                </div>

                {/* Forgot Password Link - increased spacing */}
                <div className="flex items-center justify-between py-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-purple-600 transition-colors duration-300 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Animated Submit Button - increased height and spacing */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 h-14 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                {/* Sign Up Link - increased spacing */}
                <div className="text-center text-sm text-gray-600 pt-4">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-blue-600 hover:text-purple-600 font-medium transition-colors duration-300 hover:underline"
                  >
                    Create one now
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

export default LoginPage;
