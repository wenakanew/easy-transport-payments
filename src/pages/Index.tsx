
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AmountInput from '@/components/AmountInput';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import ManualPayment from '@/components/ManualPayment';
import PaymentConfirmation from '@/components/PaymentConfirmation';
import TransactionHistory from '@/components/TransactionHistory';
import { useToast } from "@/hooks/use-toast";

// Define transaction type
interface Transaction {
  id: string;
  amount: number;
  phoneNumber?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

// Define the different app states
type AppState = 'AMOUNT_INPUT' | 'QR_CODE' | 'MANUAL_PAYMENT' | 'CONFIRMATION';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('AMOUNT_INPUT');
  const [amount, setAmount] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        // Parse dates back to Date objects
        const parsedTransactions = JSON.parse(savedTransactions, (key, value) => {
          if (key === 'timestamp') {
            return new Date(value);
          }
          return value;
        });
        setTransactions(parsedTransactions);
      } catch (error) {
        console.error('Error parsing transactions:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const handleAmountSubmit = (submittedAmount: number) => {
    setAmount(submittedAmount);
    setAppState('QR_CODE');
  };

  const handleManualPayment = () => {
    setAppState('MANUAL_PAYMENT');
  };

  const handlePaymentSuccess = (phone?: string) => {
    if (phone) {
      setPhoneNumber(phone);
    }
    setAppState('CONFIRMATION');
  };

  const handlePaymentComplete = () => {
    // Add transaction to history
    const newTransaction: Transaction = {
      id: `TRX${Date.now()}`,
      amount: amount,
      phoneNumber: phoneNumber || undefined,
      timestamp: new Date(),
      status: 'completed',
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Reset the state
    setAppState('AMOUNT_INPUT');
    setAmount(0);
    setPhoneNumber('');
    
    toast({
      title: "Transaction Complete",
      description: "Payment has been processed successfully",
    });
  };

  const handleBack = () => {
    // Go back to the previous state
    if (appState === 'QR_CODE' || appState === 'MANUAL_PAYMENT') {
      setAppState('AMOUNT_INPUT');
    } else if (appState === 'CONFIRMATION') {
      setAppState('QR_CODE');
    }
  };

  // Render the appropriate component based on the current state
  const renderCurrentState = () => {
    switch (appState) {
      case 'AMOUNT_INPUT':
        return <AmountInput onAmountSubmit={handleAmountSubmit} />;
      case 'QR_CODE':
        return (
          <QRCodeGenerator 
            amount={amount} 
            onBack={handleBack} 
            onManualPayment={handleManualPayment} 
          />
        );
      case 'MANUAL_PAYMENT':
        return (
          <ManualPayment 
            amount={amount} 
            onBack={handleBack} 
            onSuccess={handlePaymentSuccess} 
          />
        );
      case 'CONFIRMATION':
        return (
          <PaymentConfirmation 
            amount={amount} 
            phoneNumber={phoneNumber} 
            onDone={handlePaymentComplete} 
          />
        );
      default:
        return <AmountInput onAmountSubmit={handleAmountSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Header />
      
      <main className="container px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto space-y-8">
          <div className="animate-fade-in text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Fast & Simple Transit Payments
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              A modern payment solution for public transport
            </p>
          </div>
          
          {renderCurrentState()}
          
          {appState === 'AMOUNT_INPUT' && transactions.length > 0 && (
            <TransactionHistory transactions={transactions} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
