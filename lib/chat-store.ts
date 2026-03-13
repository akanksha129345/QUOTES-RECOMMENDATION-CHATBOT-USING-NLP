import { Message, ChatSession, EmotionStats, Emotion } from './types';
import { detectEmotion, getRandomQuote } from './quotes';

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Create a new chat session
export function createChatSession(): ChatSession {
  return {
    id: generateId(),
    title: 'New Chat',
    messages: [],
    createdAt: new Date(),
  };
}

// Process user message and generate bot response
export function processMessage(userMessage: string): { botMessage: string; emotion: Emotion } {
  const emotion = detectEmotion(userMessage);
  const quote = getRandomQuote(emotion);
  
  let botMessage = '';
  
  if (emotion === 'greeting') {
    botMessage = quote;
  } else if (emotion === 'unknown') {
    botMessage = quote;
  } else {
    const emotionResponses: Record<Emotion, string> = {
      motivation: "I sense you're looking for motivation! Here's something to fuel your drive:",
      sadness: "I understand you might be going through a tough time. Here's something that might help:",
      success: "Congratulations on thinking about success! Here's an inspiring thought:",
      life: "Ah, contemplating life's big questions! Here's some wisdom:",
      love: "Love is beautiful! Here's something heartfelt for you:",
      greeting: "",
      unknown: "",
    };
    
    botMessage = `${emotionResponses[emotion]}\n\n"${quote}"`;
  }
  
  return { botMessage, emotion };
}

// Calculate emotion statistics from messages
export function calculateEmotionStats(messages: Message[]): EmotionStats {
  const stats: EmotionStats = {
    motivation: 0,
    sadness: 0,
    success: 0,
    life: 0,
    love: 0,
    greeting: 0,
  };
  
  const botMessages = messages.filter(m => m.role === 'bot' && m.emotion);
  
  botMessages.forEach(message => {
    if (message.emotion && message.emotion in stats) {
      stats[message.emotion as keyof EmotionStats]++;
    }
  });
  
  return stats;
}

// Generate chat title from first message
export function generateChatTitle(firstMessage: string): string {
  const words = firstMessage.split(' ').slice(0, 4).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words || 'New Chat';
}
