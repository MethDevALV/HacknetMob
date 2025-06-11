
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Cyberpunk color scheme
				matrix: {
					green: '#00FF41',
					cyan: '#00FFFF', 
					yellow: '#FFFF00',
					red: '#FF0000',
					orange: '#FFA500',
					gray: '#808080',
					black: '#000000'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'mono': ['Space Mono', 'Monaco', 'Lucida Console', 'monospace'],
				'tech': ['Share Tech Mono', 'Monaco', 'monospace']
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glitch': 'glitch 2s infinite',
				'cursor-blink': 'cursor-blink 1s infinite',
				'matrix-scroll': 'matrix-scroll 20s linear infinite',
				'hack-pulse': 'hack-pulse 1.5s ease-in-out infinite',
				'trace-warning': 'trace-warning 0.5s ease-in-out infinite'
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
				},
				'glitch': {
					'0%, 100%': { 
						textShadow: '0 0 10px #00FF41, 0 0 20px #00FF41'
					},
					'10%': {
						textShadow: '2px 0 #FF0000, -2px 0 #00FFFF'
					},
					'20%': {
						textShadow: '0 0 10px #00FF41'
					}
				},
				'cursor-blink': {
					'0%, 50%': { opacity: '1' },
					'51%, 100%': { opacity: '0' }
				},
				'matrix-scroll': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100vh)' }
				},
				'hack-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px #00FF41'
					},
					'50%': { 
						boxShadow: '0 0 20px #00FF41, 0 0 30px #00FF41'
					}
				},
				'trace-warning': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
			},
			backdropBlur: {
				'xs': '2px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
