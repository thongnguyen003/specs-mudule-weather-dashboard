/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B131E', // Màu nền tối
        surface: '#202B3B',    // Màu card
        primary: '#3B82F6',    // Màu nút Search
        text: {
          main: '#FFFFFF',
          secondary: '#9399A2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Thêm animation nếu bạn dùng bản code đầy đủ trước đó
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}