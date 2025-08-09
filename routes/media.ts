import { Hono } from "hono";
import { config } from "../config";

const media = new Hono<{ Bindings: Env }>();

media.post("/", async (c) => {
  const fileList = (await c.req.formData()).getAll("media") as File[];

  if (fileList.length > config.maxFilePerUpload) {
    return c.text("maximum file upload is 10", 500);
  }

  const uploadPromises: Promise<R2Object>[] = [];

  for (const file of fileList) {
    if (file.size > config.maxBolbSize) continue;

    const fileName = crypto.randomUUID().replaceAll("-", "");
    const fileExtension = file.name.split(".").pop();
    uploadPromises.push(
      c.env.BUCKET.put(`${fileName}.${fileExtension}`, file, {
        customMetadata: { fileType: file.type },
      })
    );
  }
  await Promise.allSettled(uploadPromises);
});

media.post("/delete", async (c) => {
  const fileToDelete = await c.req.json<string[]>();
  if (
    Array.isArray(fileToDelete) &&
    fileToDelete.some((item) => typeof item === "string")
  ) {
    try {
      await c.env.BUCKET.delete(fileToDelete);
      return c.text("success", 200);
    } catch (error) {
      return c.json({ msg: "somthing go wrong" }, 500);
    }
  }
  return c.text("invalid list ", 400);
});

export default media;
