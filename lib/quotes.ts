import { Emotion } from './types';

export const quotes: Record<Emotion, string[]> = {
  motivation: [
    "Push yourself because no one else is going to do it for you.",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Your limitation—it's only your imagination.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Wake up with determination. Go to bed with satisfaction.",
    "The only impossible journey is the one you never begin."
  ],
  sadness: [
    "Tough times never last, but tough people do. - Robert H. Schuller",
    "Every storm runs out of rain. - Maya Angelou",
    "The sun will rise and we will try again.",
    "It's okay to not be okay. Just don't stay there.",
    "Stars can't shine without darkness.",
    "This too shall pass.",
    "You're allowed to feel, but don't let it consume you.",
    "After every darkness comes a sunrise.",
    "Healing takes time, and asking for help is a courageous step.",
    "Your current situation is not your final destination."
  ],
  success: [
    "Success is not the key to happiness. Happiness is the key to success.",
    "The secret of success is to do the common thing uncommonly well.",
    "Success usually comes to those who are too busy to be looking for it.",
    "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The road to success is always under construction.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Celebrate your successes. Find some humor in your failures.",
    "Success isn't just about what you accomplish, it's about what you inspire others to do.",
    "The only place where success comes before work is in the dictionary."
  ],
  life: [
    "Life is what happens when you're busy making other plans. - John Lennon",
    "In the end, it's not the years in your life that count. It's the life in your years.",
    "Life is either a daring adventure or nothing at all. - Helen Keller",
    "The purpose of life is not to be happy. It is to be useful, honorable, compassionate.",
    "Life is really simple, but we insist on making it complicated. - Confucius",
    "Life is short, and it's up to you to make it sweet.",
    "The biggest adventure you can take is to live the life of your dreams.",
    "Life isn't about finding yourself. It's about creating yourself.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Live as if you were to die tomorrow. Learn as if you were to live forever."
  ],
  love: [
    "The best thing to hold onto in life is each other. - Audrey Hepburn",
    "Love is not about how many days, months, or years you've been together.",
    "Where there is love there is life. - Mahatma Gandhi",
    "To love and be loved is to feel the sun from both sides.",
    "Love yourself first and everything else falls into line.",
    "The greatest thing you'll ever learn is to love and be loved in return.",
    "Love is composed of a single soul inhabiting two bodies. - Aristotle",
    "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
    "Love is friendship that has caught fire.",
    "The heart that loves is always young."
  ],
  greeting: [
    "Hello! I'm here to brighten your day with inspiring quotes!",
    "Welcome! Ready to find some wisdom together?",
    "Hi there! Every conversation is a chance to discover something new.",
    "Greetings! Let's explore some meaningful quotes today.",
    "Hello, friend! What's on your mind today?",
    "Welcome back! I'm excited to share more inspiration with you.",
    "Hey! A warm hello to start our conversation.",
    "Hi! Remember, every day is a new opportunity.",
    "Good to see you! Let's find some words of wisdom.",
    "Hello! Ready to be inspired?"
  ],
  unknown: [
    "I'm here to help you find the perfect quote. Try telling me how you feel!",
    "Share your thoughts or feelings with me, and I'll find an inspiring quote for you.",
    "I'm your quote companion! Tell me about your mood or what's on your mind.",
    "Looking for inspiration? Just tell me what you're going through.",
    "I'm listening! Share your feelings and I'll find a quote that resonates."
  ]
};

export function getRandomQuote(emotion: Emotion): string {
  const emotionQuotes = quotes[emotion];
  const randomIndex = Math.floor(Math.random() * emotionQuotes.length);
  return emotionQuotes[randomIndex];
}

// Simple keyword-based emotion detection (mock NLP for frontend demo)
// In production, this would call the Rasa NLP backend
export function detectEmotion(text: string): Emotion {
  const lowerText = text.toLowerCase();
  
  const emotionKeywords: Record<Emotion, string[]> = {
    motivation: ['motivate', 'motivation', 'inspire', 'push', 'achieve', 'goal', 'determined', 'drive', 'ambitious', 'energy', 'fired up', 'pumped'],
    sadness: ['sad', 'unhappy', 'depressed', 'down', 'blue', 'lonely', 'hurt', 'pain', 'crying', 'tears', 'heartbroken', 'miserable', 'gloomy'],
    success: ['success', 'successful', 'achieve', 'accomplished', 'proud', 'winning', 'victory', 'triumph', 'achievement', 'milestone', 'goal reached'],
    life: ['life', 'living', 'existence', 'meaning', 'purpose', 'journey', 'path', 'direction', 'future', 'destiny', 'philosophy'],
    love: ['love', 'loving', 'relationship', 'romance', 'heart', 'caring', 'affection', 'partner', 'soulmate', 'crush', 'beloved'],
    greeting: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'what\'s up', 'yo', 'sup'],
    unknown: []
  };
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (emotion === 'unknown') continue;
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return emotion as Emotion;
    }
  }
  
  return 'unknown';
}
