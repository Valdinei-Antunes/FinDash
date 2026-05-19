const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "findash",
    port: 3306
});

db.connect((err) => {
    if (err) throw err;
    console.log("Conexão com o banco findash bem-sucedida!");
});

module.exports = db;
