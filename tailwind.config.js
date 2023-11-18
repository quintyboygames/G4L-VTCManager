module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '25vh': '25vh',
      },
      minHeight: {
        '25vh' : '25vh',
      },
      maxWidth: {
        '800px': '800px',
      },
      backgroundColor: {
        'dark-1': '#0d0d0d',
        'dark-2': '#121212',
        'dark-3': '#1c1c1c',
        'dark-4': '#2b2b2b',
        'dark-5': '#363636',
        'dark-6': '#3d3d3d',
        'sidebar': '#1c1c1c',
      },
    },
    screens: {
      'xs': '0px',
      'sm': '600px',
      'md': '900px',
      'lg': '1200px',
      'xl': '1536px'
    }
  },
  plugins: [],
}
