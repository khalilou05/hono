import { Hono } from "hono";
import { config } from "../config";

const aiRoute = new Hono<{ Bindings: Env }>();

interface Propmpt {
  prompt: string;
}

aiRoute.post("/ai", async (c) => {
  try {
    const { prompt } = await c.req.json<Propmpt>();
  } catch (e) {
    return c.text("somthing go wrong", 500);
  }
});

export default aiRoute;
