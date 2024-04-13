import { serve } from "@hono/node-server";
import { Hono } from "hono";

import authRoutes from "./routes/auth";
import { factoryCreateClass } from "./utils/factory";
import { UserFilesMetadataService } from "./services/userFilesMetadataService/userFileService";

const app = new Hono();
app.get("/health", async (c) => c.status(200));
app.route("/api/auth", authRoutes);
const userFileService = factoryCreateClass(UserFilesMetadataService);
/*
userFileService.findFilesMetadataByUserId("1").then((files) => {
  console.log(files);
});
*/
serve(app, () => {
  console.log("Server is running on http://localhost:3000");
});
