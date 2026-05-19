const express = require("express");
const router = express.Router();
const DashboardController = require("../src/controllers/DashboardController");


router.get("/resumo", DashboardController.resumo);


router.get("/exportar", DashboardController.exportar);

module.exports = router;
