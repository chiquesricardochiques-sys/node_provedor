import axios from "axios";

/*
====================================================
GO SERVICE
====================================================

Este arquivo é o CLIENTE OFICIAL do Node para o Go.

Responsabilidades:
- Falar com o Go Data Core
- Enviar headers obrigatórios
- Padronizar chamadas
- Tratar erros
- Centralizar comunicação

IMPORTANTE:
- Node NÃO acessa MySQL
- Node só conversa com o Go
====================================================
*/

// Instância base do axios para o Go
const goClient = axios.create({
  baseURL: process.env.GO_URL || "http://127.0.0.1:8080",
  timeout: 10000,
  headers: {
    "X-Internal-Token": process.env.INTERNAL_TOKEN,
    "Content-Type": "application/json"
  }
});

/*
----------------------------------------------------
FUNÇÃO BASE DE REQUEST
----------------------------------------------------
*/
async function goRequest({ url, method = "POST", apiKey, data }) {
  try {
    const response = await goClient.request({
      url,
      method,
      data,
      headers: {
        api_key: apiKey
      }
    });

    return response.data;
  } catch (err) {
    // Erro vindo do Go
    if (err.response) {
      return {
        status: "error",
        message: err.response.data || "Erro no Go"
      };
    }

    // Erro de conexão
    return {
      status: "error",
      message: "Não foi possível conectar ao Go"
    };
  }
}

/*
====================================================
CRUD GENÉRICO (ROTAS SIMPLES)
====================================================
*/

// INSERT
export function insert(apiKey, table, data) {
  return goRequest({
    url: "/insert",
    apiKey,
    data: {
      table,
      data
    }
  });
}

// GET ALL
export function getAll(apiKey, table) {
  return goRequest({
    url: "/get",
    apiKey,
    data: {
      table
    }
  });
}

// UPDATE
export function update(apiKey, table, data, query) {
  return goRequest({
    url: "/update",
    apiKey,
    data: {
      table,
      data,
      query
    }
  });
}

// DELETE
export function remove(apiKey, table, query) {
  return goRequest({
    url: "/delete",
    apiKey,
    data: {
      table,
      query
    }
  });
}

/*
====================================================
HANDLER UNIVERSAL (RECOMENDADO)
====================================================
*/

export function universal(apiKey, payload) {
  return goRequest({
    url: "/universal",
    apiKey,
    data: payload
  });
}

/*
====================================================
PROJETOS (MASTER DB)
====================================================
*/

// LISTAR PROJETOS
export function listProjects() {
  return goClient.get("/projects").then(r => r.data);
}

// CRIAR PROJETO
export function createProject(data) {
  return goClient.post("/projects", data).then(r => r.data);
}

// ATUALIZAR PROJETO
export function updateProject(id, data) {
  return goClient.put(`/projects/${id}`, data).then(r => r.data);
}

// DELETAR PROJETO
export function deleteProject(id) {
  return goClient.delete(`/projects/${id}`).then(r => r.data);
}

/*
====================================================
TABELAS
====================================================
*/

// CRIAR TABELA
export function createTable(projectId, data) {
  return goClient.post(`/projects/${projectId}/tables`, data).then(r => r.data);
}

// DELETAR TABELA
export function deleteTable(projectId, table) {
  return goClient.delete(`/projects/${projectId}/tables/${table}`).then(r => r.data);
}
