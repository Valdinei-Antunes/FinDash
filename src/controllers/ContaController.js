const db = require("../../db");

class ContaController {

  // US-002: Cadastrar conta/carteira
  criar(req, res) {
    const { nome, tipo, saldo } = req.body;
    const usuario_id = req.session.usuarioId;

    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    const sql = "INSERT INTO conta (nome, tipo, saldo, usuario_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [nome, tipo, saldo || 0, usuario_id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      return res.status(201).json({ mensagem: "Conta cadastrada com sucesso", id: result.insertId });
    });
  }

  // US-003: Listar contas cadastradas
  listar(req, res) {
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    const sql = "SELECT * FROM conta WHERE usuario_id = ?";
    db.query(sql, [usuario_id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      return res.json(results);
    });
  }

  buscarPorId(req, res) {
    const { id } = req.params;
    const sql = "SELECT * FROM conta WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Conta não encontrada" });
      return res.json(results[0]);
    });
  }

  atualizar(req, res) {
    const { id } = req.params;
    const { nome, tipo, saldo } = req.body;

    const sql = "UPDATE conta SET nome = ?, tipo = ?, saldo = ? WHERE id = ?";
    db.query(sql, [nome, tipo, saldo, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Conta não encontrada" });
      return res.json({ mensagem: "Conta atualizada com sucesso" });
    });
  }

  excluir(req, res) {
    const { id } = req.params;
    const sql = "DELETE FROM conta WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Conta não encontrada" });
      return res.json({ mensagem: "Conta excluída com sucesso" });
    });
  }
}

module.exports = new ContaController();
