export type Emotion = 'motivation' | 'sadness' | 'success' | 'life' | 'love' | 'greeting' | 'unknown';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'bot';
  timestamp: Date;
  emotion?: Emotion;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessage?: string;
}

export interface EmotionStats {
  motivation: number;
  sadness: number;
  success: number;
  life: number;
  love: number;
  greeting: number;
}
