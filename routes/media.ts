import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  MAX_BLOB_SIZE: number;
};

const media = new Hono<{ Bindings: Bindings }>();

media.post("/", async (c) => {
  const fileList = (await c.req.formData()).getAll("media") as File[];

  for (const file of fileList) {
    if (file.size > c.env.MAX_BLOB_SIZE) continue;
    const fileName = crypto.randomUUID().replaceAll("-", "");
    const fileExtension = file.name.split(".")[1];
    await c.env.BUCKET.put(`${fileName}.${fileExtension}`, file, {
      customMetadata: { fileType: file.type },
    });
  }
});

media.post("/delete", async (c) => {
  const fileToDelete = await c.req.json<string[]>();
  try {
    await Promise.all(fileToDelete.map((file) => c.env.BUCKET.delete(file)));
  } catch (error) {
    return c.json({ msg: "somthing go wrong" }, 500);
  }
});

export default media;
