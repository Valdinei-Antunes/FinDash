const express = require("express");
const router = express.Router();
const VencimentoController = require("../src/controllers/VencimentoController");

// US-007: Cadastrar vencimento
router.post("/", VencimentoController.criar);

// US-009: Visualizar resumo de contas a pagar
router.get("/", VencimentoController.listar);

router.get("/:id", VencimentoController.buscarPorId);

// US-008: Marcar conta como paga ou pendente
router.patch("/:id/status", VencimentoController.atualizarStatus);

router.put("/:id", VencimentoController.atualizar);
router.delete("/:id", VencimentoController.excluir);

module.exports = router;
