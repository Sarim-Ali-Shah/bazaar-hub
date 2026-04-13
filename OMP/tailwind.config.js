
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bazaar-primary': '#4F46E5', 
        'bazaar-secondary': '#FCD34D',
        'bazaar-bg': '#F9FAFB', // Gray-50
      },
      // ----------------------------------------------------------------
      // CUSTOM BACKGROUND IMAGE CONFIGURATION
      // ----------------------------------------------------------------
      backgroundImage: {
             'marketplace-pattern': "url('/bg.png')", 
        // Note: The path starts with / because the image is in the public folder.
      }
    },
  },
  plugins: [],
}