export const theme = {
  colors: {
    primary: {
      cyan: '#06b6d4',
      cyanLight: '#22d3ee',
      cyanDark: '#0891b2',
    },
    secondary: {
      magenta: '#ec4899',
      purple: '#a855f7',
      violet: '#8b5cf6',
    },
    accent: {
      orange: '#f97316',
      green: '#22c55e',
      red: '#ef4444',
    },
    background: {
      dark: '#050b14',
      darker: '#020617',
      panel: '#0a0e1a',
    },
    glass: {
      light: 'rgba(15, 20, 35, 0.7)',
      medium: 'rgba(10, 14, 26, 0.8)',
      dark: 'rgba(5, 11, 20, 0.9)',
    },
  },
  effects: {
    glowCyan: '0 0 15px rgba(6, 182, 212, 0.6), 0 0 30px rgba(6, 182, 212, 0.3)',
    glowMagenta: '0 0 15px rgba(236, 72, 153, 0.6), 0 0 30px rgba(236, 72, 153, 0.3)',
    glowPurple: '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(168, 85, 247, 0.3)',
    textShadowCyan: '0 0 8px rgba(6, 182, 212, 0.9), 0 0 15px rgba(6, 182, 212, 0.5)',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
};

export type Theme = typeof theme;
