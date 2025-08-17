import { Hono } from "hono";

const cities = new Hono<{ Bindings: Env }>();

cities.get("/wilaya", async (c) => {
  const { active, lang } = c.req.query();
  const activeParam = active === "0" ? 0 : 1;
  const langParam = lang === "fr" ? "fr_name" : "ar_name";
  const query = `SELECT id,${langParam},desk_price,home_price,active FROM wilaya WHERE active = ?`;

  const wilaya = await c.env.DB.prepare(query).bind(activeParam).all();

  return c.json(wilaya.results);
});

cities.get("/baladiya/:wilayaID", async (c) => {
  const { lang } = c.req.query();
  const langParam = lang === "fr" ? "fr_name" : "ar_name";
  const wilayaID = parseInt(c.req.param("wilayaID"));
  const baladiya = await c.env.DB.prepare(
    `SELECT id,${langParam} FROM baladiya WHERE wilaya_id = ?`
  )
    .bind(wilayaID)
    .all();

  return c.json(baladiya.results);
});

export default cities;
