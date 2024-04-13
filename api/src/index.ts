import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { factoryCreateClass } from "./utils/factory";
import authRoutes from "./routes/auth";

const app = new Hono();
app.get("/health", async (c) => c.status(200));
app.route("/api/auth", authRoutes);
serve(app, () => {
  console.log("Server is running on http://localhost:3000");
});
