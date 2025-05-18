var quadraModel = require("../models/quadraModel");

function cadastrar(req, res) {
    const foto = req.file.filename;
    const { nome, localizacao, descricao } = req.body;
    const quadra = { nome, localizacao, foto, descricao };

    quadraModel.cadastrar(quadra).then(resposta => {
        if(resposta.affectedRows == 1) {
            res.status(200).send("Quadra cadastrada")
        } else {
            res.status(401).send("Erro ao inserir quadra")
        }
        console.log(resposta);
    })
    .catch(erro => {
        res.status(401).json({"Erro": erro});
    })

}

function buscar(req, res) {
    quadraModel.buscar().then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta)
        } else {
            res.status(401).send("Nenhuma quadra cadastrada")
        }
    })
}

module.exports = {
    cadastrar,
    buscar
}