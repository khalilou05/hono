import { Hono } from "hono";
import { Product } from "../types/product";

const products = new Hono<{ Bindings: Env }>();

products.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const query = await c.env.DB.prepare("SELECT FROM products WHERE slug = ?")
    .bind(slug)
    .first();

  if (query) {
    return c.text("", 200);
  }

  return c.text("not found", 404);
});

products.post("/add", async (c) => {
  try {
    const product = await c.req.json<Product>();
    const prdstmt = c.env.DB.prepare(
      "INSERT INTO products (id,name) VALUES (?,?)"
    ).bind(product.id, product.name);
    const optStmt = product.options.flatMap((opt) => {
      return opt.isCustom
        ? [
            c.env.DB.prepare("INSERT INTO option VALUES(?,?)").bind(
              opt.id,
              opt.name
            ),
          ]
        : c.env.DB.prepare("INSERT INTO product_option VALUES(?,?)").bind(
            opt.id,
            opt.name
          );
    });

    await c.env.DB.batch([prdstmt, ...optStmt]);
  } catch (r) {
    return c.text("somthing go wrong");
  }
});

products.post("/delete", async (c) => {
  const idList = await c.req.json<string[]>();
  const stmtList = idList.map((id) =>
    c.env.DB.prepare("DELTE FROM products WHERE id = ? ").bind(id)
  );

  await c.env.DB.batch(stmtList);
});

export default products;
