import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:4000/api-docs.json",
    },
    output: {
      mode: "tags-split",
      target: "src/api/generated",
      schemas: "src/api/models",
      client: "react-query", // or 'axios', 'fetch', 'swr'
      mock: true,
      prettier: true,
      override: {
        mutator: {
          path: "./src/api/client.ts",
          name: "customInstance",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
