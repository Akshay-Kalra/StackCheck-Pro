require("dotenv").config({ path: "../.env" });

const app = require("./app");
const { initDb } = require("./config/database");
const { PORT } = require("./config/env");

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`StackCheck Pro server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
