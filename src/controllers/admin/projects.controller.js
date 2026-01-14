import goProjectsService from "../../services/goProjects.service.js";

/* ====================================================
   RENDER + API CONTROLLER PARA PROJETOS E INSTÂNCIAS
   ==================================================== */

/* =========================
   PROJETOS
========================= */

// Renderiza a lista de projetos (template Handlebars)
export async function renderListProjects(req, res) {
  try {
    const projects = await goProjectsService.listProjects();
    res.render("admin/projects/list", { projects });
  } catch (err) {
    console.error("Erro ao listar projetos:", err.message);
    res.render("admin/projects/list", { projects: [], error: "Erro ao carregar projetos" });
  }
}

// Renderiza formulário de criação de projeto
export async function renderCreateProject(req, res) {
  res.render("admin/projects/create", { 
    title: "Criar Novo Projeto" // passado direto pro layout
  });
}


// Renderiza formulário de edição de projeto
export async function renderEditProject(req, res) {
  try {
    const id = req.params.id;
    const projects = await goProjectsService.listProjects();
    const project = projects.find(p => p.id == id);
    if (!project) {
      req.flash("error", "Projeto não encontrado");
      return res.redirect("/admin/projects");
    }
    res.render("admin/projects/edit", { project });
  } catch (err) {
    console.error("Erro ao carregar projeto:", err.message);
    res.redirect("/admin/projects");
  }
}

// API: Lista todos os projetos (JSON)
export async function listProjects(req, res) {
  try {
    const projects = await goProjectsService.listProjects();
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error("Erro ao listar projetos:", err.message);
    res.status(500).json({ success: false, message: "Erro ao listar projetos" });
  }
}

// API: Cria um projeto via formulário HTML
export async function createProject(req, res) {
  try {
    const projectData = req.body;

    const result = await goProjectsService.createProject(projectData);

    // Redireciona para a lista de projetos com mensagem de sucesso
    req.flash("success", "Projeto criado com sucesso!");
    res.redirect("/admin/projects");

  } catch (err) {
    console.error("Erro ao criar projeto:", err.message);

    // Redireciona de volta para o formulário com mensagem de erro
    req.flash("error", "Erro ao criar projeto. Tente novamente.");
    res.redirect("/admin/projects/create");
  }
}


// API: Atualiza um projeto
// Renderiza resposta do formulário de edição
export async function updateProject(req, res) {
  try {
    const id = req.params.id;
    const projectData = req.body;

    // Chama o serviço para atualizar
    const result = await goProjectsService.updateProject(id, projectData);

    // Busca o projeto atualizado pra renderizar novamente o formulário
    const projects = await goProjectsService.listProjects();
    const project = projects.find(p => p.id == id);

    if (!project) {
      // Se não encontrou, volta para lista de projetos
      req.flash("error", "Projeto não encontrado após atualização");
      return res.redirect("/admin/projects");
    }

    // Renderiza novamente o formulário com mensagem de sucesso
    res.render("admin/projects/edit", {
      project,
      success: "Projeto atualizado com sucesso!"
    });
  } catch (err) {
    console.error("Erro ao atualizar projeto:", err.message);

    // Tenta renderizar o formulário com mensagem de erro
    const projects = await goProjectsService.listProjects();
    const project = projects.find(p => p.id == req.params.id);

    res.render("admin/projects/edit", {
      project,
      error: "Erro ao atualizar projeto. Tente novamente."
    });
  }
}


