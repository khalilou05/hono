import { Hono } from "hono";
import { Product } from "../types/product";

const products = new Hono<{ Bindings: Env }>();

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

products.post("", async (c) => {
  const data = await c.req.json<Product>();
  const prdstmt = c.env.DB.prepare(
    "INSERT INTO products (id,name) VALUES (?,?)"
  ).bind(data.id, data.name);

  await c.env.DB.batch([prdstmt]);
});

export default products;
