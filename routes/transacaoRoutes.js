const express = require("express");
const router = express.Router();
const TransacaoController = require("../src/controllers/TransacaoController");


router.post("/", TransacaoController.registrar);


router.get("/", TransacaoController.listar);

router.get("/:id", TransacaoController.buscarPorId);
router.put("/:id", TransacaoController.atualizar);
router.delete("/:id", TransacaoController.excluir);

router.get("/relatorio/previsto-realizado", TransacaoController.previstoRealizado);

module.exports = router;
