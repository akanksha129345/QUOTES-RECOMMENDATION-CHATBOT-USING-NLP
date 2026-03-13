"use client";

import { useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onOpenSidebar: () => void;
}

export function ChatContainer({
  messages,
  isTyping,
  onSendMessage,
  onOpenSidebar,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">QuoteBot</h1>
            <p className="text-xs text-muted-foreground">AI-powered inspiration</p>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </span>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="min-h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="p-4 rounded-2xl bg-primary/10 mb-4">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Welcome to QuoteBot!</h2>
              <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                I&apos;m your AI companion for inspirational quotes. Tell me how you&apos;re feeling,
                and I&apos;ll find the perfect quote to match your mood.
              </p>
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {["I need motivation", "I feel sad", "Tell me about love", "Hi there!"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => onSendMessage(suggestion)}
                      className="px-4 py-2 rounded-full border border-border text-sm hover:bg-secondary transition-colors"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} disabled={isTyping} />
    </div>
  );
}
