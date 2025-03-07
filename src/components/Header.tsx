
import React from 'react';
import { Bus } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between glass-morphism fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Bus className="h-8 w-8 text-transport" />
        <h1 className="text-2xl font-semibold text-foreground">EasyTransit Pay</h1>
      </div>
      <div className="text-sm text-muted-foreground">
        Transport Made Simple
      </div>
    </header>
  );
};

export default Header;
