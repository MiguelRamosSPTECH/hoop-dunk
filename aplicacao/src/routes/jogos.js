var express = require("express");
var router = express.Router();

var jogoController = require("../controllers/jogoController");

router.post("/cadastrar", (req,res) => {
    jogoController.cadastrarJogo(req,res);
})

router.get("/buscar", (req,res) => {
    jogoController.buscar(req,res);
})

module.exports = router;