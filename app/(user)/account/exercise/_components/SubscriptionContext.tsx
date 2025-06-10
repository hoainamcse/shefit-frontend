'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface SubscriptionContextType {
  selectedSubscription: any;
  setSelectedSubscription: (subscription: any) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  return (
    <SubscriptionContext.Provider value={{ selectedSubscription, setSelectedSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
