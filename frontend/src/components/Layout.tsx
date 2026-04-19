import React from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
