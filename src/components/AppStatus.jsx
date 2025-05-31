import React, { useState, useEffect } from 'react';
import { isOffline } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, X } from 'lucide-react';

const AppStatus = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [offlineMode, setOfflineMode] = useState(isOffline());

  useEffect(() => {
    const handleOnline = () => {
      setOfflineMode(false);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };

    const handleOffline = () => {
      setOfflineMode(true);
      setIsVisible(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show initial offline status if offline
    if (offlineMode) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {offlineMode ? (
              <>
                <WifiOff className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Back Online</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {offlineMode && (
          <p className="text-xs text-gray-500 mt-1">
            You can continue browsing with limited functionality
          </p>
        )}
      </div>
    </div>
  );
};

export default AppStatus;