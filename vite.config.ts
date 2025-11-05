import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ✅ Add alias for @ and react-is fix
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-is": require.resolve("react-is"), // Handle react-is module resolution
    },
  },

  // ✅ Optional optimization fixes (for some shadcn/ui setups)
  optimizeDeps: {
    include: ["react-is"], // Force Vite to pre-bundle react-is
  },

  build: {
    commonjsOptions: {
      include: [/react-is/, /node_modules/], // Handle CJS modules like react-is
    },
  },
});
