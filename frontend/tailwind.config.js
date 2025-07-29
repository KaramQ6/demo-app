/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: '#121212',
  			foreground: '#EAEAEA',
  			card: {
  				DEFAULT: 'rgba(255, 255, 255, 0.03)',
  				foreground: '#EAEAEA'
  			},
  			popover: {
  				DEFAULT: 'rgba(255, 255, 255, 0.05)',
  				foreground: '#EAEAEA'
  			},
  			primary: {
  				DEFAULT: '#8A2BE2',
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: '#4B0082',
  				foreground: '#EAEAEA'
  			},
  			muted: {
  				DEFAULT: 'rgba(255, 255, 255, 0.05)',
  				foreground: 'rgba(234, 234, 234, 0.7)'
  			},
  			accent: {
  				DEFAULT: '#8A2BE2',
  				foreground: '#FFFFFF'
  			},
  			destructive: {
  				DEFAULT: '#EF4444',
  				foreground: '#FFFFFF'
  			},
  			border: 'rgba(255, 255, 255, 0.1)',
  			input: 'rgba(255, 255, 255, 0.05)',
  			ring: '#8A2BE2',
  			chart: {
  				'1': '#8A2BE2',
  				'2': '#4B0082',
  				'3': '#9932CC',
  				'4': '#6A0DAD',
  				'5': '#7B68EE'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};