
// FIX: The type GenerateContentRequest is deprecated and not exported from @google/genai.
import { GoogleGenAI } from '@google/genai';
import type { GeolocationState, MapSource } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LOCATION_KEYWORDS = [
  'near', 'nearby', 'around', 'in', 'at', 'restaurant', 'cafe', 
  'apartment', 'villa', 'community', 'school', 'hospital', 'park'
];

function shouldUseMaps(prompt: string): boolean {
  const lowerCasePrompt = prompt.toLowerCase();
  return LOCATION_KEYWORDS.some(keyword => lowerCasePrompt.includes(keyword));
}

export async function getChatResponse(prompt: string, location: GeolocationState | null): Promise<{ text: string; sources: MapSource[] }> {
  const useMaps = shouldUseMaps(prompt) && location;

  // FIX: GenerateContentRequest is not an exported member from @google/genai.
  // The request object is constructed without an explicit type, and config is built conditionally.
  const request = {
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      maxOutputTokens: 500,
      thinkingConfig: { thinkingBudget: 100 },
      // FIX: Update system instruction to allow for markdown, which is rendered by the frontend.
      systemInstruction: 'You are a friendly and professional real estate advisor for Dubai. Provide concise, clear answers. Use markdown for formatting when appropriate, such as for lists or emphasis.',
      ...(useMaps &&
        location && {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            },
          },
        }),
    },
  };


  try {
    const response = await ai.models.generateContent(request);

    const text = response.text;
    let sources: MapSource[] = [];

    if (useMaps) {
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        sources = groundingChunks
          .filter(chunk => chunk.maps)
          .map(chunk => ({
            uri: chunk.maps.uri,
            title: chunk.maps.title
          }));
      }
    }
    
    return { text, sources };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get response from AI model.");
  }
}
