import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const categorys = new Hono<{ Bindings: Bindings }>();

categorys.get("/", async (c) => {
  return c.json({ msg: "hello" });
});

export default categorys;
