
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from 'lucide-react';

interface PaymentConfirmationProps {
  amount: number;
  phoneNumber?: string;
  onDone: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ 
  amount, 
  phoneNumber, 
  onDone 
}) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  
  useEffect(() => {
    // In a real app, this would listen to a webhook or polling for confirmation
    // For demo, we'll simulate it with a timeout
    const timer = setTimeout(() => {
      setIsConfirmed(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto p-6 glass-morphism animate-scale-in">
      <div className="flex flex-col items-center space-y-6">
        {isConfirmed ? (
          <>
            <div className="flex flex-col items-center justify-center mb-2">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4 animate-scale-in" />
              <h2 className="text-2xl font-semibold text-center">Payment Successful</h2>
            </div>
            
            <div className="w-full border-t border-b border-border py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">KSh {amount.toFixed(2)}</span>
              </div>
              {phoneNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Phone Number</span>
                  <span className="font-medium">{phoneNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{formatDate()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium">TRX{Math.floor(Math.random() * 1000000)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full h-12 mt-4 bg-transport hover:bg-transport-dark text-white"
              onClick={onDone}
            >
              Done
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-transport animate-spin mb-4" />
            <h2 className="text-xl font-medium text-center">Confirming Payment</h2>
            <p className="text-muted-foreground text-center mt-2">
              Please wait while we verify the payment...
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PaymentConfirmation;
