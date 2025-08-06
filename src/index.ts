import { Hono } from "hono";
import categorys from "../routes/category";
import products from "../routes/product";
import { cors } from "hono/cors";
import media from "../routes/media";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const app = new Hono().basePath("/api");
    if (env.NODE_ENV === "DEV") {
      app.use(cors({ origin: "http://localhost:3000" }));
    }
    app.route("/products", products);
    app.route("/categorys", categorys);
    app.route("/media", media);
    return app.fetch(request, env, ctx);
  },
};