// API: Deleta um projeto
export async function deleteProject(req, res) {
  try {
    const id = req.params.id;
    const result = await goProjectsService.deleteProject(id);
    res.json({ success: true, data: result, message: "Projeto deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar projeto:", err.message);
    res.status(500).json({ success: false, message: "Erro ao deletar projeto" });
  }
}

/* =========================
   INSTÂNCIAS
========================= */

// Renderiza a lista de instâncias de um projeto
export async function renderInstances(req, res) {
  const projectId = req.params.projectId;
  console.log('projectId na URL:', projectId);
  const projects = await goProjectsService.listProjects();
  const project = projects.find(p => p.id == projectId);

  if (!project) {
    return res.redirect("/admin/projects");
  }

  const instances = await goProjectsService.listInstances(projectId) || [];
  console.log('Projeto encontrado:', project);

  res.render("admin/projects/instances", {
    project,
    instances
  });
}


// Renderiza formulário de criação de instância
export async function renderCreateInstance(req, res) {
  try {
    const projectId = req.params.projectId;

    // Busca o projeto pelo ID
    const project = (await goProjectsService.listProjects()).find(p => p.id == projectId);

    if (!project) {
      req.flash("error", "Projeto não encontrado");
      return res.redirect("/admin/projects");
    }

    // Renderiza o template simplificado
    res.render("admin/projects/create-instance", {
      project,
      title: `Criar Instância para ${project.name}` // opcional, se seu layout usar
    });

  } catch (err) {
    console.error("Erro ao renderizar criação de instância:", err.message);
    res.redirect("/admin/projects");
  }
}


// API: Lista todas as instâncias de um projeto
export async function listInstances(req, res) {
  try {
    const projectId = req.query.project_id;
    if (!projectId) {
      return res.status(400).json({ success: false, message: "project_id é obrigatório" });
    }
    const instances = await goProjectsService.listInstances(projectId);
    res.json({ success: true, data: instances });
  } catch (err) {
    console.error("Erro ao listar instâncias:", err.message);
    res.status(500).json({ success: false, message: "Erro ao listar instâncias" });
  }
}

// API: Cria uma nova instância
export async function createInstance(req, res) {
  try {
    const projectId = req.params.projectId;

    const instanceData = {
      project_id: Number(projectId), // 🔴 Go espera número
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      status: req.body.status,
      settings: {} // opcional
    };

    await goProjectsService.createInstance(instanceData);

    res.redirect(`/admin/projects/${projectId}/instances`);
  } catch (err) {
    console.error("Erro ao criar instância:", err.response?.data || err.message);

    const projects = await goProjectsService.listProjects();
    const project = projects.find(p => p.id == req.params.id);

    res.render("admin/projects/create-instance", {
      project,
      error: "Erro ao criar instância"
    });
  }
}


// API: Atualiza uma instância
export async function updateInstance(req, res) {
  try {
    const projectId = req.params.projectId;  // ID do projeto
    const instanceId = req.params.instanceId;  // ID da instância
    const data = {
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      status: req.body.status,
      settings: req.body.settings || {}
    };

    // Chama o serviço para atualizar a instância
    await goProjectsService.updateInstance(instanceId, data);

    // Após atualizar, redireciona para a página de instâncias do projeto
    res.redirect(`/admin/projects/${projectId}/instances`);
  } catch (err) {
    console.error("Erro ao atualizar instância:", err.response?.data || err.message);
    // Em caso de erro, redireciona para a página de edição da instância
    res.redirect(`/admin/projects/${req.params.projectId}/instances/${req.params.instanceId}/edit`);
  }
}


// API: Deleta uma instância
// API: Deleta uma instância
export async function deleteInstance(req, res) {
  try {
    const projectId = req.params.projectId;  // Captura o ID do projeto
    const instanceId = req.params.instanceId;  // Captura o ID da instância

    // Chama o serviço para deletar a instância
    await goProjectsService.deleteInstance(instanceId);

    // Redireciona para a lista de instâncias do projeto após a exclusão
    res.redirect(`/admin/projects/${projectId}/instances`);
  } catch (err) {
    console.error("Erro ao deletar instância:", err.response?.data || err.message);
    // Em caso de erro, redireciona para a página de instâncias do projeto
    res.redirect(`/admin/projects/${req.params.projectId}/instances`);
  }
}


// Renderiza formulário de edição de instância
export async function renderEditInstance(req, res) {
  try {
    const { projectId, instanceId } = req.params;

    // Busca o projeto
    const project = (await goProjectsService.listProjects()).find(p => p.id == projectId);
    if (!project) {
      req.flash("error", "Projeto não encontrado");
      return res.redirect("/admin/projects");
    }

    // Busca a instância
    const instances = await goProjectsService.listInstances(projectId);
    const instance = instances.find(i => i.id == instanceId);


    if (!instance) {
      req.flash("error", "Instância não encontrada");
      return res.redirect(`/admin/projects/${projectId}/instances`);
    }

    // Renderiza o template de edição
    res.render("admin/projects/edit-instance", { project, instance });

  } catch (err) {
    console.error("Erro ao renderizar edição da instância:", err.message);
    res.redirect(`/admin/projects/${req.params.projectId}/instances`);
  }
}
