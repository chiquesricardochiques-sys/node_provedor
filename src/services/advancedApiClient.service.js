/**
 * ====================================================
 * SERVIÇO DE CLIENTE API - OPERAÇÕES AVANÇADAS
 * ====================================================
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GO_API_URL = process.env.GO_API_URL || "http://localhost:8080";
const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN;

/**
 * Cabeçalhos padrão
 */
function getHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Internal-Token": INTERNAL_TOKEN,
  };
}

/**
 * Requisição genérica
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
   ADVANCED SELECT - SELECT COM JOINS E FILTROS AVANÇADOS
==================================================== */

/**
 * Advanced Select - Busca com JOINs, filtros avançados, agrupamento, etc.
 * 
 * @param {object} options - Configurações da query
 * @param {number} options.project_id - ID do projeto
 * @param {number} options.id_instancia - ID da instância
 * @param {string} options.table - Tabela principal
 * @param {string} [options.alias] - Alias da tabela principal
 * @param {array} [options.select] - Colunas a selecionar ["col1", "col2"]
 * @param {array} [options.joins] - Configuração de JOINs
 * @param {object} [options.where] - Filtros simples (AND)
 * @param {string} [options.where_raw] - WHERE personalizado
 * @param {string} [options.order_by] - Ordenação
 * @param {string} [options.group_by] - Agrupamento
 * @param {string} [options.having] - Condição HAVING
 * @param {number} [options.limit] - Limite de resultados
 * @param {number} [options.offset] - Offset para paginação
 * 
 * @example
 * // SELECT com JOIN 1:N (pedidos com clientes)
 * advancedSelect({
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "pedidos",
 *   alias: "p",
 *   select: ["p.*", "c.nome as cliente_nome", "c.email"],
 *   joins: [{
 *     type: "LEFT",
 *     table: "clientes",
 *     alias: "c",
 *     on: "p.cliente_id = c.id"
 *   }],
 *   where: { "p.status": "ativo" },
 *   order_by: "p.created_at DESC",
 *   limit: 50
 * })
 * 
 * @example
 * // SELECT com JOIN N:N (produtos com categorias)
 * advancedSelect({
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "produtos",
 *   alias: "p",
 *   select: ["p.*", "GROUP_CONCAT(c.nome) as categorias"],
 *   joins: [
 *     {
 *       type: "LEFT",
 *       table: "produto_categoria",
 *       alias: "pc",
 *       on: "p.id = pc.produto_id"
 *     },
 *     {
 *       type: "LEFT",
 *       table: "categorias",
 *       alias: "c",
 *       on: "pc.categoria_id = c.id"
 *     }
 *   ],
 *   group_by: "p.id",
 *   order_by: "p.nome"
 * })
 * 
 * @example
 * // SELECT com agrupamento e HAVING
 * advancedSelect({
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "vendas",
 *   select: ["produto_id", "COUNT(*) as total", "SUM(valor) as total_vendido"],
 *   group_by: "produto_id",
 *   having: "total_vendido > 1000",
 *   order_by: "total_vendido DESC"
 * })
 */
async function advancedSelect(options) {
  const {
    project_id,
    id_instancia,
    table,
    alias,
    select,
    joins,
    where,
    where_raw,
    order_by,
    group_by,
    having,
    limit,
    offset,
  } = options;

  if (!project_id || !id_instancia || !table) {
    throw new Error("project_id, id_instancia e table são obrigatórios");
  }

  return requestToGo("/data/advanced-select", {
    project_id,
    id_instancia,
    table,
    alias,
    select,
    joins,
    where,
    where_raw,
    order_by,
    group_by,
    having,
    limit,
    offset,
  });
}

/* ====================================================
   BATCH INSERT - INSERIR MÚLTIPLOS REGISTROS
==================================================== */

