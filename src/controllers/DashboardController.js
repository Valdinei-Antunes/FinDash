const db = require("../../db");

class DashboardController {

  // US-001: Visualizar painel financeiro
  resumo(req, res) {
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    // Saldo total de todas as contas
    const sqlSaldo = "SELECT COALESCE(SUM(saldo), 0) AS saldo_total FROM conta WHERE usuario_id = ?";

    // Total de receitas do mês atual
    const sqlReceitas = `
      SELECT COALESCE(SUM(t.valor), 0) AS total_receitas
      FROM transacao t
      JOIN conta c ON t.conta_id = c.id
      JOIN receita r ON r.transacao_id = t.id
      WHERE c.usuario_id = ?
        AND MONTH(t.data) = MONTH(CURDATE())
        AND YEAR(t.data) = YEAR(CURDATE())
    `;

    // Total de despesas do mês atual
    const sqlDespesas = `
      SELECT COALESCE(SUM(t.valor), 0) AS total_despesas
      FROM transacao t
      JOIN conta c ON t.conta_id = c.id
      JOIN despesa d ON d.transacao_id = t.id
      WHERE c.usuario_id = ?
        AND MONTH(t.data) = MONTH(CURDATE())
        AND YEAR(t.data) = YEAR(CURDATE())
    `;

    // Vencimentos pendentes nos próximos 30 dias
    const sqlVencimentos = `
      SELECT * FROM vencimento
      WHERE usuario_id = ?
        AND status = 'pendente'
        AND dataVencimento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY dataVencimento ASC
    `;

    db.query(sqlSaldo, [usuario_id], (err, r1) => {
      if (err) return res.status(500).json({ erro: err });

      db.query(sqlReceitas, [usuario_id], (err, r2) => {
        if (err) return res.status(500).json({ erro: err });

        db.query(sqlDespesas, [usuario_id], (err, r3) => {
          if (err) return res.status(500).json({ erro: err });

          db.query(sqlVencimentos, [usuario_id], (err, r4) => {
            if (err) return res.status(500).json({ erro: err });

            return res.json({
              saldo_total: r1[0].saldo_total,
              total_receitas_mes: r2[0].total_receitas,
              total_despesas_mes: r3[0].total_despesas,
              vencimentos_proximos: r4
            });
          });
        });
      });
    });
  }

  // US-012: Exportar informações financeiras (retorna JSON completo do usuário)
  exportar(req, res) {
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    const sqlContas = "SELECT * FROM conta WHERE usuario_id = ?";
    const sqlTransacoes = `
      SELECT t.*, 
        r.categoria AS receita_categoria, r.previsto AS receita_previsto,
        d.categoria AS despesa_categoria, d.previsto AS despesa_previsto
      FROM transacao t
      JOIN conta c ON t.conta_id = c.id
      LEFT JOIN receita r ON r.transacao_id = t.id
      LEFT JOIN despesa d ON d.transacao_id = t.id
      WHERE c.usuario_id = ?
      ORDER BY t.data DESC
    `;
    const sqlVencimentos = "SELECT * FROM vencimento WHERE usuario_id = ?";
    const sqlMetas = "SELECT * FROM meta WHERE usuario_id = ?";

    db.query(sqlContas, [usuario_id], (err, contas) => {
      if (err) return res.status(500).json({ erro: err });

      db.query(sqlTransacoes, [usuario_id], (err, transacoes) => {
        if (err) return res.status(500).json({ erro: err });

        db.query(sqlVencimentos, [usuario_id], (err, vencimentos) => {
          if (err) return res.status(500).json({ erro: err });

          db.query(sqlMetas, [usuario_id], (err, metas) => {
            if (err) return res.status(500).json({ erro: err });

            res.setHeader("Content-Disposition", "attachment; filename=findash-export.json");
            res.setHeader("Content-Type", "application/json");
            return res.json({ contas, transacoes, vencimentos, metas });
          });
        });
      });
    });
  }
}

module.exports = new DashboardController();
