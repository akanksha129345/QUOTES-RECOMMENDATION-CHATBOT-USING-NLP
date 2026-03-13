"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatContainer } from "@/components/chat/chat-container";
import { Message, ChatSession, EmotionStats } from "@/lib/types";
import {
  generateId,
  createChatSession,
  processMessage,
  calculateEmotionStats,
  generateChatTitle,
} from "@/lib/chat-store";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    // Create initial session if none exists
    const initialSession = createChatSession();
    setSessions([initialSession]);
    setCurrentSessionId(initialSession.id);
  }, []);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Calculate emotion stats from all messages across all sessions
  const emotionStats: EmotionStats = sessions.reduce(
    (acc, session) => {
      const sessionStats = calculateEmotionStats(session.messages);
      return {
        motivation: acc.motivation + sessionStats.motivation,
        sadness: acc.sadness + sessionStats.sadness,
        success: acc.success + sessionStats.success,
        life: acc.life + sessionStats.life,
        love: acc.love + sessionStats.love,
        greeting: acc.greeting + sessionStats.greeting,
      };
    },
    { motivation: 0, sadness: 0, success: 0, life: 0, love: 0, greeting: 0 }
  );

  const handleNewChat = useCallback(() => {
    const newSession = createChatSession();
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  }, []);

  const handleSelectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!currentSessionId) return;

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        content,
        role: "user",
        timestamp: new Date(),
      };

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== currentSessionId) return session;
          
          const updatedMessages = [...session.messages, userMessage];
          const title = session.messages.length === 0 
            ? generateChatTitle(content) 
            : session.title;
          
          return {
            ...session,
            messages: updatedMessages,
            title,
            lastMessage: content,
          };
        })
      );

      // Simulate bot typing
      setIsTyping(true);

      // Simulate API delay (in production, this would call the Rasa backend)
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Process message and generate response
      const { botMessage, emotion } = processMessage(content);

      const botResponse: Message = {
        id: generateId(),
        content: botMessage,
        role: "bot",
        timestamp: new Date(),
        emotion,
      };

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== currentSessionId) return session;
          return {
            ...session,
            messages: [...session.messages, botResponse],
            lastMessage: botMessage.substring(0, 50) + "...",
          };
        })
      );

      setIsTyping(false);
    },
    [currentSessionId]
  );

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden">
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        emotionStats={emotionStats}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatContainer
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />
    </main>
  );
}
