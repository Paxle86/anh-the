
import { GoogleGenAI } from "@google/genai";
import { GenerationConfig } from "../types";
import { PHOTO_SIZES } from "../constants";

export const generateIdPhoto = async (
  base64Image: string,
  config: GenerationConfig
): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const selectedSize = PHOTO_SIZES.find(s => s.id === config.targetSizeId) || PHOTO_SIZES[0];

  const clothingDesc = {
    'male-shirt': 'white professional dress shirt with a neat collar',
    'male-suit': 'formal black suit with a white shirt and a professional tie',
    'female-shirt': 'white professional blouse with a neat collar',
    'female-suit': 'professional black blazer with a white blouse underneath',
    'none': 'current clothing'
  };

  const prompt = `
    TASK: Transform this person into a professional ID passport photo while strictly preserving their natural identity.
    
    CONSTRAINTS:
    1. FACIAL IDENTITY: You MUST keep the person's face, features, and identity 100% IDENTICAL to the source. Do not morph or change facial structure.
    2. SKIN TEXTURE: DO NOT perform skin smoothing (no airbrushing/blurring). Keep natural skin pores, fine lines, and texture completely intact. 
       - ONLY remove temporary blemishes like acne or pimples. 
       - DO NOT "cà mịn" (smooth) the skin. It must look like a real, high-resolution portrait.
    3. BACKGROUND: Replace the background with a completely SOLID ${config.bgColor} color. No shadows, no gradients.
    4. CLOTHING: Change the attire to a ${clothingDesc[config.clothing]}. Ensure it fits naturally on the body.
    5. HAIR: Make the hairstyle look neat and tidy, ensuring no stray hairs are messy, but maintain the original style.
    6. COMPOSITION: 
       - Output aspect ratio MUST be ${selectedSize.width}:${selectedSize.height}.
       - Zoom/Crop so that the face (from chin to top of hair) occupies approximately ${config.faceRatio}% of the total vertical height of the image.
       - Ensure the head is centered and looking straight ahead.
    7. OUTPUT: High-resolution, sharp, professional ID studio quality.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: selectedSize.width === selectedSize.height ? "1:1" : (selectedSize.width < selectedSize.height ? "3:4" : "4:3")
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating ID photo:", error);
    throw error;
  }
};
