/**
 * ====================================================
 * ROUTES - OPERAÇÕES SIMPLES (CRUD BÁSICO)
 * ====================================================
 */

import { Router } from "express";
import * as simpleDataController from "../../controllers/api/simpleData.controller.js";
import validateApiKey from "../../middlewares/apiKey.middleware.js";

const router = Router();

/**
 * Todas as rotas requerem API Key válida
 */
router.use(validateApiKey);

/**
 * INSERT - Inserir um único registro
 * POST /api/simple/insert
 */
router.post("/insert", simpleDataController.insertRecord);

/**
 * GET - Buscar registros simples
 * POST /api/simple/get
 */
router.post("/get", simpleDataController.getRecords);

/**
 * UPDATE - Atualizar um único registro
 * POST /api/simple/update
 */
router.post("/update", simpleDataController.updateRecord);

/**
 * DELETE - Deletar um único registro
 * POST /api/simple/delete
 */
router.post("/delete", simpleDataController.deleteRecord);

export default router;