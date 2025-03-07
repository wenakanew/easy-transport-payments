
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Smartphone, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { processMpesaPayment } from '@/lib/mpesaApi';

interface ManualPaymentProps {
  amount: number;
  onBack: () => void;
  onSuccess: (phoneNumber: string) => void;
}

const ManualPayment: React.FC<ManualPaymentProps> = ({ 
  amount, 
  onBack,
  onSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 12 characters
    if (/^\d*$/.test(value) && value.length <= 12) {
      setPhoneNumber(value);
      setError('');
    }
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation for Kenyan phone numbers
    const kenyanPhoneRegex = /^(07|01|2547|2541)\d{8}$/;
    return kenyanPhoneRegex.test(phone);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call the M-Pesa API
      await processMpesaPayment(phoneNumber, amount);
      
      toast({
        title: "Payment Request Sent",
        description: `A prompt has been sent to ${phoneNumber}`,
      });
      
      onSuccess(phoneNumber);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Could not process payment request",
        variant: "destructive",
      });
      
      setError('Failed to send payment request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto p-6 glass-morphism animate-scale-in">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center mb-2">
          <Smartphone className="h-8 w-8 text-transport mr-2" />
          <h2 className="text-2xl font-semibold">Manual Payment</h2>
        </div>
        
        <div className="text-center mb-2">
          <p className="text-lg font-medium">Amount: <span className="text-transport font-semibold">KSh {amount.toFixed(2)}</span></p>
          <p className="text-sm text-muted-foreground">Enter passenger's phone number to send M-Pesa prompt</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="07XXXXXXXX"
                className="pl-10 h-12"
                autoComplete="tel"
              />
            </div>
            {error && <p className="text-destructive text-sm animate-fade-in">{error}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 mt-4 bg-transport hover:bg-transport-dark text-white flex items-center justify-center"
            disabled={isLoading || phoneNumber.length < 9}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Payment Request"
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-12 flex items-center justify-center space-x-2"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ManualPayment;
