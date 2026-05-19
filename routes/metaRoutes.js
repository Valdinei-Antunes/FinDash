const express = require("express");
const router = express.Router();
const MetaController = require("../src/controllers/MetaController");

// US-010: Acompanhar metas financeiras
router.post("/", MetaController.criar);
router.get("/", MetaController.listar);
router.get("/:id", MetaController.buscarPorId);
router.put("/:id", MetaController.atualizar);
router.delete("/:id", MetaController.excluir);

// Atualizar valor atual da meta (progresso)
router.patch("/:id/progresso", MetaController.atualizarProgresso);

module.exports = router;
