/**
 * ====================================================
 * ROUTES - INDEX PRINCIPAL
 * ====================================================
 */

import { Router } from "express";
import simpleDataRoutes from "./simpleData.routes.js";
import advancedDataRoutes from "./advancedData.routes.js";

const router = Router();

/**
 * Rotas simples (CRUD básico)
 * /api/simple/*
 */
router.use("/simple", simpleDataRoutes);

/**
 * Rotas avançadas (JOINs, relacionamentos, agregação)
 * /api/advanced/*
 */
router.use("/advanced", advancedDataRoutes);

export default router;