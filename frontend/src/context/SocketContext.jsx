// Single shared Socket.IO client — gives the app live notifications & chat.
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const SocketCtx = createContext(null);
export const useSocket = () => useContext(SocketCtx);

export function SocketProvider({ children }) {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const [online, setOnline] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token || !user) return;
    const s = io('/', { auth: { token } });
    socketRef.current = s;

    s.on('notification:new', (n) => {
      setNotifications((prev) => [n, ...prev]);
      toast.success(n.message);
    });
    s.on('presence:update', (ids) => setOnline(ids));

    return () => { s.disconnect(); socketRef.current = null; };
  }, [token, user]);

  return (
    <SocketCtx.Provider value={{ socket: socketRef.current, online, notifications, setNotifications }}>
      {children}
    </SocketCtx.Provider>
  );
}
