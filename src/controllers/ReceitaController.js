const db = require("../../db");

class ReceitaController {

  criar(req, res) {
    const { valor, data, descricao, conta_id, categoria, previsto, recorrente } = req.body;

    if (!valor || !data || !conta_id) {
      return res.status(400).json({ erro: "Campos obrigatórios: valor, data, conta_id" });
    }

    const sqlTransacao = "INSERT INTO transacao (valor, data, descricao, conta_id) VALUES (?, ?, ?, ?)";
    db.query(sqlTransacao, [valor, data, descricao, conta_id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });

      const transacao_id = result.insertId;

    
      const sqlReceita = "INSERT INTO receita (categoria, previsto, recorrente, transacao_id) VALUES (?, ?, ?, ?)";
      db.query(sqlReceita, [categoria, previsto || valor, recorrente || false, transacao_id], (err2) => {
        if (err2) return res.status(400).json({ erro: err2 });

       
        const sqlSaldo = "UPDATE conta SET saldo = saldo + ? WHERE id = ?";
        db.query(sqlSaldo, [valor, conta_id], (err3) => {
          if (err3) return res.status(500).json({ erro: err3 });
          return res.status(201).json({ mensagem: "Receita cadastrada com sucesso", transacao_id });
        });
      });
    });
  }

  listar(req, res) {
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    const sql = `
      SELECT r.*, t.valor, t.data, t.descricao, t.conta_id
      FROM receita r
      JOIN transacao t ON r.transacao_id = t.id
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
      SELECT r.*, t.valor, t.data, t.descricao, t.conta_id
      FROM receita r
      JOIN transacao t ON r.transacao_id = t.id
      WHERE r.id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Receita não encontrada" });
      return res.json(results[0]);
    });
  }

  atualizar(req, res) {
    const { id } = req.params;
    const { categoria, previsto, recorrente } = req.body;

    const sql = "UPDATE receita SET categoria = ?, previsto = ?, recorrente = ? WHERE id = ?";
    db.query(sql, [categoria, previsto, recorrente, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Receita não encontrada" });
      return res.json({ mensagem: "Receita atualizada com sucesso" });
    });
  }

  excluir(req, res) {
    const { id } = req.params;
  
    const sqlBusca = `
      SELECT r.transacao_id, t.valor, t.conta_id
      FROM receita r JOIN transacao t ON r.transacao_id = t.id
      WHERE r.id = ?
    `;
    db.query(sqlBusca, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Receita não encontrada" });

      const { transacao_id, valor, conta_id } = results[0];

      db.query("DELETE FROM receita WHERE id = ?", [id], (err2) => {
        if (err2) return res.status(400).json({ erro: err2 });

        db.query("DELETE FROM transacao WHERE id = ?", [transacao_id], (err3) => {
          if (err3) return res.status(400).json({ erro: err3 });

          // Reverte o saldo
          db.query("UPDATE conta SET saldo = saldo - ? WHERE id = ?", [valor, conta_id], (err4) => {
            if (err4) return res.status(500).json({ erro: err4 });
            return res.json({ mensagem: "Receita excluída com sucesso" });
          });
        });
      });
    });
  }
}

module.exports = new ReceitaController();
