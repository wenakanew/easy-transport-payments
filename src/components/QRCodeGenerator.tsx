
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Smartphone, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
    // In a real app, this would call an API to create a payment request and get a QR code
    // For demo purposes, we're creating a mock payload
    const paymentData = {
      amount: amount,
      currency: 'KES',
      merchantId: 'EasyTransitPay',
      timestamp: new Date().toISOString(),
      apiKey: '1df1102d8dae2d6d975f1d835d302d7ac752393f'
    };
    
    // Create a QR code that contains the payment information
    setQrValue(JSON.stringify(paymentData));
    
    // Simulate QR code generation
    const timer = setTimeout(() => {
      toast({
        title: "QR Code Ready",
        description: "Please ask passenger to scan",
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [amount, toast]);
  
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
