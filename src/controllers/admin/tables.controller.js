


import goSchemaService from "../../services/goSchema.service.js";
import goProjectsService from "../../services/goProjects.service.js";

/* ====================================================
   LISTAR TABELAS
==================================================== */

export async function renderListTables(req, res) {
  const projectId = req.query.project_id;
  
  if (!projectId) {
    return res.status(400).send("project_id é obrigatório");
  }

  try {
    const projects = await goProjectsService.listProjects();
    const project = projects.find(p => p.id == projectId);
    
    if (!project) {
      return res.status(404).send("Projeto não encontrado");
    }

    // Lista com detalhes completos (colunas + índices)
    const tables = await goSchemaService.listTables(projectId, true);

    res.render("admin/tables/list", { project, tables: tables || [] });
  } catch (error) {
    console.error("Erro ao renderizar lista de tabelas:", error.message);
    res.status(500).send("Erro ao renderizar lista de tabelas");
  }
}

/* ====================================================
   DETALHES DE UMA TABELA
==================================================== */

export async function renderTableDetails(req, res) {
  const { project_id, table } = req.query;

  if (!project_id || !table) {
    return res.status(400).send("project_id e table são obrigatórios");
  }

  try {
    const projects = await goProjectsService.listProjects();
    const project = projects.find(p => p.id == project_id);

    if (!project) {
      return res.status(404).send("Projeto não encontrado");
    }

    const tableDetails = await goSchemaService.getTableDetails(project_id, table);

    res.render("admin/tables/details", { project, table: tableDetails });
  } catch (err) {
    console.error("Erro ao buscar detalhes da tabela:", err.message);
    res.status(500).send("Erro ao buscar detalhes da tabela");
  }
}

/* ====================================================
   CRIAR TABELA
==================================================== */

export async function renderCreateTable(req, res) {
  const projectId = req.query.project_id;
  
  if (!projectId) {
    return res.status(400).send("project_id é obrigatório");
  }

  try {
    const projects = await goProjectsService.listProjects();
    const project = projects.find(p => p.id == projectId);

    if (!project) {
      return res.status(404).send("Projeto não encontrado");
    }

    res.render("admin/tables/create", { project });
  } catch (err) {
    console.error("Erro ao renderizar criação de tabela:", err.message);
    res.status(500).send("Erro ao renderizar criação de tabela");
  }
}

export async function createTable(req, res) {
  const { project_id, table_name, columns_json, indexes_json } = req.body;

  if (!project_id || !table_name || !columns_json) {
    return res.status(400).send("project_id, table_name e colunas são obrigatórios");
  }

  let columns, indexes = [];
  
  try {
    columns = JSON.parse(columns_json);
    if (indexes_json) {
      indexes = JSON.parse(indexes_json);
    }
  } catch (err) {
    return res.status(400).send("Formato de dados inválido");
  }

  const tableData = {
    project_id: parseInt(project_id),
    table_name: table_name,
    columns: columns,
    indexes: indexes
  };

  try {
    await goSchemaService.createTable(tableData);
    res.redirect(`/admin/tables?project_id=${project_id}`);
  } catch (err) {
    console.error("Erro ao criar tabela:", err.message);
    res.status(500).send("Erro ao criar tabela: " + err.message);
  }
}

/* ====================================================
   DELETAR TABELA
==================================================== */

export async function deleteTable(req, res) {
  const { project_id, table } = req.body;
  
  if (!project_id || !table) {
    return res.status(400).json({ success: false, message: "project_id e table são obrigatórios" });
  }

  try {
    await goSchemaService.deleteTable(project_id, table);
    res.redirect(`/admin/tables?project_id=${project_id}`);
  } catch (err) {
    console.error("Erro ao deletar tabela:", err.message);
    res.status(500).json({ success: false, message: "Erro ao deletar tabela" });
  }
}

/* ====================================================
   GERENCIAR COLUNAS
==================================================== */

export async function addColumn(req, res) {
  const { project_id, table, name, type, nullable, unique } = req.body;
  
  if (!project_id || !table || !name || !type) {
    return res.status(400).json({ success: false, message: "Campos obrigatórios faltando" });
  }

  const columnData = {
    name,
    type,
    nullable: !!nullable,
    unique: !!unique
  };

  try {
    await goSchemaService.addColumn(project_id, table, columnData);
    res.redirect(`/admin/tables/details?project_id=${project_id}&table=${table}`);
  } catch (err) {
    console.error("Erro ao adicionar coluna:", err.message);
    res.status(500).json({ success: false, message: "Erro ao adicionar coluna" });
  }
}

export async function modifyColumn(req, res) {
  const { project_id, table, name, type, nullable, unique } = req.body;
  
  if (!project_id || !table || !name || !type) {
    return res.status(400).json({ success: false, message: "Campos obrigatórios faltando" });
  }

  const columnData = {
    name,
    type,
    nullable: !!nullable,
    unique: !!unique
  };

  try {
    await goSchemaService.modifyColumn(project_id, table, columnData);
    res.redirect(`/admin/tables/details?project_id=${project_id}&table=${table}`);
  } catch (err) {
    console.error("Erro ao modificar coluna:", err.message);
    res.status(500).json({ success: false, message: "Erro ao modificar coluna" });
  }
}

export async function dropColumn(req, res) {
  const { project_id, table, column } = req.body;
  
  if (!project_id || !table || !column) {
    return res.status(400).json({ success: false, message: "Campos obrigatórios faltando" });
  }

  try {
    await goSchemaService.dropColumn(project_id, table, column);
    res.redirect(`/admin/tables/details?project_id=${project_id}&table=${table}`);
  } catch (err) {
    console.error("Erro ao remover coluna:", err.message);
    res.status(500).json({ success: false, message: "Erro ao remover coluna" });
  }
}

/* ====================================================
   GERENCIAR ÍNDICES
==================================================== */

export async function addIndex(req, res) {
  const { project_id, table, name, columns, type } = req.body;
  
  if (!project_id || !table || !name || !columns) {
    return res.status(400).json({ success: false, message: "Campos obrigatórios faltando" });
  }

  const indexData = {
    name,
    columns: Array.isArray(columns) ? columns : columns.split(',').map(c => c.trim()),
    type: type || "INDEX"
  };

  try {
    await goSchemaService.addIndex(project_id, table, indexData);
    res.redirect(`/admin/tables/details?project_id=${project_id}&table=${table}`);
  } catch (err) {
    console.error("Erro ao adicionar índice:", err.message);
    res.status(500).json({ success: false, message: "Erro ao adicionar índice" });
  }
}

export async function dropIndex(req, res) {
  const { project_id, table, index } = req.body;
  
  if (!project_id || !table || !index) {
    return res.status(400).json({ success: false, message: "Campos obrigatórios faltando" });
  }

  try {
    await goSchemaService.dropIndex(project_id, table, index);
    res.redirect(`/admin/tables/details?project_id=${project_id}&table=${table}`);
  } catch (err) {
    console.error("Erro ao remover índice:", err.message);
    res.status(500).json({ success: false, message: "Erro ao remover índice" });
  }
}