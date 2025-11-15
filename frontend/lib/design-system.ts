/**
 * Web Scraper AI - Design System
 * Modern SaaS Design inspired by Vercel, Notion, Linear, Stripe, Anthropic
 */

export const designSystem = {
  // 🎨 Colors
  colors: {
    // Primary: Primary Blue
    primary: {
      50: '#e6f1ff',
      100: '#cce3ff',
      200: '#99c7ff',
      300: '#66abff',
      400: '#338fff',
      500: '#1F6FEB', // Main - Primary Blue
      600: '#1a5ec4',
      700: '#154d9d',
      800: '#103c76',
      900: '#0b2b4f',
      gradient: 'linear-gradient(135deg, #1F6FEB 0%, #154d9d 100%)',
      gradientSubtle: 'linear-gradient(135deg, #1F6FEB15 0%, #154d9d15 100%)',
    },
    
    // Secondary: Neutral/Background
    neutral: {
      50: '#FFFFFF',      // Card White
      100: '#F5F7FA',     // Background Light Gray
      200: '#e5e9ef',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#1A1A1A',     // Primary Dark Text
    },
    
    // Status Colors
    status: {
      pending: {
        bg: '#fff9e6',
        text: '#8a6d00',
        border: '#FFD43B',     // Accent Yellow
        darkBg: '#8a6d0020',
        darkText: '#FFD43B',
      },
      processing: {
        bg: '#e6f1ff',
        text: '#1a5ec4',
        border: '#1F6FEB',     // Primary Blue
        darkBg: '#1a5ec420',
        darkText: '#1F6FEB',
      },
      completed: {
        bg: '#e8f5e9',
        text: '#2e7d32',
        border: '#4CAF50',     // Positive Green
        darkBg: '#2e7d3220',
        darkText: '#4CAF50',
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
    success: '#4CAF50',    // Positive Green
    error: '#ef4444',
    warning: '#FFD43B',    // Accent Yellow
    info: '#1F6FEB',       // Primary Blue
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
