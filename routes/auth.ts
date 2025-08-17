import { Hono } from "hono";
import { config } from "../config";

const auth = new Hono<{ Bindings: Env }>();

interface Auth {
  username: string;
  password: string;
}

auth.post("/login", async (c) => {
  const clientIP = c.req.header("CF-Connecting-IP") || "";
  const LoginAttempNum = parseInt(
    (await c.env.KV.get(`${clientIP}:login`)) || "0"
  );
  if (LoginAttempNum >= config.LoginMaxAttemp) {
    return c.text("max login attemp exeeded", 400);
  }
  try {
    const data = await c.req.json<Auth>();
    const query = await c.env.DB.prepare(
      "SELECT user_name, password FROM users WHERE user_name = ? OR email = ?"
    )
      .bind(data.username, data.username)
      .first();
    if (!query) {
      c.executionCtx.waitUntil(
        c.env.KV.put(`${clientIP}:login`, `${LoginAttempNum + 1}`, {
          expirationTtl: 600,
        })
      );
      return c.json({ msg: "invalid username or password" });
    }
  } catch (e) {
    return c.json({ msg: "somthing go wrong" });
  }
});

export default auth;
