const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  credentials: true
}));

app.use(session({
  secret: "findash_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: "lax"  // ← dentro do cookie, não fora
  }
}));

// Rotas
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const usuarioRoutes = require("./routes/usuarioRoutes");
app.use("/api/usuarios", usuarioRoutes);

const contaRoutes = require("./routes/contaRoutes");
app.use("/api/contas", contaRoutes);

const transacaoRoutes = require("./routes/transacaoRoutes");
app.use("/api/transacoes", transacaoRoutes);

const receitaRoutes = require("./routes/receitaRoutes");
app.use("/api/receitas", receitaRoutes);

const despesaRoutes = require("./routes/despesaRoutes");
app.use("/api/despesas", despesaRoutes);

const vencimentoRoutes = require("./routes/vencimentoRoutes");
app.use("/api/vencimentos", vencimentoRoutes);

const metaRoutes = require("./routes/metaRoutes");
app.use("/api/metas", metaRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

app.use(express.static(path.join(__dirname, "../FinDash")));

app.listen(port, () => {
  console.log(`Servidor FinDash rodando na porta ${port}`);
});

module.exports = app;
