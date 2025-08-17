import { Hono } from "hono";
import { config } from "../config";

const aiRoute = new Hono<{ Bindings: Env }>();

interface Propmpt {
  prompt: string;
}

aiRoute.post("/ai", async (c) => {
  try {
    const clientIP = c.req.header("CF-Connecting-IP") || "";
    const reqNum = parseInt((await c.env.KV.get(`${clientIP}:ai`)) || "0");
    if (reqNum >= config.maxAiReq) {
      return c.text(`maximum ${config.maxAiReq} exeded`, 401);
    }
    const { prompt } = await c.req.json<Propmpt>();

    c.executionCtx.waitUntil(c.env.KV.put(`${clientIP}:ai`, `${reqNum + 1}`));
  } catch (e) {
    return c.text("somthing go wrong", 500);
  }
});

export default aiRoute;
