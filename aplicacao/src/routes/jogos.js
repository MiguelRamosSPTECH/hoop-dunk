var express = require("express");
var router = express.Router();

var jogoController = require("../controllers/jogoController");

router.post("/cadastrar", (req,res) => {
    jogoController.cadastrarJogo(req,res);
})

router.get("/buscar", (req,res) => {
    jogoController.buscar(req,res);
})

router.get("/:id/:idUsuario/detalhesJogo", (req,res) => {
    jogoController.verDetalhesJogo(req,res);
})

router.post("/:idJogador/participarJogo", (req,res) => {
    jogoController.participarJogo(req,res)
})
router.get("/:idJogo/:idQuadra/verJogoAgora", (req,res) => {
    jogoController.verificarJogoAgora(req,res);
})

router.get("/:id/buscarPorId", (req,res) => {
    jogoController.buscarPorId(req,res);
})
router.put('/editJogo', (req,res) => {
    jogoController.updateJogo(req,res);
})

module.exports = router;