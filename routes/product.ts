import { Hono } from "hono";
import { Product } from "../types/product";

const products = new Hono<{ Bindings: Env }>();

products.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const query = await c.env.DB.prepare("SELECT FROM products WHERE slug = ?")
    .bind(slug)
    .first();

  if (query) {
    return c.json(query);
  }

  return c.text("not found", 404);
});

products.post("/add", async (c) => {
  const product = await c.req.json<Product>();
  const prdstmt = c.env.DB.prepare(
    "INSERT INTO products (id,name) VALUES (?,?)"
  ).bind(product.id, product.name);
  const optionsStmt: D1PreparedStatement[] = [];
  for (const option of product.options) {
    optionsStmt.push(
      c.env.DB.prepare(
        "INSERT INTO product_options (id,name) VALUES (?,?)"
      ).bind(option.id, option.name)
    );
  }

  await c.env.DB.batch([prdstmt, ...optionsStmt]);
});

products.post("/delete", async (c) => {
  const idList = await c.req.json<string[]>();
  const stmtList = idList.map((id) =>
    c.env.DB.prepare("DELTE FROM products WHERE id = ? ").bind(id)
  );

  await c.env.DB.batch(stmtList);
});

export default products;
