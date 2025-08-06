import { Hono } from "hono";
import type { Product } from "../types/product";

type Bindings = {
  DB: D1Database;
  CACHE: KVNamespace;
  BUCKET: R2Bucket;
};

const products = new Hono<{ Bindings: Bindings }>();

products.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const query = await c.env.DB.prepare("SELECT FROM products WHERE slug = ?")
    .bind(slug)
    .run();

  if (query.success) {
    return c.json(query);
  }

  return c.text("not found", 404);
});

products.post("/products", async (c) => {
  const data = await c.req.json();
});

export default products;
