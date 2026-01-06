import React, { createContext, RefObject, useCallback, useContext, useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';

interface AutoScrollContextType {
  scrollViewRef: RefObject<ScrollView | null>;
  triggerScroll: (delay?: number) => void;
}

const AutoScrollContext = createContext<AutoScrollContextType | null>(null);

export function AutoScrollProvider({ children }: { readonly children: React.ReactNode }) {
  const scrollViewRef = useRef<ScrollView>(null);

  const triggerScroll = useCallback((delay: number = 100) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, delay);
  }, []);

  const contextValue = useMemo(() => ({
    scrollViewRef,
    triggerScroll
  }), [triggerScroll]);

  return (
    <AutoScrollContext.Provider value={contextValue}>
      {children}
    </AutoScrollContext.Provider>
  );
};

export const useAutoScroll = () => {
  const context = useContext(AutoScrollContext);
  if (!context) {
    throw new Error('useAutoScroll must be used within an AutoScrollProvider');
  }
  return context;
};


