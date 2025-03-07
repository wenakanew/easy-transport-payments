
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Smartphone, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { processMpesaPayment } from '@/lib/mpesaApi';

interface QRCodeGeneratorProps {
  amount: number;
  onBack: () => void;
  onManualPayment: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  amount, 
  onBack,
  onManualPayment
}) => {
  const [qrValue, setQrValue] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Create a direct payment URL that will trigger the M-Pesa STK push
    // When scanned, this will open a web page that processes the payment
    const paymentData = {
      action: "pay",
      amount: amount,
      timestamp: Date.now(),
      reference: `TRANSIT-${Date.now()}`
    };
    
    // The QR code will contain a URL that opens a small webapp that triggers the STK push
    // In a production app, this would be a hosted URL that processes payments
    const paymentUrl = `https://easyTransitPay.app/pay?data=${encodeURIComponent(JSON.stringify(paymentData))}`;
    
    // Set the QR code value to the payment URL
    setQrValue(paymentUrl);
    
    // Notify the conductor that the QR is ready
    const timer = setTimeout(() => {
      toast({
        title: "QR Code Ready",
        description: "Please ask passenger to scan",
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [amount, toast]);
  
  const handleTestPayment = async () => {
    // This is just for testing - in a real app the passenger would scan the QR
    try {
      toast({
        title: "Testing Payment",
        description: "Simulating QR code scan...",
      });
      
      // Use a test phone number
      await processMpesaPayment("0712345678", amount);
      
      toast({
        title: "STK Push Sent",
        description: "Payment prompt has been sent to the test phone",
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Could not process test payment",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto p-6 glass-morphism animate-scale-in">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-center mb-2">
          <QrCode className="h-8 w-8 text-transport mr-2" />
          <h2 className="text-2xl font-semibold">Scan to Pay</h2>
        </div>
        
        <div className="text-center mb-2">
          <p className="text-lg font-medium">Amount: <span className="text-transport font-semibold">KSh {amount.toFixed(2)}</span></p>
          <p className="text-sm text-muted-foreground">Ask passenger to scan this QR code</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-lg border border-border w-64 h-64 flex items-center justify-center">
          {qrValue ? (
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`} 
              alt="Payment QR Code"
              width={200}
              height={200}
              className="animate-fade-in"
            />
          ) : (
            <div className="animate-pulse flex space-x-4">
              <div className="h-40 w-40 bg-muted-foreground/20 rounded"></div>
            </div>
          )}
        </div>
        
        <div className="w-full space-y-3 mt-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2 h-12 border-transport text-transport hover:bg-transport hover:text-white"
            onClick={handleTestPayment}
          >
            <Smartphone className="h-5 w-5" />
            <span>Test Payment</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2 h-12 border-transport text-transport hover:bg-transport hover:text-white"
            onClick={onManualPayment}
          >
            <Smartphone className="h-5 w-5" />
            <span>Manual Payment</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2 h-12"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
