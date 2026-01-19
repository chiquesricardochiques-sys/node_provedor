import app from "../src/app.js";
import { createServer } from "http";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req, res) {
  // Express já sabe lidar com req/res do Node
  app(req, res);
}
