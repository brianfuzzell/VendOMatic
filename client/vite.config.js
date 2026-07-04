/// <reference types="vitest"/>
/// <reference types="vite/client"/>

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => {
return {
    server: {
    open: true,
    proxy: {
        "/api": {
        target: "https://localhost:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
        },
    },
    },
    build: {
    outDir: "build",
    },
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom'
    }
};
});