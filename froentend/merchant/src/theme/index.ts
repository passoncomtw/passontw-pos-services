// 色彩方案來自產品規格書
export const colors = {
  primary: '#2C5282', // 深藍色，沉穩且不刺眼
  secondary: '#4299E1', // 明亮藍色，用於互動元素
  accent: '#E53E3E', // 活力紅色，用於關鍵按鈕與提示
  success: '#38A169', // 明亮綠色，視覺反饋更鮮明
  warning: '#DD6B20', // 深橙色，用於重要提醒
  background: '#EDF2F7', // 淺灰藍色，降低長時間使用的視覺疲勞
  textPrimary: '#1A202C' // 近黑色，確保在光線變化下仍清晰可見
};

export const fonts = {
  body: '"Noto Sans TC", sans-serif',
  heading: '"Noto Sans TC", sans-serif',
};

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
};

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
};

const theme = {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
};

export default theme; 