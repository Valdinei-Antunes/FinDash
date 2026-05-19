const express = require("express");
const router = express.Router();
const ReceitaController = require("../src/controllers/ReceitaController");

// US-013: Cadastrar receita
router.post("/", ReceitaController.criar);
router.get("/", ReceitaController.listar);
router.get("/:id", ReceitaController.buscarPorId);
router.put("/:id", ReceitaController.atualizar);
router.delete("/:id", ReceitaController.excluir);

module.exports = router;
