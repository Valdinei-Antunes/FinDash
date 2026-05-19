const db = require("../../db");

class UsuarioController {

  cadastrar(req, res) {
    const { nome, email, senha } = req.body;

    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senha], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso", id: result.insertId });
    });
  }

  buscarPorId(req, res) {
    const { id } = req.params;
    const sql = "SELECT id, nome, email FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Usuário não encontrado" });
      return res.json(results[0]);
    });
  }

  atualizar(req, res) {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const sql = "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?";
    db.query(sql, [nome, email, senha, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Usuário não encontrado" });
      return res.json({ mensagem: "Usuário atualizado com sucesso" });
    });
  }
}

module.exports = new UsuarioController();
