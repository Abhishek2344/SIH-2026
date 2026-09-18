import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [liveQueueData, setLiveQueueData] = useState(null);
  const [latestAlert, setLatestAlert] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const queueWsRef = useRef(null);
  const farmerWsRef = useRef(null);
  const activeCentreIdRef = useRef(null);

  // Subscribe to a specific centre's queue
  const subscribeToCentreQueue = useCallback((centreId) => {
    if (!centreId) return;
    if (activeCentreIdRef.current === centreId && queueWsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (queueWsRef.current) {
      queueWsRef.current.close();
    }

    activeCentreIdRef.current = centreId;
    const wsUrl = `ws://localhost:8000/ws/queue/${centreId}`;
    const ws = new WebSocket(wsUrl);
    queueWsRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to Centre #${centreId} WebSocket queue feed`);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'QUEUE_UPDATED' || payload.type === 'TOKEN_CALLED') {
          if (payload.data) {
            setLiveQueueData(payload.data);
          }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket queue message", err);
      }
    };

    ws.onclose = () => {
      console.log(`Disconnected from Centre #${centreId} WebSocket`);
    };
  }, []);

  // Listen to personal farmer alerts
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      if (farmerWsRef.current) farmerWsRef.current.close();
      return;
    }

    const wsUrl = `ws://localhost:8000/ws/farmer/${user.id}`;
    const ws = new WebSocket(wsUrl);
    farmerWsRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to user alert WebSocket: ${user.id}`);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'NEW_NOTIFICATION') {
          setLatestAlert(payload.notification);
          setUnreadCount((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Failed to parse user alert message", err);
      }
    };

    // Heartbeat ping interval
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
      }
    }, 25000);

    return () => {
      clearInterval(pingInterval);
      ws.close();
    };
  }, [isAuthenticated, user?.id]);

  return (
    <WebSocketContext.Provider
      value={{
        liveQueueData,
        setLiveQueueData,
        latestAlert,
        unreadCount,
        setUnreadCount,
        subscribeToCentreQueue,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
