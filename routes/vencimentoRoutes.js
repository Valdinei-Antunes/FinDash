const express = require("express");
const router = express.Router();
const VencimentoController = require("../src/controllers/VencimentoController");

router.post("/", VencimentoController.criar);

router.get("/", VencimentoController.listar);

router.get("/:id", VencimentoController.buscarPorId);

router.patch("/:id/status", VencimentoController.atualizarStatus);

router.put("/:id", VencimentoController.atualizar);
router.delete("/:id", VencimentoController.excluir);

module.exports = router;
