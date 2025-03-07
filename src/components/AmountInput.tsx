
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CreditCard } from 'lucide-react';

interface AmountInputProps {
  onAmountSubmit: (amount: number) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ onAmountSubmit }) => {
  const [amount, setAmount] = useState<string>('');
  const [isValidAmount, setIsValidAmount] = useState<boolean>(true);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
      setIsValidAmount(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setIsValidAmount(false);
      return;
    }
    
    onAmountSubmit(numAmount);
  };
  
  const presetAmounts = [50, 100, 200, 500];
  
  return (
    <Card className="w-full max-w-md mx-auto p-6 glass-morphism animate-scale-in">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center mb-2">
          <CreditCard className="h-8 w-8 text-transport mr-2" />
          <h2 className="text-2xl font-semibold">Enter Fare Amount</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="text-muted-foreground font-medium">KSh</span>
            </div>
            <Input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleChange}
              placeholder="0.00"
              className={`pl-14 text-3xl h-16 font-display ${!isValidAmount ? 'border-destructive' : ''}`}
            />
          </div>
          
          {!isValidAmount && (
            <p className="text-destructive text-sm animate-fade-in">
              Please enter a valid amount
            </p>
          )}
          
          <div className="grid grid-cols-4 gap-2 mt-4">
            {presetAmounts.map((presetAmount) => (
              <Button
                key={presetAmount}
                type="button"
                variant="outline"
                onClick={() => setAmount(presetAmount.toString())}
                className="h-12 text-lg font-medium hover:bg-transport hover:text-white"
              >
                {presetAmount}
              </Button>
            ))}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-14 mt-6 text-lg font-medium bg-transport hover:bg-transport-dark text-white"
            disabled={!amount}
          >
            Continue
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default AmountInput;
