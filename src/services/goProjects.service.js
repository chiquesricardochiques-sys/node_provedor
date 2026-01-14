// services/goProjects.service.js

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Base URL do Go (servidor interno)
const GO_BASE_URL = process.env.GO_API_URL || "http://localhost:8080";

// Token interno (obrigatório)
const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN;

/**
 * Configuração padrão para requisições ao Go
 */
const axiosInstance = axios.create({
  baseURL: GO_BASE_URL,
  headers: {
    "X-Internal-Token": INTERNAL_TOKEN,
    "Content-Type": "application/json",
  },
});

/* ====================================================
   ROTAS DE PROJETOS
   ==================================================== */

/**
 * Lista todos os projetos
 */
async function listProjects() {
  const response = await axiosInstance.get("/projects");

  // Supondo que o Go retorne { success: true, data: [...] }
  if (response.data && response.data.data) {
    return response.data.data; // retorna só o array
  }

  // fallback caso seja apenas um array simples
  return response.data || [];
}


/**
 * Cria um novo projeto
 */
async function createProject(projectData) {
  const response = await axiosInstance.post("/projects", projectData);
  return response.data;
}

/**
 * Atualiza um projeto existente
 */
async function updateProject(id, projectData) {
  const response = await axiosInstance.put(`/projects/${id}`, projectData);
  return response.data;
}

/**
 * Deleta um projeto
 */
async function deleteProject(id) {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
}

/* ====================================================
   ROTAS DE INSTÂNCIAS
   ==================================================== */

async function listInstances(projectId) {
  const response = await axiosInstance.get(`/instances`, {
    params: { project_id: projectId },
  });
  return response.data;
}

async function createInstance(instanceData) {
  const response = await axiosInstance.post("/instances", instanceData);
  return response.data;
}

async function updateInstance(id, instanceData) {
  const response = await axiosInstance.put(`/instances/${id}`, instanceData);
  return response.data;
}

async function deleteInstance(id) {
  const response = await axiosInstance.delete(`/instances/${id}`);
  return response.data;
}

/**
 * EXPORT ESM (equivalente ao module.exports)
 */
export default {
  // Projetos
  listProjects,
  createProject,
  updateProject,
  deleteProject,

  // Instâncias
  listInstances,
  createInstance,
  updateInstance,
  deleteInstance,
};
