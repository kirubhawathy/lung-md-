import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Medical theme colors
        'medical-blue': {
          50: 'var(--medical-blue-50)',
          100: 'var(--medical-blue-100)',
          200: 'var(--medical-blue-200)',
          300: 'var(--medical-blue-300)',
          400: 'var(--medical-blue-400)',
          500: 'var(--medical-blue-500)',
          600: 'var(--medical-blue-600)',
          700: 'var(--medical-blue-700)',
          800: 'var(--medical-blue-800)',
          900: 'var(--medical-blue-900)',
        },
        'medical-teal': {
          50: 'var(--medical-teal-50)',
          100: 'var(--medical-teal-100)',
          200: 'var(--medical-teal-200)',
          300: 'var(--medical-teal-300)',
          400: 'var(--medical-teal-400)',
          500: 'var(--medical-teal-500)',
          600: 'var(--medical-teal-600)',
          700: 'var(--medical-teal-700)',
          800: 'var(--medical-teal-800)',
          900: 'var(--medical-teal-900)',
        },
        'medical-green': {
          50: 'var(--medical-green-50)',
          100: 'var(--medical-green-100)',
          200: 'var(--medical-green-200)',
          300: 'var(--medical-green-300)',
          400: 'var(--medical-green-400)',
          500: 'var(--medical-green-500)',
          600: 'var(--medical-green-600)',
          700: 'var(--medical-green-700)',
          800: 'var(--medical-green-800)',
          900: 'var(--medical-green-900)',
        },
        'ward-red': 'var(--ward-red)',
        'ward-blue': 'var(--ward-blue)',
        'ward-green': 'var(--ward-green)',
        'ward-orange': 'var(--ward-orange)',
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
