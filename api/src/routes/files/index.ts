import { Hono } from "hono";

import { jwt } from "hono/jwt";
import { secrets } from "../../config/secrets";
import { JwtPayload } from "../../services/authService/types";
import { factoryCreateClass } from "../../utils/factory";
import { IotaTangleService } from "../../services/tangleService";

const filesRoutes = new Hono();

const iotaTangleService = factoryCreateClass(IotaTangleService);

filesRoutes.get(
  "/",
  jwt({
    secret: secrets.jwtSecret,
  }),
  async (c) => {
    const { userId } = c.get("jwtPayload") as JwtPayload;

    const files = await iotaTangleService.getUserFiles(userId);

    return c.json(files);
  }
);

filesRoutes.get(
  "/:key",
  jwt({
    secret: secrets.jwtSecret,
  }),
  async (c) => {
    const { userId } = c.get("jwtPayload") as JwtPayload;
    const key = c.req.param("key");

    const file = await iotaTangleService.getFile({
      fileId: key,
      userId,
    });

    if (!file) {
      return c.json({ message: "File not found" }, 404);
    }

    const acceptHeader = c.req.header("Accept");
    if (acceptHeader === "application/json") {
      return c.json(file);
    }
    const stream = await iotaTangleService.downloadFile(key);
    return new Response(stream, {
      headers: {
        "Content-Length": file.size.toString(),
        "Content-Disposition": `attachment; filename="${key}"`,
      },
    });
  }
);

filesRoutes.post(
  "/",

  jwt({
    secret: secrets.jwtSecret,
  }),

  async (c) => {
    const { userId } = c.get("jwtPayload") as JwtPayload;
    const formData = await c.req.formData();
    const maxSize = 1024 * 500; // 500kb

    const file = formData.get("file") as File;
    if (!file) {
      return c.json({ message: "File not found" }, 400);
    }

    if (file.size > maxSize) {
      return c.json({ message: "File too large" }, 400);
    }
    await iotaTangleService.uploadFile(file, userId, (progress) => {
      console.log(`Progress: ${progress.toFixed(2)}`);
    });
    return c.json({ message: "File uploaded" });
  }
);

export default filesRoutes;
