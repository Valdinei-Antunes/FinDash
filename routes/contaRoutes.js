const express = require("express");
const router = express.Router();
const ContaController = require("../src/controllers/ContaController");


router.post("/", ContaController.criar);


router.get("/", ContaController.listar);

router.get("/:id", ContaController.buscarPorId);
router.put("/:id", ContaController.atualizar);
router.delete("/:id", ContaController.excluir);

module.exports = router;
