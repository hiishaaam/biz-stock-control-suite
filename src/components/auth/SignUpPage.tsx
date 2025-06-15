
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Eye, EyeOff, Loader2, Sparkles, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, fullName);
      navigate('/login');
    } catch (error) {
      // Error handling is done in the auth context
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Morphing Gradient Shapes */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"></div>
        <div className="absolute top-60 right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-4000"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
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
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
              <Package className="w-10 h-10 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-ping" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              InvenTrack
            </h1>
            <p className="text-gray-600 animate-slide-in-up animation-delay-300">
              Join the future of inventory management
            </p>
          </div>

          {/* Progress Indicator - increased spacing */}
          <div className="mb-8 animate-slide-in-up animation-delay-400">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">Step 1 of 1</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500 w-full"></div>
            </div>
          </div>

          {/* Glassmorphism Card with extra bottom margin */}
          <Card className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl animate-slide-in-up animation-delay-500 mb-16">
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-semibold text-gray-800">Create Account</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Start your inventory management journey
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Full Name Field - increased spacing */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="fullName"
                    className={`transition-colors duration-300 ${focusedField === 'fullName' ? 'text-purple-600' : 'text-gray-700'}`}
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your full name"
                      className={`transition-all duration-300 border-2 h-12 ${
                        focusedField === 'fullName' 
                          ? 'border-purple-500 shadow-lg shadow-purple-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                    />
                    {focusedField === 'fullName' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse -z-10"></div>
                    )}
                  </div>
                </div>

                {/* Email Field - increased spacing */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="email"
                    className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-purple-600' : 'text-gray-700'}`}
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
                          ? 'border-purple-500 shadow-lg shadow-purple-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                    />
                    {focusedField === 'email' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse -z-10"></div>
                    )}
                  </div>
                </div>

                {/* Password Field with Strength Indicator - increased spacing */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="password"
                    className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-purple-600' : 'text-gray-700'}`}
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
                      placeholder="Create a strong password"
                      className={`transition-all duration-300 border-2 pr-12 h-12 ${
                        focusedField === 'password' 
                          ? 'border-purple-500 shadow-lg shadow-purple-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {focusedField === 'password' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse -z-10"></div>
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

                {/* Confirm Password Field - increased spacing */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="confirmPassword"
                    className={`transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-purple-600' : 'text-gray-700'}`}
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Confirm your password"
                      className={`transition-all duration-300 border-2 h-12 ${
                        focusedField === 'confirmPassword' 
                          ? 'border-purple-500 shadow-lg shadow-purple-500/25 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      } bg-white/50 backdrop-blur-sm`}
                      required
                      minLength={6}
                    />
                    {focusedField === 'confirmPassword' && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse -z-10"></div>
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

                {/* Animated Submit Button - increased height and spacing */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 h-14 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 group"
                  disabled={isLoading || password !== confirmPassword}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                {/* Sign In Link - increased spacing */}
                <div className="text-center text-sm text-gray-600 pt-4">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-purple-600 hover:text-pink-600 font-medium transition-colors duration-300 hover:underline"
                  >
                    Sign in instead
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

export default SignUpPage;
