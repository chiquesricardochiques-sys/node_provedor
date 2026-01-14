/**
 * ====================================================
 * SERVIÇO DE CLIENTE API - OPERAÇÕES SIMPLES
 * ====================================================
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GO_API_URL = process.env.GO_API_URL || "http://localhost:8080";
const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN;

/**
 * Cabeçalhos padrão para comunicação segura com Go
 */
function getHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Internal-Token": INTERNAL_TOKEN,
  };
}

/**
 * Função genérica para fazer requisições ao Go
 */
async function requestToGo(endpoint, payload) {
  try {
    const res = await axios.post(`${GO_API_URL}${endpoint}`, payload, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error(
      `❌ Erro na requisição para ${endpoint}:`,
      err.response?.data || err.message
    );
    throw new Error(err.response?.data || err.message);
  }
}

/* ====================================================
   CRUD SIMPLES
==================================================== */

/**
 * INSERT - Inserir um único registro
 * @param {number} project_id - ID do projeto
 * @param {number} id_instancia - ID da instância
 * @param {string} table - Nome da tabela
 * @param {object} data - Dados a inserir
 */
async function insert(project_id, id_instancia, table, data) {
  if (!project_id || !id_instancia || !table || !data) {
    throw new Error("project_id, id_instancia, table e data são obrigatórios");
  }
  
  return requestToGo("/data/insert", {
    project_id,
    id_instancia,
    table,
    data,
  });
}

/**
 * GET - Buscar registros simples
 * @param {number} project_id - ID do projeto
 * @param {number} id_instancia - ID da instância
 * @param {string} table - Nome da tabela
 * @param {object} filters - Filtros (WHERE)
 */
async function get(project_id, id_instancia, table, filters = {}) {
  if (!project_id || !id_instancia || !table) {
    throw new Error("project_id, id_instancia e table são obrigatórios");
  }

  return requestToGo("/data/get", {
    project_id,
    id_instancia,
    table,
    filters,
  });
}

/**
 * UPDATE - Atualizar um único registro
 * @param {number} project_id - ID do projeto
 * @param {number} id_instancia - ID da instância
 * @param {string} table - Nome da tabela
 * @param {number} id - ID do registro
 * @param {object} data - Dados a atualizar
 */
async function update(project_id, id_instancia, table, id, data) {
  if (!project_id || !id_instancia || !table || !id || !data) {
    throw new Error("project_id, id_instancia, table, id e data são obrigatórios");
  }

  return requestToGo("/data/update", {
    project_id,
    id_instancia,
    table,
    id,
    data,
  });
}

/**
 * DELETE - Deletar um único registro
 * @param {number} project_id - ID do projeto
 * @param {number} id_instancia - ID da instância
 * @param {string} table - Nome da tabela
 * @param {number} id - ID do registro
 */
async function del(project_id, id_instancia, table, id) {
  if (!project_id || !id_instancia || !table || !id) {
    throw new Error("project_id, id_instancia, table e id são obrigatórios");
  }

  return requestToGo("/data/delete", {
    project_id,
    id_instancia,
    table,
    id,
  });
}

export default {
  insert,
  get,
  update,
  delete: del,
};