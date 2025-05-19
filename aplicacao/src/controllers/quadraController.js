var quadraModel = require("../models/quadraModel");

function cadastrar(req, res) {
    const idUsuario = req.params.id;
    const foto = req.file.filename;
    const { nome, localizacao, descricao } = req.body;
    const quadra = { nome, localizacao, foto, descricao };

    quadraModel.cadastrar(quadra, idUsuario).then(resposta => {
        if(resposta.affectedRows == 1) {
            res.status(200).send("Quadra cadastrada")
        } else {
            res.status(401).send("Erro ao inserir quadra")
        }
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

function buscarPeloId(req,res) {
    const id = req.params.id;
    quadraModel.buscaPeloId(id).then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta);
        } else {
            res.status(401).send("Nenhum resultado encontrado")
        }
    })
}
function usuarioParticipar(req,res) {
    const idUsuario = req.params.id;
    const idQuadra = req.params.idQuadra;
    quadraModel.participarQuadra(idUsuario, idQuadra).then(resposta => {
        if(resposta.affectedRows == 1) {
            res.status(200).send("AGORA VOCê É UM JOGADOR DA QUADRA.");
        }
    })

}

module.exports = {
    cadastrar,
    buscar,
    buscarPeloId,
    usuarioParticipar
}