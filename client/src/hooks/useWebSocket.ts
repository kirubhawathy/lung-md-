import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoReconnect?: boolean;
  reconnectDelay?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    autoReconnect = true,
    reconnectDelay = 3000,
  } = options;

  const { user, isAuthenticated } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const connect = () => {
    if (!isAuthenticated || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionAttempts(0);
        
        // Send join message with user and ward info
        if (user) {
          ws.send(JSON.stringify({
            type: 'join',
            userId: user.id,
            wardId: user.currentWardId || null,
          }));
        }
        
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        onDisconnect?.();

        // Attempt to reconnect if enabled and not manually closed
        if (autoReconnect && event.code !== 1000 && isAuthenticated) {
          setConnectionAttempts(prev => prev + 1);
          const delay = Math.min(reconnectDelay * Math.pow(2, connectionAttempts), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect WebSocket (attempt ${connectionAttempts + 1})`);
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
      return false;
    }
  };

  // Connect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    connectionAttempts,
  };
}

// Specific hooks for different types of WebSocket functionality
export function useTransferNotifications() {
  const [transfers, setTransfers] = useState<any[]>([]);

  const { sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'transfer_request' || message.type === 'transfer_update') {
        setTransfers(prev => {
          const existingIndex = prev.findIndex(t => t.id === message.data.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = message.data;
            return updated;
          } else {
            return [message.data, ...prev];
          }
        });
      }
    },
  });

  return {
    transfers,
    sendTransferUpdate: (transferData: any) => {
      sendMessage({
        type: 'transfer_update',
        data: transferData,
      });
    },
  };
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const { sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'notification') {
        setNotifications(prev => [message.data, ...prev]);
      }
    },
  });

  return {
    notifications,
    sendNotification: (notificationData: any) => {
      sendMessage({
        type: 'notification',
        data: notificationData,
      });
    },
  };
}

export function useRealtimeMessages() {
  const [messages, setMessages] = useState<any[]>([]);

  const { sendMessage, isConnected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'message') {
        setMessages(prev => [message.data, ...prev]);
      }
    },
  });

  const sendChatMessage = (messageData: any) => {
    return sendMessage({
      type: 'message',
      data: messageData,
    });
  };

  return {
    messages,
    sendChatMessage,
    isConnected,
  };
}
