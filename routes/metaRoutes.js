const express = require("express");
const router = express.Router();
const MetaController = require("../src/controllers/MetaController");


router.post("/", MetaController.criar);
router.get("/", MetaController.listar);
router.get("/:id", MetaController.buscarPorId);
router.put("/:id", MetaController.atualizar);
router.delete("/:id", MetaController.excluir);

router.patch("/:id/progresso", MetaController.atualizarProgresso);

module.exports = router;
