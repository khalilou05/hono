import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const orders = new Hono<{ Bindings: Bindings }>();

orders.get("/", async (c) => {
  c.env.DB.exec("SELCT NOW()");
});

export default orders;
