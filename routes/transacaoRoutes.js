const express = require("express");
const router = express.Router();
const TransacaoController = require("../src/controllers/TransacaoController");

// US-004: Registrar transação financeira
router.post("/", TransacaoController.registrar);

// US-005: Visualizar histórico de transações
// US-006: Filtrar transações por tipo e período (?tipo=receita&dataInicio=&dataFim=)
router.get("/", TransacaoController.listar);

router.get("/:id", TransacaoController.buscarPorId);
router.put("/:id", TransacaoController.atualizar);
router.delete("/:id", TransacaoController.excluir);

// US-015: Controlar receitas e despesas (previsto x realizado)
router.get("/relatorio/previsto-realizado", TransacaoController.previstoRealizado);

module.exports = router;
