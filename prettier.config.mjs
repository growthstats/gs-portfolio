/** @type {import('prettier').Config} */
const config = {
	printWidth: 100,
	trailingComma: 'all',
	singleQuote: true,
	semi: false,
	plugins: ['prettier-plugin-tailwindcss'],
	// Tailwind v4 has no JS config; the plugin reads theme and custom utilities from the CSS entry.
	tailwindStylesheet: './src/styles/app.css',
}

export default config
