import { GoogleGenAI } from "@google/genai";
import { Product, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (
  inventory: Product[],
  transactions: Transaction[],
  query: string
): Promise<string> => {
  try {
    const inventorySummary = inventory.map(p => `${p.name} (Stock: ${p.stock})`).join(', ');
    const transactionSummary = transactions.slice(0, 5).map(t => `${t.type} ${t.amount}NGN for ${t.description}`).join(', ');

    const prompt = `
      You are an expert business consultant for TradeSync Nigeria, an app helping Nigerian SMEs.
      
      Context Data:
      Current Inventory Samples: ${inventorySummary}
      Recent Transactions: ${transactionSummary}
      
      User Question: ${query}
      
      Provide a concise, actionable, and culturally relevant answer for a Nigerian business owner. 
      Focus on logistics efficiency, cash flow (escrow), or trust building.
      Keep it under 150 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I couldn't generate an insight right now. Please check your internet connection.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while fetching insights. Please try again later.";
  }
};