const db = require("../../db");

class AuthController {

  login(req, res) {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(401).json({ mensagem: "Email não encontrado" });

      const usuario = results[0];

      // Comparação direta (sem criptografia por enquanto, igual ao alerta-cidadão)
      if (usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
      }

      req.session.usuarioId = usuario.id;

      return res.json({
        mensagem: "Login realizado com sucesso",
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      });
    });
  }

  logout(req, res) {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ mensagem: "Erro ao encerrar sessão" });
      return res.json({ mensagem: "Logout realizado com sucesso" });
    });
  }
}

module.exports = new AuthController();
