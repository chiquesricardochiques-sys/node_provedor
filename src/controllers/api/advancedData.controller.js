/**
 * ====================================================
 * CONTROLLER - OPERAÇÕES AVANÇADAS
 * ====================================================
 */

import advancedApiClientService from "../../services/advancedApiClient.service.js";

/**
 * ADVANCED SELECT - Query complexa com JOINs
 * POST /api/advanced/select
 * 
 * Body: {
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
 * }
 */
export async function advancedSelect(req, res) {
  try {
    const options = req.body;

    if (!options.project_id || !options.id_instancia || !options.table) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia e table são obrigatórios",
      });
    }

    const result = await advancedApiClientService.advancedSelect(options);

    res.json({
      success: true,
      message: "Query executada com sucesso",
      data: result,
      count: Array.isArray(result) ? result.length : 0,
    });
  } catch (err) {
    console.error("❌ Erro no advanced select:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao executar query avançada",
      error: err.message,
    });
  }
}

/**
 * BATCH INSERT - Inserir múltiplos registros
 * POST /api/advanced/batch-insert
 * 
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "produtos",
 *   data: [
 *     { nome: "Produto 1", preco: 10.50 },
 *     { nome: "Produto 2", preco: 20.00 },
 *     { nome: "Produto 3", preco: 15.75 }
 *   ]
 * }
 */
export async function batchInsert(req, res) {
  try {
    const { project_id, id_instancia, table, data } = req.body;

    if (!project_id || !id_instancia || !table || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia, table e data (array) são obrigatórios",
      });
    }

    const result = await advancedApiClientService.batchInsert(
      project_id,
      id_instancia,
      table,
      data
    );

    res.json({
      success: true,
      message: `${data.length} registros inseridos com sucesso`,
      data: result,
    });
  } catch (err) {
    console.error("❌ Erro no batch insert:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao inserir registros em lote",
      error: err.message,
    });
  }
}

/**
 * BATCH UPDATE - Atualizar múltiplos registros
 * POST /api/advanced/batch-update
 * 
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "produtos",
 *   updates: [
 *     {
 *       data: { estoque: 50 },
 *       where: { id: 1 }
 *     },
 *     {
 *       data: { estoque: 100, preco: 25.00 },
 *       where: { id: 2 }
 *     }
 *   ]
 * }
 */
export async function batchUpdate(req, res) {
  try {
    const { project_id, id_instancia, table, updates } = req.body;

    if (!project_id || !id_instancia || !table || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia, table e updates (array) são obrigatórios",
      });
    }

    const result = await advancedApiClientService.batchUpdate(
      project_id,
      id_instancia,
      table,
      updates
    );

    res.json({
      success: true,
      message: `${updates.length} registros atualizados com sucesso`,
      data: result,
    });
  } catch (err) {
    console.error("❌ Erro no batch update:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar registros em lote",
      error: err.message,
    });
  }
}

/**
 * RELACIONAMENTO 1:N - Buscar com relacionamento Um para Muitos
 * POST /api/advanced/relation-one-to-many
 * 
 * Exemplo: Buscar pedidos com cliente
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "pedidos",
 *   relation: {
 *     table: "clientes",
 *     foreign_key: "cliente_id",
 *     select: ["nome", "email", "telefone"]
 *   }
 * }
 */
export async function relationOneToMany(req, res) {
  try {
    const { project_id, id_instancia, table, relation, where, order_by, limit } = req.body;

    if (!project_id || !id_instancia || !table || !relation) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia, table e relation são obrigatórios",
      });
    }

    const mainAlias = "main";
    const relAlias = "rel";

    const selectFields = [
      `${mainAlias}.*`,
      ...(relation.select || ["*"]).map(f => `${relAlias}.${f} as rel_${f}`)
    ];

    const options = {
      project_id,
      id_instancia,
      table,
      alias: mainAlias,
      select: selectFields,
      joins: [{
        type: relation.join_type || "LEFT",
        table: relation.table,
        alias: relAlias,
        on: `${mainAlias}.${relation.foreign_key} = ${relAlias}.id`
      }],
      where,
      order_by,
      limit
    };

    const result = await advancedApiClientService.advancedSelect(options);

    res.json({
      success: true,
      message: "Relacionamento 1:N recuperado com sucesso",
      data: result,
      count: Array.isArray(result) ? result.length : 0,
    });
  } catch (err) {
    console.error("❌ Erro no relacionamento 1:N:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar relacionamento 1:N",
      error: err.message,
    });
  }
}

/**
 * RELACIONAMENTO N:N - Buscar com relacionamento Muitos para Muitos
 * POST /api/advanced/relation-many-to-many
 * 
 * Exemplo: Buscar produtos com suas categorias
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "produtos",
 *   relation: {
 *     pivot_table: "produto_categoria",
 *     target_table: "categorias",
 *     pivot_foreign_key: "produto_id",
 *     pivot_target_key: "categoria_id"
 *   }
 * }
 */
export async function relationManyToMany(req, res) {
  try {
    const { project_id, id_instancia, table, relation, where, order_by, limit } = req.body;

    if (!project_id || !id_instancia || !table || !relation) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia, table e relation são obrigatórios",
      });
    }

    const mainAlias = "main";
    const pivotAlias = "pivot";
    const targetAlias = "target";

    const options = {
      project_id,
      id_instancia,
      table,
      alias: mainAlias,
      select: [
        `${mainAlias}.*`,
        `GROUP_CONCAT(${targetAlias}.nome SEPARATOR ', ') as related_names`,
        `GROUP_CONCAT(${targetAlias}.id) as related_ids`
      ],
      joins: [
        {
          type: "LEFT",
          table: relation.pivot_table,
          alias: pivotAlias,
          on: `${mainAlias}.id = ${pivotAlias}.${relation.pivot_foreign_key}`
        },
        {
          type: "LEFT",
          table: relation.target_table,
          alias: targetAlias,
          on: `${pivotAlias}.${relation.pivot_target_key} = ${targetAlias}.id`
        }
      ],
      where,
      group_by: `${mainAlias}.id`,
      order_by,
      limit
    };

    const result = await advancedApiClientService.advancedSelect(options);

    res.json({
      success: true,
      message: "Relacionamento N:N recuperado com sucesso",
      data: result,
      count: Array.isArray(result) ? result.length : 0,
    });
  } catch (err) {
    console.error("❌ Erro no relacionamento N:N:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar relacionamento N:N",
      error: err.message,
    });
  }
}

/**
 * AGREGAÇÃO - Query com funções de agregação
 * POST /api/advanced/aggregate
 * 
 * Body: {
 *   project_id: 1,
 *   id_instancia: 10,
 *   table: "vendas",
 *   select: ["produto_id", "COUNT(*) as total", "SUM(valor) as total_vendido"],
 *   group_by: "produto_id",
 *   having: "total_vendido > 1000",
 *   order_by: "total_vendido DESC"
 * }
 */
export async function aggregate(req, res) {
  try {
    const options = req.body;

    if (!options.project_id || !options.id_instancia || !options.table) {
      return res.status(400).json({
        success: false,
        message: "project_id, id_instancia e table são obrigatórios",
      });
    }

    const result = await advancedApiClientService.advancedSelect(options);

    res.json({
      success: true,
      message: "Agregação executada com sucesso",
      data: result,
      count: Array.isArray(result) ? result.length : 0,
    });
  } catch (err) {
    console.error("❌ Erro na agregação:", err.message);
    res.status(500).json({
      success: false,
      message: "Erro ao executar agregação",
      error: err.message,
    });
  }
}