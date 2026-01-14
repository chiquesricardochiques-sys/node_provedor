/**
 * ====================================================
 * CONTROLLER - OPERAÇÕES SIMPLES (CRUD BÁSICO)
 * ====================================================
 */

import apiClientService from "../../services/apiClient.service.js";

/**
 * INSERT - Inserir um único registro
 * POST /api/simple/insert
 * 
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "produtos",
 *   data: { nome: "Produto X", preco: 10.50 }
 * }
 */
export async function insertRecord(req, res) {
  try {
    const { project_id, id_instancia, table, data } = req.body;

    if (!project_id || !id_instancia || !table || !data) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia, table e data são obrigatórios",
      });
    }

    const result = await apiClientService.insert(
      project_id,
      id_instancia,
      table,
      data
    );

    res.json({
      success: true,
      message: "Registro inserido com sucesso",
      data: result,
    });
  } catch (err) {
    console.error("❌ Erro no insert:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao inserir registro",
      error: err.message,
    });
  }
}

/**
 * GET - Buscar registros simples
 * POST /api/simple/get
 * 
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "produtos",
 *   filters: { categoria: "eletrônicos", status: "ativo" }
 * }
 */
export async function getRecords(req, res) {
  try {
    const { project_id, id_instancia, table, filters } = req.body;

    if (!project_id || !id_instancia || !table) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia e table são obrigatórios",
      });
    }

    const result = await apiClientService.get(
      project_id,
      id_instancia,
      table,
      filters || {}
    );

    res.json({
      success: true,
      message: "Registros recuperados com sucesso",
      data: result,
      count: Array.isArray(result) ? result.length : 0,
    });
  } catch (err) {
    console.error("❌ Erro no get:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar registros",
      error: err.message,
    });
  }
}

/**
 * UPDATE - Atualizar um único registro
 * POST /api/simple/update
 * 
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "produtos",
 *   id: 5,
 *   data: { preco: 15.00, estoque: 100 }
 * }
 */
export async function updateRecord(req, res) {
  try {
    const { project_id, id_instancia, table, id, data } = req.body;

    if (!project_id || !id_instancia || !table || !id || !data) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia, table, id e data são obrigatórios",
      });
    }

    const result = await apiClientService.update(
      project_id,
      id_instancia,
      table,
      id,
      data
    );

    res.json({
      success: true,
      message: "Registro atualizado com sucesso",
      data: result,
    });
  } catch (err) {
    console.error("❌ Erro no update:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar registro",
      error: err.message,
    });
  }
}

/**
 * DELETE - Deletar um único registro
 * POST /api/simple/delete
 * 
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "produtos",
 *   id: 5
 * }
 */
export async function deleteRecord(req, res) {
  try {
    const { project_id, id_instancia, table, id } = req.body;

    if (!project_id || !id_instancia || !table || !id) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia, table e id são obrigatórios",
      });
    }

    const result = await apiClientService.delete(
      project_id,
      id_instancia,
      table,
      id
    );

    res.json({
      success: true,
      message: "Registro deletado com sucesso",
      data: result,
    });
  } catch (err) {
    console.error("❌ Erro no delete:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar registro",
      error: err.message,
    });
  }
}