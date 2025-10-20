import { defineConfig } from "vitest/config"
import path from "node:path"
import url from "node:url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: [path.resolve(__dirname, "vitest.setup.ts")],
		include: ["__tests__/**/*.test.{ts,tsx}"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
})
