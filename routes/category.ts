import { Hono } from "hono";

const categorys = new Hono<{ Bindings: Env }>();

categorys.get("/", async (c) => {
  const query = await c.env.DB.prepare("SELECT * FROM category").all();
});

categorys.post("/delete", async (c) => {
  try {
    const idList = await c.req.json<string[]>();
    const btchQuery = idList.map((id) =>
      c.env.DB.prepare("DELETE FROM category WHERE id = ?").bind(id)
    );
    await c.env.DB.batch(btchQuery);
  } catch (e) {
    return c.json({ msg: "somthing go wrong" });
  }
});
categorys.post("/add", async (c) => {
  try {
    const idList = await c.req.json<string[]>();
    const btchQuery = idList.map((id) =>
      c.env.DB.prepare("DELETE FROM category WHERE id = ?").bind(id)
    );
    await c.env.DB.batch(btchQuery);
  } catch (e) {
    return c.json({ msg: "somthing go wrong" });
  }
});

export default categorys;
