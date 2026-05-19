const express = require("express");
const router = express.Router();
const DespesaController = require("../src/controllers/DespesaController");

router.post("/", DespesaController.criar);
router.get("/", DespesaController.listar);
router.get("/:id", DespesaController.buscarPorId);
router.put("/:id", DespesaController.atualizar);
router.delete("/:id", DespesaController.excluir);

module.exports = router;
