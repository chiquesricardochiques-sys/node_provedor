import express from "express";
import * as apiClientService from "../../services/apiClient.service.js";
import validateApiKey from "../../middlewares/apiKey.middleware.js";

const router = express.Router();

/* ====================================================
   ROTAS CRUD GENÉRICO
==================================================== */

/**
 * INSERT - adiciona um registro em qualquer tabela
 * POST /api/insert
 * Body: { table, id_instancia, data }
 */
router.post("/insert", validateApiKey, async (req, res) => {
  try {
    const { table, id_instancia, data } = req.body;

    if (!table || !id_instancia || !data) {
      return res.status(400).json({
        success: false,
        message: "table, id_instancia e data são obrigatórios"
      });
    }

    const result = await apiClientService.insert(table, id_instancia, data);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Erro no insert:", err.message);
    res.status(500).json({ success: false, message: "Erro ao inserir dados" });
  }
});

/**
 * GET - busca registros em qualquer tabela
 * POST /api/get
 * Body: { table, id_instancia, where }
 */
router.post("/get", validateApiKey, async (req, res) => {
  try {
    const { table, id_instancia, where } = req.body;

    if (!table || !id_instancia) {
      return res.status(400).json({
        success: false,
        message: "table e id_instancia são obrigatórios"
      });
    }

    const result = await apiClientService.get(table, id_instancia, where);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Erro no get:", err.message);
    res.status(500).json({ success: false, message: "Erro ao buscar dados" });
  }
});

/**
 * UPDATE - atualiza registros em qualquer tabela
 * POST /api/update
 * Body: { table, id_instancia, data, where }
 */
router.post("/update", validateApiKey, async (req, res) => {
  try {
    const { table, id_instancia, data, where } = req.body;

    if (!table || !id_instancia || !data || !where) {
      return res.status(400).json({
        success: false,
        message: "table, id_instancia, data e where são obrigatórios"
      });
    }

    const result = await apiClientService.update(table, id_instancia, data, where);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Erro no update:", err.message);
    res.status(500).json({ success: false, message: "Erro ao atualizar dados" });
  }
});

/**
 * DELETE - remove registros de qualquer tabela
 * POST /api/delete
 * Body: { table, id_instancia, where }
 */
router.post("/delete", validateApiKey, async (req, res) => {
  try {
    const { table, id_instancia, where } = req.body;

    if (!table || !id_instancia || !where) {
      return res.status(400).json({
        success: false,
        message: "table, id_instancia e where são obrigatórios"
      });
    }

    const result = await apiClientService.delete(table, id_instancia, where);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Erro no delete:", err.message);
    res.status(500).json({ success: false, message: "Erro ao deletar dados" });
  }
});

/* ====================================================
   EXPORTS
==================================================== */

export default router;
