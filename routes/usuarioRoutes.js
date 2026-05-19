const express = require("express");
const router = express.Router();
const UsuarioController = require("../src/controllers/UsuarioController");

router.post("/", UsuarioController.cadastrar);
router.get("/:id", UsuarioController.buscarPorId);
router.put("/:id", UsuarioController.atualizar);

module.exports = router;
