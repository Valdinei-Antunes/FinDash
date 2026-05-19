const db = require("../../db");

class TransacaoController {

  
  registrar(req, res) {
    const { valor, data, descricao, conta_id } = req.body;

    if (!valor || !data || !conta_id) {
      return res.status(400).json({ erro: "Campos obrigatórios: valor, data, conta_id" });
    }

    const sql = "INSERT INTO transacao (valor, data, descricao, conta_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [valor, data, descricao, conta_id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      return res.status(201).json({ mensagem: "Transação registrada com sucesso", id: result.insertId });
    });
  }

  listar(req, res) {
    const { tipo, dataInicio, dataFim, conta_id } = req.query;
    const usuario_id = req.session.usuarioId;

    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    let sql = `
      SELECT t.*, c.nome AS nome_conta
      FROM transacao t
      JOIN conta c ON t.conta_id = c.id
      WHERE c.usuario_id = ?
    `;
    const params = [usuario_id];

    if (conta_id) {
      sql += " AND t.conta_id = ?";
      params.push(conta_id);
    }

   
    if (tipo === "receita") {
      sql += " AND EXISTS (SELECT 1 FROM receita r WHERE r.transacao_id = t.id)";
    } else if (tipo === "despesa") {
      sql += " AND EXISTS (SELECT 1 FROM despesa d WHERE d.transacao_id = t.id)";
    }

    if (dataInicio) {
      sql += " AND t.data >= ?";
      params.push(dataInicio);
    }

    if (dataFim) {
      sql += " AND t.data <= ?";
      params.push(dataFim);
    }

    sql += " ORDER BY t.data DESC";

    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      return res.json(results);
    });
  }

  buscarPorId(req, res) {
    const { id } = req.params;
    const sql = "SELECT * FROM transacao WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Transação não encontrada" });
      return res.json(results[0]);
    });
  }

  atualizar(req, res) {
    const { id } = req.params;
    const { valor, data, descricao, conta_id } = req.body;

    const sql = "UPDATE transacao SET valor = ?, data = ?, descricao = ?, conta_id = ? WHERE id = ?";
    db.query(sql, [valor, data, descricao, conta_id, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Transação não encontrada" });
      return res.json({ mensagem: "Transação atualizada com sucesso" });
    });
  }

  excluir(req, res) {
    const { id } = req.params;
    const sql = "DELETE FROM transacao WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Transação não encontrada" });
      return res.json({ mensagem: "Transação excluída com sucesso" });
    });
  }


  previstoRealizado(req, res) {
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    const sql = `
      SELECT
        SUM(CASE WHEN r.id IS NOT NULL THEN t.valor ELSE 0 END) AS total_receitas_realizadas,
        SUM(CASE WHEN r.id IS NOT NULL THEN r.previsto ELSE 0 END) AS total_receitas_previstas,
        SUM(CASE WHEN d.id IS NOT NULL THEN t.valor ELSE 0 END) AS total_despesas_realizadas,
        SUM(CASE WHEN d.id IS NOT NULL THEN d.previsto ELSE 0 END) AS total_despesas_previstas
      FROM transacao t
      JOIN conta c ON t.conta_id = c.id
      LEFT JOIN receita r ON r.transacao_id = t.id
      LEFT JOIN despesa d ON d.transacao_id = t.id
      WHERE c.usuario_id = ?
    `;

    db.query(sql, [usuario_id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      return res.json(results[0]);
    });
  }
}

module.exports = new TransacaoController();
