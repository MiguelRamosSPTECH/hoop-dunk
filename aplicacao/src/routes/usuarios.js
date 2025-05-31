var express = require("express");
var upload = require("../config/configUpload")
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.put("/:id/atualizar", upload.single('foto'), function(req,res) {
    usuarioController.atualizar(req,res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/:id/nao-seguidores", function(req,res) {
    usuarioController.sugestoesNaoSeguidores(req,res);
})
router.get("/:idSeguidor/:idSeguido/buscarPeloId", function(req,res) {
    usuarioController.buscarPeloid(req,res);
})

router.post('/:idSeguidor/:idSeguido/:tipoAcao/seguir', function(req,res) {
    usuarioController.seguirJogador(req,res)
})

router.get('/:idUsuario/:tipoAcao/listarSeguidores', function(req,res) {
    usuarioController.listarSeguidores(req,res);
})

// explorar

router.get("/:busca/:tipoBusca/explorar", (req,res) => {
    usuarioController.explorar(req,res);
})

module.exports = router;