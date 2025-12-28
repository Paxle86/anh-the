
import { PhotoSize } from './types';

export const PHOTO_SIZES: PhotoSize[] = [
  { id: '3x4', label: '3x4 cm', width: 3, height: 4, mmWidth: 30, mmHeight: 40 },
  { id: '4x6', label: '4x6 cm', width: 4, height: 6, mmWidth: 40, mmHeight: 60 },
  { id: '35x45', label: '3.5x4.5 cm', width: 3.5, height: 4.5, mmWidth: 35, mmHeight: 45 },
  { id: 'passport', label: 'Hộ chiếu (4x6)', width: 4, height: 6, mmWidth: 40, mmHeight: 60 }
];

export const BACKGROUND_COLORS = [
  { id: 'white', label: 'Trắng', hex: '#FFFFFF', class: 'bg-white border-slate-200' },
  { id: 'blue', label: 'Xanh dương', hex: '#0055A4', class: 'bg-[#0055A4]' },
  { id: 'gray', label: 'Xám', hex: '#808080', class: 'bg-gray-500' }
];

export const CLOTHING_OPTIONS = [
  { id: 'none', label: 'Giữ nguyên', icon: '👤' },
  { id: 'male-shirt', label: 'Nam - Sơ mi trắng', icon: '👔' },
  { id: 'male-suit', label: 'Nam - Com-lê', icon: '🤵' },
  { id: 'female-shirt', label: 'Nữ - Sơ mi trắng', icon: '👚' },
  { id: 'female-suit', label: 'Nữ - Vest công sở', icon: '🧥' }
];
