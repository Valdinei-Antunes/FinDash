const express = require("express");
const router = express.Router();
const DashboardController = require("../src/controllers/DashboardController");

// US-001: Visualizar painel financeiro
// Retorna saldo total, total de receitas, total de despesas e vencimentos próximos
router.get("/resumo", DashboardController.resumo);

// US-012: Exportar informações financeiras
router.get("/exportar", DashboardController.exportar);

module.exports = router;
