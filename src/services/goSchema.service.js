/**
 * ====================================================
 * SERVIÇO DE TABELAS (SCHEMA) - COMUNICAÇÃO COM GO
 * ====================================================
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GO_API_URL = process.env.GO_API_URL || "http://localhost:8080";
const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN;

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Internal-Token": INTERNAL_TOKEN,
  };
}

/* ====================================================
   TABELAS
==================================================== */

/**
 * Cria uma tabela (com ou sem índices)
 * @param {Object} tableData - { project_id, table_name, columns, indexes? }
 */
async function createTable(tableData) {
  try {
    const payload = {
      project_id: tableData.project_id,
      table_name: tableData.table_name,
      columns: tableData.columns,
      indexes: tableData.indexes || []
    };

    const res = await axios.post(`${GO_API_URL}/schema/table`, payload, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao criar tabela:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Lista tabelas (simples ou detalhadas)
 * @param {number} project_id 
 * @param {boolean} detailed - true para retornar com colunas e índices
 */
async function listTables(project_id, detailed = false) {
  try {
    const params = { project_id };
    if (detailed) {
      params.detailed = "true";
    }

    const res = await axios.get(`${GO_API_URL}/schema/tables`, {
      headers: getHeaders(),
      params: params,
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao listar tabelas:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Obtém detalhes completos de uma tabela específica
 * @param {number} project_id 
 * @param {string} table 
 */
async function getTableDetails(project_id, table) {
  try {
    const res = await axios.get(`${GO_API_URL}/schema/table/details`, {
      headers: getHeaders(),
      params: { project_id, table },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar detalhes da tabela:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Deleta uma tabela
 * @param {number} project_id 
 * @param {string} table 
 */
async function deleteTable(project_id, table) {
  try {
    const res = await axios.delete(`${GO_API_URL}/schema/table`, {
      headers: getHeaders(),
      params: { project_id, table },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao deletar tabela:", err.response?.data || err.message);
    throw err;
  }
}

/* ====================================================
   COLUNAS
==================================================== */

/**
 * Adiciona uma coluna
 * @param {number} project_id 
 * @param {string} table 
 * @param {Object} columnData - { name, type, nullable, unique }
 */
async function addColumn(project_id, table, columnData) {
  try {
    const res = await axios.post(`${GO_API_URL}/schema/column`, columnData, {
      headers: getHeaders(),
      params: { project_id, table },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao adicionar coluna:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Modifica uma coluna existente
 * @param {number} project_id 
 * @param {string} table 
 * @param {Object} columnData - { name, type, nullable, unique }
 */
async function modifyColumn(project_id, table, columnData) {
  try {
    const res = await axios.put(`${GO_API_URL}/schema/column`, columnData, {
      headers: getHeaders(),
      params: { project_id, table },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao modificar coluna:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Remove uma coluna
 * @param {number} project_id 
 * @param {string} table 
 * @param {string} column 
 */
async function dropColumn(project_id, table, column) {
  try {
    const res = await axios.delete(`${GO_API_URL}/schema/column`, {
      headers: getHeaders(),
      params: { project_id, table, column },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao remover coluna:", err.response?.data || err.message);
    throw err;
  }
}

/* ====================================================
   ÍNDICES
==================================================== */

/**
 * Adiciona um índice
 * @param {number} project_id 
 * @param {string} table 
 * @param {Object} indexData - { name, columns, type }
 */
async function addIndex(project_id, table, indexData) {
  try {
    const res = await axios.post(`${GO_API_URL}/schema/index`, indexData, {
      headers: getHeaders(),
      params: { project_id, table },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao adicionar índice:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Remove um índice
 * @param {number} project_id 
 * @param {string} table 
 * @param {string} index 
 */
async function dropIndex(project_id, table, index) {
  try {
    const res = await axios.delete(`${GO_API_URL}/schema/index`, {
      headers: getHeaders(),
      params: { project_id, table, index },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao remover índice:", err.response?.data || err.message);
    throw err;
  }
}

/* ====================================================
   EXPORTS
==================================================== */

export default {
  // Tabelas
  createTable,
  listTables,
  getTableDetails,
  deleteTable,

  // Colunas
  addColumn,
  modifyColumn,
  dropColumn,

  // Índices
  addIndex,
  dropIndex,
};

