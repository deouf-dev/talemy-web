"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "@/features/auth/AuthContext";
import { initializeSocket, disconnectSocket } from "./socketClient";
import { useQueryClient } from "@tanstack/react-query";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: number) => void;
  sendMessage: (conversationId: number, content: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialiser la connexion socket
    const newSocket = initializeSocket(token);
    setSocket(newSocket);

    // Événements de connexion
    newSocket.on("connect", () => {
      console.log("✅ Socket connected to backend");
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      setIsConnected(false);
    });

    newSocket.on("socket:error", (error) => {
      console.error("⚠️ Socket error:", error);
    });

    // Événements de messages
    newSocket.on("message:new", (data) => {
      console.log("📨 Message reçu:", {
        senderUserId: data.message.senderUserId,
        currentUserId: user?.id,
        areSame: data.message.senderUserId === user?.id,
      });

      // Invalider les queries des messages pour cette conversation
      queryClient.invalidateQueries({
        queryKey: ["conversations", data.conversationId, "messages"],
      });
      // Invalider aussi la liste des conversations pour mettre à jour le lastMessage
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    // Événements de lessons
    newSocket.on("lesson:created", (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    });

    newSocket.on("lesson:statusUpdated", (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });

      // Ne notifier que si ce n'est pas l'utilisateur qui a fait le changement
      if (data.updatedBy != user?.id) {
        const isTeacher = user?.id == data.lesson.teacherUserId;
      }
    });

    // Événements de contact requests
    newSocket.on("contactRequest:created", (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    });

    newSocket.on("contactRequest:statusUpdated", (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      // Si accepté, invalider aussi les conversations
      if (data.contactRequest.status === "ACCEPTED") {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      } else if (data.contactRequest.status === "REJECTED") {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    });

    newSocket.on("contactRequest:cancelled", (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    // Connecter le socket
    newSocket.connect();

    // Cleanup
    return () => {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, user, queryClient]);

  const joinConversation = (conversationId: number) => {
    if (!socket?.connected) {
      console.warn("Socket not connected");
      return;
    }

    socket.emit("conversation:join", { conversationId });

    socket.once("conversation:joined", (data) => {});
  };

  const sendMessage = (conversationId: number, content: string) => {
    if (!socket?.connected) {
      console.warn("Socket not connected");
      return;
    }

    socket.emit("message:send", { conversationId, content });
  };

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, joinConversation, sendMessage }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
