/**
 * Middleware para validar chave de acesso
 */

const validKeys = process.env.API_KEYS ? process.env.API_KEYS.split(",") : [];

export default function validateApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || !validKeys.includes(key)) {
    return res.status(401).json({ success: false, message: "Chave de API inválida ou ausente" });
  }
  next();
}
