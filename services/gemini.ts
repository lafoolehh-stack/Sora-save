import { GoogleGenAI, Type } from "@google/genai";
import { AICaptionResponse } from "../types";

// Initialize Gemini API Client
// Note: API Key must be provided via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateViralContent = async (videoTitle: string, platform: string): Promise<AICaptionResponse> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      I have a video titled "${videoTitle}" which is intended for ${platform}.
      
      Please generate:
      1. 3 catchy, viral-style captions (mix of short and medium length).
      2. 10 trending, relevant hashtags.
      3. A simulated "Viral Potential Score" from 1-100 based on the topic appeal.
      
      Return the response in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a social media expert specializing in viral content for TikTok, Instagram Reels, and YouTube Shorts. You create engaging, punchy text.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of viral captions"
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of hashtags including the # symbol"
            },
            viralScore: {
              type: Type.NUMBER,
              description: "A score from 1 to 100 indicating viral potential"
            }
          },
          required: ["captions", "hashtags", "viralScore"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No text returned from Gemini");
    }

    return JSON.parse(text) as AICaptionResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data in case of error to keep UI functional
    return {
      captions: ["Check out this amazing video! ✨", "You won't believe this... 😱", "Must watch! 🔥"],
      hashtags: ["#viral", "#trending", "#fyp", "#video", "#download"],
      viralScore: 85
    };
  }
};
