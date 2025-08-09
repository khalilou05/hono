import { Hono } from "hono";

const orders = new Hono<{ Bindings: Env }>();

orders.get("/", async (c) => {
  c.env.DB.exec("SELCT NOW()");
});

export default orders;
