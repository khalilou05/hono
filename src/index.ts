import { Hono } from "hono";

const app = new Hono();

// khalil

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
