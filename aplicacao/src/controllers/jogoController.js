var jogoModel = require("../models/jogoModel");


function buscar(req,res) {
    jogoModel.buscar().then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta);
        }
    })
}

function cadastrarJogo(req,res) {
    const jogo = req.body;

    jogoModel.verificarDisponibilidadeJogo(jogo).then(resposta => {
        if(resposta.length == 0) {
            jogoModel.cadastrarJogo(jogo).then(resposta => {
                res.status(200).json(resposta);
            })
            .catch(erro => {
                res.status(401).json(erro);
            })
        } else {
            res.status(401).send("Este horário já está em uso.")
        }
    })
}

module.exports = {
    cadastrarJogo,
    buscar
}