
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
    CRITICAL INSTRUCTION: Transform the subject into a professional ID photo with strict adherence to composition and realism.
    
    1. FACIAL IDENTITY (NON-NEGOTIABLE):
       - The subject's face MUST remain 100% IDENTICAL to the source photo.
       - DO NOT morph, slim, beautify, or "enhance" the facial features.
       - The person must be immediately recognizable as the exact same person from the input.
    
    2. SKIN TEXTURE AND REALISM (STRICT):
       - DO NOT SMOOTH THE SKIN. NO "cà mịn" effect. NO airbrushing or blurring.
       - MAINTAIN NATURAL TEXTURE: Skin pores, fine lines, natural shadows, and skin character must remain visible and sharp.
       - EXCEPTION: Only remove temporary, minor blemishes like active acne or pimples.
    
    3. BACKGROUND AND CLOTHING:
       - Replace the background with a completely SOLID ${config.bgColor} color.
       - Change the attire to a ${clothingDesc[config.clothing]}. It must fit the subject's neck and shoulders naturally.
    
    4. COMPOSITION AND CROP (STRICT RATIO):
       - Target Aspect Ratio: ${selectedSize.width}:${selectedSize.height}.
       - FACE RATIO: The face (measured from the tip of the chin to the top of the head/crown) MUST occupy exactly ${config.faceRatio}% of the TOTAL VERTICAL HEIGHT of the resulting image.
       - POSITIONING: Center the head horizontally. Leave a balanced margin (headroom) between the top of the hair and the top edge of the photo.
       - Ensure the subject is looking directly at the camera with a neutral expression.
    
    5. QUALITY:
       - Output must be ultra-sharp, professional studio quality.
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
