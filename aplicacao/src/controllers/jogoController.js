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
                if(resposta.affectedRows == 1) {
                    jogoModel.participarJogo(jogo.idUsuario, 'criador').then(resposta => {
                        if(resposta.affectedRows == 1) {
                            res.status(200).send(resposta);
                        }
                    })
                }
            })
            .catch(erro => {
                res.status(401).json(erro);
            })
        } else {
            res.status(401).send("Este horário já está em uso.")
        }
    })
}

function verDetalhesJogo(req,res) {
    const idJogo = req.params.id
    jogoModel.detalhesJogo(idJogo).then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta);
        }
    })
}

function participarJogo(req,res) {
    const idUsuario = req.params.idJogador;
    const { acaoJogador, idJogo } = req.body;
    jogoModel.participarJogo(idUsuario, 'jogador', acaoJogador, idJogo).then(resposta => {
        res.status(200).send("AÇÃO REALIZADA");
    }).catch(erro => {
        res.status(401).json({mensagem: erro})
    })
}

function verificarJogoAgora(req,res) {
    const {idJogo, idQuadra} = req.params;
    jogoModel.verificarJogoAgora(idJogo, idQuadra).then(resposta => {
        res.status(200).json(resposta);
    })
}

module.exports = {
    cadastrarJogo,
    buscar,
    verDetalhesJogo,
    participarJogo,
    verificarJogoAgora
}