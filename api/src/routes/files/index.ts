import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { secrets } from "../../config/secrets";
import { JwtPayload } from "../../services/authService/types";
import { factoryCreateClass } from "../../utils/factory";
import { UserFilesMetadataService } from "../../services/userFilesMetadataService/userFileService";

const filesRoutes = new Hono();

const userFilesMetadataService = factoryCreateClass(UserFilesMetadataService);

filesRoutes.get(
  "/",
  jwt({
    secret: secrets.jwtSecret,
  }),
  async (c) => {
    const { userId } = c.get("jwtPayload") as JwtPayload;

    const files = await userFilesMetadataService.findFilesMetadataByUserId(
      userId
    );

    return c.json(files);
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

    const file = formData.get("file") as File;

    await userFilesMetadataService.registerFileMetadata(file, userId);

    return c.json({ message: "File registered" }, 201);
  }
);
export default filesRoutes;
