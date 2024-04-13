import { defineConfig } from "vitest/config";
import { config } from "dotenv";

export default defineConfig({
  test: {
    exclude: ["node_modules"],

    env: {
      ...config({ path: ".env.test" }).parsed,
    },
  },
});
