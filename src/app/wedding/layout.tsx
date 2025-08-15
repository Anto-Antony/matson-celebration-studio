import React from 'react';
import { Toaster } from '@/components/ui/toaster';

const WeddingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default WeddingLayout;
