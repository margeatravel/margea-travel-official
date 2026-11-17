import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Inter', 'sans-serif'], // alias for backward compat
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          foreground: "hsl(var(--navy-foreground))",
        },
        navbar: {
          DEFAULT: "hsl(var(--navbar))",
          foreground: "hsl(var(--navbar-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        promo: {
          navy: "hsl(var(--promo-navy))",
          gold: "hsl(var(--promo-gold))",
          coral: "hsl(var(--promo-coral))",
        },
        champagne: {
          DEFAULT: "hsl(var(--champagne))",
          foreground: "hsl(var(--champagne-foreground))",
        },
        "success-soft": {
          DEFAULT: "hsl(var(--success-soft))",
          border: "hsl(var(--success-soft-border))",
          foreground: "hsl(var(--success-soft-foreground))",
        },
        gold: "#b8975a",
      },
      borderRadius: {
        lg: "12px",  /* Cards */
        md: "12px",  /* Dropdowns & inputs */
        sm: "12px",  /* Inputs */
        xs: "50px",  /* Buttons */
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "luxury-fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "carousel-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fadeInUp": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "shimmer": "shimmer 2s infinite",
        "luxury-fade-in": "luxury-fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "carousel-scroll": "carousel-scroll 20s linear infinite",
        "fadeInUp": "fadeInUp 0.6s ease-out forwards",
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-overlay': 'var(--gradient-overlay)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'card': 'var(--shadow-card)',
        'tropical': 'var(--shadow-tropical)',
        'luxury': 'var(--shadow-luxury)',
        'glow-subtle': 'var(--shadow-glow-subtle)',
        'btn-hover': '0 8px 24px rgba(29, 40, 57, 0.25)',
        'card-hover': '0 16px 48px rgba(29, 40, 57, 0.12)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
