/**
 * Web Scraper AI - Design System
 * Modern SaaS Design inspired by Vercel, Notion, Linear, Stripe, Anthropic
 */

export const designSystem = {
  // 🎨 Colors
  colors: {
    // Primary: Deep Indigo / Electric Blue Gradient
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Main
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradientSubtle: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    },
    
    // Secondary: Slate/Neutral
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Status Colors
    status: {
      pending: {
        bg: '#fef3c7',
        text: '#92400e',
        border: '#fde047',
        darkBg: '#78350f20',
        darkText: '#fcd34d',
      },
      processing: {
        bg: '#dbeafe',
        text: '#1e40af',
        border: '#60a5fa',
        darkBg: '#1e40af20',
        darkText: '#60a5fa',
      },
      completed: {
        bg: '#d1fae5',
        text: '#065f46',
        border: '#34d399',
        darkBg: '#065f4620',
        darkText: '#34d399',
      },
      failed: {
        bg: '#fee2e2',
        text: '#991b1b',
        border: '#f87171',
        darkBg: '#991b1b20',
        darkText: '#f87171',
      },
    },
    
    // Semantic
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  
  // 📝 Typography
  typography: {
    fonts: {
      sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: 'var(--font-geist-mono), "SF Mono", Monaco, monospace',
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // 📐 Spacing
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
    '4xl': '6rem',  // 96px
  },
  
  // 🎭 Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
    glowGreen: '0 0 20px rgba(16, 185, 129, 0.3)',
  },
  
  // 📦 Border Radius
  radius: {
    sm: '0.375rem',  // 6px
    base: '0.5rem',  // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  // ✨ Animations
  animations: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // 🖼️ Effects
  effects: {
    blur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      lg: 'blur(16px)',
    },
    backdrop: 'backdrop-blur(12px) saturate(180%)',
    gradient: {
      mesh: 'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(99, 102, 241, 0.1) 0px, transparent 50%)',
    },
  },
};

export type DesignSystem = typeof designSystem;
