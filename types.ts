
export type BackgroundColor = 'white' | 'blue' | 'gray';

export type ClothingType = 'male-shirt' | 'male-suit' | 'female-shirt' | 'female-suit' | 'none';

export interface PhotoSize {
  id: string;
  label: string;
  width: number; // ratio
  height: number; // ratio
  mmWidth: number;
  mmHeight: number;
}

export interface GenerationConfig {
  bgColor: BackgroundColor;
  clothing: ClothingType;
  targetSizeId: string;
  faceRatio: number; // percentage of face height relative to image height
}
