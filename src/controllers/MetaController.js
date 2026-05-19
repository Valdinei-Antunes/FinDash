const db = require("../../db");

class MetaController {

 
  criar(req, res) {
    const { nome, valorAlvo, valorAtual, prazo } = req.body;
    const usuario_id = req.session.usuarioId;

    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });
    if (!nome || !valorAlvo) {
      return res.status(400).json({ erro: "Campos obrigatórios: nome, valorAlvo" });
    }

    const sql = "INSERT INTO meta (nome, valorAlvo, valorAtual, prazo, usuario_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nome, valorAlvo, valorAtual || 0, prazo, usuario_id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      return res.status(201).json({ mensagem: "Meta criada com sucesso", id: result.insertId });
    });
  }

  listar(req, res) {
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) return res.status(401).json({ mensagem: "Não autenticado" });

    const sql = `
      SELECT *,
        ROUND((valorAtual / valorAlvo) * 100, 2) AS percentual
      FROM meta
      WHERE usuario_id = ?
      ORDER BY prazo ASC
    `;
    db.query(sql, [usuario_id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      return res.json(results);
    });
  }

  buscarPorId(req, res) {
    const { id } = req.params;
    const sql = `
      SELECT *, ROUND((valorAtual / valorAlvo) * 100, 2) AS percentual
      FROM meta WHERE id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ erro: err });
      if (results.length === 0) return res.status(404).json({ mensagem: "Meta não encontrada" });
      return res.json(results[0]);
    });
  }

  atualizar(req, res) {
    const { id } = req.params;
    const { nome, valorAlvo, valorAtual, prazo } = req.body;

    const sql = "UPDATE meta SET nome = ?, valorAlvo = ?, valorAtual = ?, prazo = ? WHERE id = ?";
    db.query(sql, [nome, valorAlvo, valorAtual, prazo, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Meta não encontrada" });
      return res.json({ mensagem: "Meta atualizada com sucesso" });
    });
  }


  atualizarProgresso(req, res) {
    const { id } = req.params;
    const { valorAtual } = req.body;

    const sql = "UPDATE meta SET valorAtual = ? WHERE id = ?";
    db.query(sql, [valorAtual, id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Meta não encontrada" });
      return res.json({ mensagem: "Progresso da meta atualizado" });
    });
  }

  excluir(req, res) {
    const { id } = req.params;
    const sql = "DELETE FROM meta WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(400).json({ erro: err });
      if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Meta não encontrada" });
      return res.json({ mensagem: "Meta excluída com sucesso" });
    });
  }
}

module.exports = new MetaController();
