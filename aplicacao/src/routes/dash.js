var express = require("express");
var router = express.Router();

let dashController = require('../controllers/dashController');

router.get('/fluxoUsuarios/:filtro', (req,res) => {
    dashController.buscarFluxoUsuarios(req,res);
})

router.get('/dadosDash', (req,res) => {
    dashController.dadosUserDash(req,res);
})

router.get('/tipoJogadoresEvento', (req,res) => {
    dashController.tipoJogadoresEvento(req,res);
})
module.exports = router;