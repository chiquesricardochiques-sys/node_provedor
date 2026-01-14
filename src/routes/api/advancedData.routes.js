/**
 * ====================================================
 * ROUTES - OPERAÇÕES AVANÇADAS
 * ====================================================
 */

import { Router } from "express";
import * as advancedDataController from "../../controllers/api/advancedData.controller.js";
import validateApiKey from "../../middlewares/apiKey.middleware.js";

const router = Router();

/**
 * Todas as rotas requerem API Key válida
 */
router.use(validateApiKey);

/**
 * ADVANCED SELECT - Query complexa com JOINs
 * POST /api/advanced/select
 */
router.post("/select", advancedDataController.advancedSelect);

/**
 * BATCH INSERT - Inserir múltiplos registros
 * POST /api/advanced/batch-insert
 */
router.post("/batch-insert", advancedDataController.batchInsert);

/**
 * BATCH UPDATE - Atualizar múltiplos registros
 * POST /api/advanced/batch-update
 */
router.post("/batch-update", advancedDataController.batchUpdate);

/**
 * RELACIONAMENTO 1:N - Um para Muitos
 * POST /api/advanced/relation-one-to-many
 */
router.post("/relation-one-to-many", advancedDataController.relationOneToMany);

/**
 * RELACIONAMENTO N:N - Muitos para Muitos
 * POST /api/advanced/relation-many-to-many
 */
router.post("/relation-many-to-many", advancedDataController.relationManyToMany);

/**
 * AGREGAÇÃO - Funções de agregação (COUNT, SUM, AVG, etc)
 * POST /api/advanced/aggregate
 */
router.post("/aggregate", advancedDataController.aggregate);

export default router;