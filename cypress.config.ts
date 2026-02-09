import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'yrpgu6',
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents() {
    },
  },
});
