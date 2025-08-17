import { Hono } from "hono";
import { config } from "../config";
import { isArrayOfType } from "../lib/helpers";

const media = new Hono<{ Bindings: Env }>();

media.post("/", async (c) => {
  const fileList = (await c.req.formData()).getAll("media") as File[];

  if (fileList.length > config.maxFileUpload) {
    return c.text(`maximum file upload is ${config.maxFileUpload} files`, 401);
  }
  try {
    const uploadPromises: Promise<R2Object>[] = [];

    for (const file of fileList) {
      const fileName = crypto.randomUUID().replaceAll("-", "");
      const fileExtension = file.name.split(".").pop();
      uploadPromises.push(
        c.env.BUCKET.put(`${fileName}.${fileExtension}`, file, {
          customMetadata: { fileType: file.type },
        })
      );
    }
    // todo add the media url to the databse
    await Promise.allSettled(uploadPromises);
    return c.text("success", 201);
  } catch (e) {
    console.log(e);
    return c.text("error", 500);
  }
});

media.post("/delete", async (c) => {
  const fileToDelete = await c.req.json<string[]>();
  if (isArrayOfType(fileToDelete, "string")) {
    try {
      await c.env.BUCKET.delete(fileToDelete);
      return c.text("success", 200);
    } catch (error) {
      return c.json({ msg: "somthing go wrong" }, 500);
    }
  }
  return c.text("invalid list ", 400);
});

media.get("/:key", async (c) => {
  const mediaKey = c.req.param("key");
  const data = await c.env.BUCKET.get(mediaKey);

  return new Response(data?.body);
});

export default media;