/**
 * Batch Insert - Inserir múltiplos registros de uma vez
 * 
 * @param {number} project_id - ID do projeto
 * @param {number} id_instancia - ID da instância
 * @param {string} table - Nome da tabela
 * @param {array} data - Array de objetos a inserir
 * 
 * @example
 * batchInsert(1, 10, "produtos", [
 *   { nome: "Produto 1", preco: 10.50, estoque: 100 },
 *   { nome: "Produto 2", preco: 20.00, estoque: 50 },
 *   { nome: "Produto 3", preco: 15.75, estoque: 200 }
 * ])
 */
async function batchInsert(project_id, id_instancia, table, data) {
  if (!project_id || !id_instancia || !table || !Array.isArray(data) || data.length === 0) {
    throw new Error("project_id, id_instancia, table e data (array) são obrigatórios");
  }

  return requestToGo("/data/batch-insert", {
    project_id,
    id_instancia,
    table,
    data,
  });
}

/* ====================================================
   BATCH UPDATE - ATUALIZAR MÚLTIPLOS REGISTROS
==================================================== */

/**
 * Batch Update - Atualizar múltiplos registros com condições diferentes
 * 
 * @param {number} project_id - ID do projeto
 * @param {number} id_instancia - ID da instância
 * @param {string} table - Nome da tabela
 * @param {array} updates - Array de objetos com data e where
 * 
 * @example
 * batchUpdate(1, 10, "produtos", [
 *   {
 *     data: { estoque: 50 },
 *     where: { id: 1 }
 *   },
 *   {
 *     data: { estoque: 100, preco: 25.00 },
 *     where: { id: 2 }
 *   },
 *   {
 *     data: { status: "inativo" },
 *     where: { categoria: "descontinuado" }
 *   }
 * ])
 */
async function batchUpdate(project_id, id_instancia, table, updates) {
  if (!project_id || !id_instancia || !table || !Array.isArray(updates) || updates.length === 0) {
    throw new Error("project_id, id_instancia, table e updates (array) são obrigatórios");
  }

  return requestToGo("/data/batch-update", {
    project_id,
    id_instancia,
    table,
    updates,
  });
}

/* ====================================================
   HELPERS - FUNÇÕES AUXILIARES
==================================================== */

/**
 * Query Builder Helper - Construir joins facilmente
 */
class QueryBuilder {
  constructor(project_id, id_instancia, table) {
    this.config = {
      project_id,
      id_instancia,
      table,
      joins: [],
      where: {},
    };
  }

  select(columns) {
    this.config.select = Array.isArray(columns) ? columns : [columns];
    return this;
  }

  alias(alias) {
    this.config.alias = alias;
    return this;
  }

  join(type, table, alias, on) {
    this.config.joins.push({ type, table, alias, on });
    return this;
  }

  innerJoin(table, alias, on) {
    return this.join("INNER", table, alias, on);
  }

  leftJoin(table, alias, on) {
    return this.join("LEFT", table, alias, on);
  }

  rightJoin(table, alias, on) {
    return this.join("RIGHT", table, alias, on);
  }

  where(filters) {
    this.config.where = { ...this.config.where, ...filters };
    return this;
  }

  whereRaw(condition) {
    this.config.where_raw = condition;
    return this;
  }

  orderBy(order) {
    this.config.order_by = order;
    return this;
  }

  groupBy(group) {
    this.config.group_by = group;
    return this;
  }

  having(condition) {
    this.config.having = condition;
    return this;
  }

  limit(limit) {
    this.config.limit = limit;
    return this;
  }

  offset(offset) {
    this.config.offset = offset;
    return this;
  }

  paginate(page, perPage = 20) {
    this.config.limit = perPage;
    this.config.offset = (page - 1) * perPage;
    return this;
  }

  async execute() {
    return advancedSelect(this.config);
  }
}

/**
 * Factory para criar QueryBuilder
 */
function query(project_id, id_instancia, table) {
  return new QueryBuilder(project_id, id_instancia, table);
}

/* ====================================================
   EXPORTS
==================================================== */

export default {
  advancedSelect,
  batchInsert,
  batchUpdate,
  query, // Query Builder
};