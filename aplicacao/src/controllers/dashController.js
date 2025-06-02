var dashModel = require("../models/dashModel");

function buscarFluxoUsuarios(req,res) {
    let tipoFiltro = req.params.filtro;
    dashModel.buscarFluxoUsuarios(tipoFiltro).then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta);
        }
    })
}

//das kpi
function dadosUserDash(req,res) {
    dashModel.dadosUserDash().then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta);
        }
    })
}
function tipoJogadoresEvento(req,res) {
    dashModel.tipoJogadoresEvento().then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta)
        }
    })
}
module.exports = {
    buscarFluxoUsuarios,
    dadosUserDash,
    tipoJogadoresEvento
}