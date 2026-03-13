import { NextRequest, NextResponse } from "next/server";
import { detectEmotion, getRandomQuote } from "@/lib/quotes";
import { Emotion } from "@/lib/types";

// Rasa API URL - set this in your environment variables
const RASA_API_URL = process.env.RASA_API_URL || "http://localhost:5005";

// Rasa response types
interface RasaIntent {
  name: string;
  confidence: number;
}

interface RasaEntity {
  entity: string;
  value: string;
  confidence: number;
  start: number;
  end: number;
}

interface RasaWebhookResponse {
  recipient_id: string;
  text: string;
  buttons?: { title: string; payload: string }[];
}

interface RasaParseResponse {
  intent: RasaIntent;
  entities: RasaEntity[];
  text: string;
  intent_ranking: RasaIntent[];
}

// Map Rasa intents to emotions
function mapIntentToEmotion(intent: string): Emotion {
  const intentMap: Record<string, Emotion> = {
    // Greeting intents
    greet: "greeting",
    hello: "greeting",
    hi: "greeting",
    // Motivation intents
    ask_motivation: "motivation",
    need_motivation: "motivation",
    inspire_me: "motivation",
    motivation: "motivation",
    // Sadness intents
    feeling_sad: "sadness",
    sad: "sadness",
    depressed: "sadness",
    unhappy: "sadness",
    sadness: "sadness",
    // Success intents
    ask_success: "success",
    success: "success",
    achievement: "success",
    celebrate: "success",
    // Life intents
    ask_life: "life",
    life_advice: "life",
    meaning_of_life: "life",
    life: "life",
    // Love intents
    ask_love: "love",
    feeling_love: "love",
    romantic: "love",
    love: "love",
  };

  return intentMap[intent.toLowerCase()] || "unknown";
}

// Call Rasa webhook for full conversational response
async function callRasaWebhook(
  message: string,
  senderId: string = "user"
): Promise<RasaWebhookResponse[]> {
  const response = await fetch(`${RASA_API_URL}/webhooks/rest/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: senderId,
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Rasa webhook request failed: ${response.statusText}`);
  }

  return response.json();
}

// Call Rasa NLU parse endpoint for intent/entity extraction
async function callRasaParse(message: string): Promise<RasaParseResponse> {
  const response = await fetch(`${RASA_API_URL}/model/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Rasa parse request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const { message, senderId = "user" } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if Rasa is available
    const useRasa = process.env.RASA_API_URL || process.env.USE_RASA === "true";

    if (useRasa) {
      try {
        // Call Rasa NLU to parse intent and entities
        const parseResult = await callRasaParse(message);
        const emotion = mapIntentToEmotion(parseResult.intent.name);
        const confidence = parseResult.intent.confidence;

        // Call Rasa webhook for the conversational response
        const webhookResponse = await callRasaWebhook(message, senderId);

        // Combine Rasa responses
        const responseText =
          webhookResponse.length > 0
            ? webhookResponse.map((r) => r.text).join("\n\n")
            : getRandomQuote(emotion);

        return NextResponse.json({
          response: responseText,
          emotion,
          confidence,
          intent: parseResult.intent.name,
          entities: parseResult.entities,
          buttons: webhookResponse[0]?.buttons,
        });
      } catch (rasaError) {
        console.error("Rasa API error, falling back to local:", rasaError);
        // Fall back to local processing if Rasa is unavailable
      }
    }

    // Fallback: Local emotion detection when Rasa is not available
    const emotion = detectEmotion(message);
    const quote = getRandomQuote(emotion);

    let response = "";

    if (emotion === "greeting") {
      response = quote;
    } else if (emotion === "unknown") {
      response = quote;
    } else {
      const emotionResponses: Record<string, string> = {
        motivation:
          "I sense you're looking for motivation! Here's something to fuel your drive:",
        sadness:
          "I understand you might be going through a tough time. Here's something that might help:",
        success:
          "Congratulations on thinking about success! Here's an inspiring thought:",
        life: "Ah, contemplating life's big questions! Here's some wisdom:",
        love: "Love is beautiful! Here's something heartfelt for you:",
      };

      response = `${emotionResponses[emotion]}\n\n"${quote}"`;
    }

    return NextResponse.json({
      response,
      emotion,
      confidence: 0.85 + Math.random() * 0.15,
      fallback: true,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
