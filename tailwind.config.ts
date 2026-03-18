import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // We don't use Tailwind's dark mode — we use our own CSS variable theme system
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          400: 'var(--brand-400, #818cf8)',
          500: 'var(--brand-500, #6366f1)',
          600: 'var(--brand-600, #4f46e5)',
        },
      },
    },
  },
  plugins: [],
}

export default config
