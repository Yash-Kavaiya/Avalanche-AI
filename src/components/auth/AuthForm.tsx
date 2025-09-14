import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Mountain, Mail, Shield, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';

export function AuthForm() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const { sendOTP, verifyOTP, isLoading } = useAuthStore();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await sendOTP(email);
      setStep('otp');
      toast({
        title: 'Verification code sent',
        description: `Check your email at ${email} for the 6-digit code.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to send code',
        description: 'Please check your email and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp || otp.length !== 6) return;

    try {
      await verifyOTP(email, otp);
      toast({
        title: 'Welcome to Avalanche AI!',
        description: 'You have successfully logged in.',
      });
    } catch (error) {
      toast({
        title: 'Invalid code',
        description: 'Please check your code and try again.',
        variant: 'destructive',
      });
      setOtp('');
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 avalanche-gradient">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <Mountain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Avalanche AI</h1>
          <p className="text-white/80">Professional blockchain analytics platform</p>
        </div>

        {/* Auth Card */}
        <Card className="glass-effect border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {step === 'email' ? 'Welcome back' : 'Verify your email'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'email' 
                ? 'Enter your email to receive a verification code'
                : `Enter the 6-digit code sent to ${email}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <div key="email-form">
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? 'Sending...' : 'Send verification code'}
                  </Button>
                </form>
              </div>
            ) : (
              <div key="otp-form">
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Security code
                      </span>
                    </div>
                    
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={handleBackToEmail}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to email
                    </Button>
                  </div>
                </form>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the code? Check your spam folder or{' '}
                    <button 
                      onClick={handleBackToEmail}
                      className="text-primary hover:underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm">
          <p>Secure authentication powered by Devv</p>
        </div>
      </div>
    </div>
  );
}