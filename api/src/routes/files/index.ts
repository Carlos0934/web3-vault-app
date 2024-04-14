import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { secrets } from "../../config/secrets";
import { JwtPayload } from "../../services/authService/types";
import { factoryCreateClass } from "../../utils/factory";
import { UserFilesMetadataService } from "../../services/userFilesMetadataService/userFileService";
import { FileService } from "../../services/fileService";
import { getChecksum } from "../../utils/crypto";

const filesRoutes = new Hono();

const userFilesMetadataService = factoryCreateClass(UserFilesMetadataService);
const fileService = factoryCreateClass(FileService);

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

filesRoutes.get(
  "/:key",
  jwt({
    secret: secrets.jwtSecret,
  }),
  async (c) => {
    const { userId } = c.get("jwtPayload") as JwtPayload;
    const key = c.req.param("key");

    const presignedUrl = await fileService.getPresignedUrl(key);
    const file = await userFilesMetadataService.findFileMetadataByUserIdAndKey(
      userId,
      key
    );
    return c.json({ file, presignedUrl });
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

    const filename = file.name;
    const size = file.size;
    const checksum = await getChecksum(file);
    const key = await fileService.uploadFile(file);
    await userFilesMetadataService.registerFileMetadata({
      checksum,
      key,
      userId,
      file: { name: filename, size },
    });

    return c.json({ message: "File registered" }, 201);
  }
);
export default filesRoutes;
