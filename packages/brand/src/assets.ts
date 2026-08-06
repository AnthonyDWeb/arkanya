import arkanyaSymbolPng from '../assets/arkanya/symbol.png';
import arkanyaSymbolWebp from '../assets/arkanya/symbol.webp';
import arkCareIconPng from '../assets/products/arkcare-icon.png';
import arkCareLogoWebp from '../assets/products/arkcare-logo.webp';
import arkNestIconPng from '../assets/products/arknest-icon.png';
import arkNestLogoWebp from '../assets/products/arknest-logo.webp';

export const arkanyaBrandAssets = {
  symbol: {
    png: arkanyaSymbolPng,
    webp: arkanyaSymbolWebp,
  },
  products: {
    arkcare: { iconPng: arkCareIconPng, logoWebp: arkCareLogoWebp },
    arknest: { iconPng: arkNestIconPng, logoWebp: arkNestLogoWebp },
  },
} as const;
