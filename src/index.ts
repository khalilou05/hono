import { Hono } from "hono";
import categorys from "../routes/category";
import products from "../routes/product";
import { cors } from "hono/cors";
import media from "../routes/media";
import test from "../routes/test";
import cities from "../routes/cities";

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const app = new Hono().basePath("/api");
    if (env.DEV_MODE) {
      app.use(cors({ origin: "http://localhost:3000" }));
    }

    app.route("/products", products);
    app.route("/categorys", categorys);
    app.route("/media", media);
    app.route("/cities", cities);
    app.route("/test", test);
    return app.fetch(request, env, ctx);
  },
};
