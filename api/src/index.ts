import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import authRoutes from "./routes/auth";
import filesRoutes from "./routes/files";

const app = new Hono();
app.get("/health", async (c) => c.status(200));

app.route("/api/auth", authRoutes);
app.route("/api/files", filesRoutes);

serve(app, () => {
  console.log("Server is running on http://localhost:3000");
});
