import { Hono } from "hono";
import { config } from "../config";

const test = new Hono<{ Bindings: Env }>();

test.get("/", async (c) => {
  console.log(c.req.raw.cf?.country);
  return c.text("done", 200);
});

export default test;
