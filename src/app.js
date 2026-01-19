// ✅ src/app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import session from "express-session";
import methodOverride from "method-override";

import apiRoutes from "./routes/api/index.js";
import adminRoutes from "./routes/admin/index.js";
import "./helpers/handlebarsHelpers.js";

const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Static
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Handlebars
const hbs = handlebars.create({
  defaultLayout: "main",
  layoutsDir: "src/views/layouts",
  partialsDir: "src/views/partials",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "src/views");

// Rotas
app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);

// Erro padrão
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Erro interno");
});

export default app;
