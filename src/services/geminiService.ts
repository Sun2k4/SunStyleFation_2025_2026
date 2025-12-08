import { GoogleGenAI, Chat } from "@google/genai";

export const createStylistChat = (): Chat => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are Sunny, the intelligent virtual stylist for 'SunStyle Fashion Store'. 
      Your goal is to help customers choose outfits, mix and match items, and advice on fashion trends based on weather, occasion, and their preferences.
      
      Tone: Friendly, enthusiastic, professional, and concise. 
      Format: Use bullet points for lists of items. Use emojis occasionally to keep it light.
      
      If the user asks about products, assume they are asking about general fashion advice unless they mention specific items from the store context (which you might not have full access to, so keep advice general but applicable).
      `,
    },
  });
};