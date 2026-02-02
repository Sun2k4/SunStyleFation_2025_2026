import { GoogleGenAI, Chat } from "@google/genai";
import { productService } from "./productService";

export const createStylistChat = async (): Promise<Chat> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Fetch real products from Supabase via productService
  const products = await productService.getAllProducts();

  const productContext = products
    .map(
      (p) =>
        `- ${p.name} (ID: ${p.id}): Category ${p.categoryName || 'General'}, Price $${p.price}. ${p.description || ''}`
    )
    .join("\n");

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are Sunny, the intelligent virtual stylist for 'SunStyle Fashion Store'. 
      Here is our current PRODUCT INVENTORY:
      ${productContext}
      
      Your goal is to help customers choose outfits, mix and match items, and advice on fashion trends based on weather, occasion, and their preferences.
      CRITICAL INSTRUCTION FOR LINKS:
      When you recommend a specific product that exists in our inventory, you MUST provide a link to it using standard Markdown syntax with the format: [Product Name](/products/ID).
      
      Example: "I think the [Summer Breeze Linen Shirt](/products/1) would be perfect for that."
      
      GUIDELINES:
       - Tone: Friendly, enthusiastic, professional, and concise. 
       - Format: Use bullet points for lists of items. Use emojis occasionally to keep it light.
       - Always prioritize items from our inventory when making recommendations.
      If the user asks about products, assume they are asking about general fashion advice unless they mention specific items from the store context (which you might not have full access to, so keep advice general but applicable).
      `,
    },
  });
};
