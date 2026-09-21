import { buildApp } from "./app.js";
import { loadConfig } from "./config/env.js";

async function main() {
  const config = loadConfig();
  const app = await buildApp(config);
  await app.listen({ port: config.PORT, host: "0.0.0.0" });
}

main().catch((err) => {
  console.error("API startup failed", err);
  process.exit(1);
});
