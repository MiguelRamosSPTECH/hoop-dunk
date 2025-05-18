var express = require("express");
var upload = require("../config/configUpload")
var router = express.Router();

var quadraController = require("../controllers/quadraController");

//Recebendo os dados do html e direcionando para a função cadastrar de quadraController.js
router.post("/cadastrar", upload.single('foto'), function (req, res) {
    quadraController.cadastrar(req, res);
})

router.get("/buscar", function(req,res) {
    quadraController.buscar(req, res);
})


module.exports = router;