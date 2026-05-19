const express = require("express");
const router = express.Router();
const AuthController = require("../src/controllers/AuthController");
const db = require("../db");

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

// Retorna dados do usuário logado (usado pelas páginas do frontend)
router.get("/me", (req, res) => {
  if (!req.session.usuarioId) {
    return res.status(401).json({ mensagem: "Não autenticado" });
  }

  const sql = "SELECT id, nome, email FROM usuarios WHERE id = ?";
  db.query(sql, [req.session.usuarioId], (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    if (results.length === 0) return res.status(404).json({ mensagem: "Usuário não encontrado" });

    const usuario = results[0];
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });
  });
});

module.exports = router;
