'use client';
import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';

// Custom hook to listen for real-time lead events
export function useLeadUpdates(onUpdate: (data: any) => void) {
  useEffect(() => {
    const socket = getSocket();

    // Listen for these events from server
    socket.on('lead:created',  onUpdate);
    socket.on('lead:updated',  onUpdate);
    socket.on('lead:assigned', onUpdate);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('lead:created',  onUpdate);
      socket.off('lead:updated',  onUpdate);
      socket.off('lead:assigned', onUpdate);
    };
  }, [onUpdate]);
}