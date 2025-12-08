import { GoogleGenAI } from "@google/genai";

export const getGeminiOutfitSuggestion = async (
  occasion: string,
  weather: string,
  gender: string,
  stylePreference: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a professional fashion stylist for the 'SunStyle Fashion Store'.
    I need an outfit suggestion for a ${gender} who likes ${stylePreference} style.
    The occasion is: ${occasion}.
    The weather is: ${weather}.
    
    Please provide a response in the following structured text format (do not use markdown bolding/italics, just plain text with headers):
    
    OUTFIT NAME: [Catchy Name]
    DESCRIPTION: [A 2-3 sentence description of the vibe]
    KEY PIECES: [List 3-4 specific clothing items, e.g., 'White Linen Shirt', 'Beige Chinos']
    STYLING TIP: [One actionable styling tip]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sorry, I couldn't generate a suggestion right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to the fashion assistant. Please try again later.";
  }
};
