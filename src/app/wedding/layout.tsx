import React from 'react';
import { WeddingAuthProvider } from './templates/[slag]/contexts/WeddingAuthContext';
import { WeddingProvider } from './templates/[slag]/contexts/WeddingProvider';
import { Toaster } from '@/components/ui/toaster';

const WeddingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <WeddingAuthProvider>
      <WeddingProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
          {children}
        </div>
        <Toaster />
      </WeddingProvider>
    </WeddingAuthProvider>
  );
};

export default WeddingLayout;
