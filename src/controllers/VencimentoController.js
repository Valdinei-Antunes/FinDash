const db = require("../../db");

class VencimentoController {

  // US-007: Cadastrar vencimento
  criar(req, res) {
    const { descricao, valor, dataVencimento } = req.body;
    const usuario_id = req.session.usuarioId;

    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });
    if (!descricao || !valor || !dataVencimento) {
      return res.status(400).json({ erro: "Campos obrigatórios: descricao, valor, dataVencimento" });
    }

    const sql = "INSERT INTO vencimento (descricao, valor, dataVencimento, status, usuario_id) VALUES (?, ?, ?, 'pendente', ?)";
    db.query(sql, [descricao, valor, dataVencimento, usuario_id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      return res.status(201).json({ mensagem: "Vencimento cadastrado com sucesso", id: result.insertId });
    });
  }

  // US-009: Visualizar resumo de contas a pagar
  listar(req, res) {
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    const { status } = req.query;

    let sql = "SELECT * FROM vencimento WHERE usuario_id = ?";
    const params = [usuario_id];

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    sql += " ORDER BY dataVencimento ASC";

    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      return res.json(results);
    });
  }

  buscarPorId(req, res) {
    const { id } = req.params;
    const sql = "SELECT * FROM vencimento WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Vencimento não encontrado" });
      return res.json(results[0]);
    });
  }

  // US-008: Marcar conta como paga ou pendente
  atualizarStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pago", "pendente"].includes(status)) {
      return res.status(400).json({ erro: "Status deve ser 'pago' ou 'pendente'" });
    }

    const sql = "UPDATE vencimento SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Vencimento não encontrado" });
      return res.json({ mensagem: `Vencimento marcado como ${status}` });
    });
  }

  atualizar(req, res) {
    const { id } = req.params;
    const { descricao, valor, dataVencimento, status } = req.body;

    const sql = "UPDATE vencimento SET descricao = ?, valor = ?, dataVencimento = ?, status = ? WHERE id = ?";
    db.query(sql, [descricao, valor, dataVencimento, status, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Vencimento não encontrado" });
      return res.json({ mensagem: "Vencimento atualizado com sucesso" });
    });
  }

  excluir(req, res) {
    const { id } = req.params;
    const sql = "DELETE FROM vencimento WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Vencimento não encontrado" });
      return res.json({ mensagem: "Vencimento excluído com sucesso" });
    });
  }
}

module.exports = new VencimentoController();
