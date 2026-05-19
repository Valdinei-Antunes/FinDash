const db = require("../../db");

class DespesaController {

  // US-014: Registrar saída financeira
  // Fluxo: cria transação + despesa vinculada + atualiza saldo da conta
  criar(req, res) {
    const { valor, data, descricao, conta_id, previsto, parcelado, categoria } = req.body;

    if (!valor || !data || !conta_id) {
      return res.status(400).json({ erro: "Campos obrigatórios: valor, data, conta_id" });
    }

    // 1. Insere a transação
    const sqlTransacao = "INSERT INTO transacao (valor, data, descricao, conta_id) VALUES (?, ?, ?, ?)";
    db.query(sqlTransacao, [valor, data, descricao, conta_id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });

      const transacao_id = result.insertId;

      // 2. Insere a despesa vinculada
      const sqlDespesa = "INSERT INTO despesa (previsto, parcelado, categoria, transacao_id) VALUES (?, ?, ?, ?)";
      db.query(sqlDespesa, [previsto || valor, parcelado || false, categoria, transacao_id], (err2) => {
        if (err2) return res.status(400).json({ erro: err2 });

        // 3. Atualiza o saldo da conta (regra de negócio: despesa diminui saldo)
        const sqlSaldo = "UPDATE conta SET saldo = saldo - ? WHERE id = ?";
        db.query(sqlSaldo, [valor, conta_id], (err3) => {
          if (err3) return res.status(500).json({ erro: err3 });
          return res.status(201).json({ mensagem: "Despesa registrada com sucesso", transacao_id });
        });
      });
    });
  }

  listar(req, res) {
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    const sql = `
      SELECT d.*, t.valor, t.data, t.descricao, t.conta_id
      FROM despesa d
      JOIN transacao t ON d.transacao_id = t.id
      JOIN conta c ON t.conta_id = c.id
      WHERE c.usuario_id = ?
      ORDER BY t.data DESC
    `;
    db.query(sql, [usuario_id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      return res.json(results);
    });
  }

  buscarPorId(req, res) {
    const { id } = req.params;
    const sql = `
      SELECT d.*, t.valor, t.data, t.descricao, t.conta_id
      FROM despesa d
      JOIN transacao t ON d.transacao_id = t.id
      WHERE d.id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Despesa não encontrada" });
      return res.json(results[0]);
    });
  }

  atualizar(req, res) {
    const { id } = req.params;
    const { previsto, parcelado, categoria } = req.body;

    const sql = "UPDATE despesa SET previsto = ?, parcelado = ?, categoria = ? WHERE id = ?";
    db.query(sql, [previsto, parcelado, categoria, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Despesa não encontrada" });
      return res.json({ mensagem: "Despesa atualizada com sucesso" });
    });
  }

  excluir(req, res) {
    const { id } = req.params;
    const sqlBusca = `
      SELECT d.transacao_id, t.valor, t.conta_id
      FROM despesa d JOIN transacao t ON d.transacao_id = t.id
      WHERE d.id = ?
    `;
    db.query(sqlBusca, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Despesa não encontrada" });

      const { transacao_id, valor, conta_id } = results[0];

      db.query("DELETE FROM despesa WHERE id = ?", [id], (err2) => {
        if (err2) return res.status(400).json({ erro: err2 });

        db.query("DELETE FROM transacao WHERE id = ?", [transacao_id], (err3) => {
          if (err3) return res.status(400).json({ erro: err3 });

          // Reverte o saldo
          db.query("UPDATE conta SET saldo = saldo + ? WHERE id = ?", [valor, conta_id], (err4) => {
            if (err4) return res.status(500).json({ erro: err4 });
            return res.json({ mensagem: "Despesa excluída com sucesso" });
          });
        });
      });
    });
  }
}

module.exports = new DespesaController();
