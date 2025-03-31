/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3498db',
          secondary: '#2c3e50',
          success: '#2ecc71',
          danger: '#e74c3c',
          warning: '#f1c40f',
          gray: {
            50: '#f5f7fa',
            100: '#e7ebef',
            200: '#e0e0e0',
            300: '#bdbdbd',
            400: '#7f8c8d',
            500: '#666',
          },
        },
        boxShadow: {
          'custom': '0 2px 10px rgba(0, 0, 0, 0.05)',
          'custom-lg': '0 4px 15px rgba(0, 0, 0, 0.1)',
          'inner-sm': 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: [],
  }