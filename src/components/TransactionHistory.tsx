
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  phoneNumber?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return null;
  }
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-amber-500';
      case 'failed':
        return 'text-red-500';
      default:
        return '';
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto glass-morphism animate-slide-up">
      <div className="p-4 border-b border-border flex items-center">
        <Clock className="h-5 w-5 text-transport mr-2" />
        <h3 className="text-lg font-medium">Recent Transactions</h3>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-3 border border-border rounded-md hover:bg-transport-muted transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">KSh {transaction.amount.toFixed(2)}</p>
                  {transaction.phoneNumber && (
                    <p className="text-sm text-muted-foreground">{transaction.phoneNumber}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatTime(transaction.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TransactionHistory;
