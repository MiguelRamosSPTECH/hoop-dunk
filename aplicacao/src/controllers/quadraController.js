var quadraModel = require("../models/quadraModel");

function cadastrar(req, res) {
    const idUsuario = req.params.id;
    const foto = req.file.filename;
    const { nome, localizacao, descricao } = req.body;
    const quadra = { nome, localizacao, foto, descricao };

    quadraModel.cadastrar(quadra, idUsuario).then(resposta => {
        if(resposta.affectedRows == 1) {
            quadraModel.participarQuadra(idUsuario, quadra, 'criador').then(resposta => {
                if(resposta.affectedRows == 1) {
                    res.status(200).send("Quadra criada com sucesso!")
                }
            })
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
    const idUsuario = req.params.idUsuario;
    const id = req.params.id;
    quadraModel.buscaPeloId(id, idUsuario).then(resposta => {
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
    const tipoAcao = req.params.tipoAcao;
    quadraModel.participarQuadra(idUsuario, idQuadra, 'jogador', tipoAcao).then(resposta => {
        if(resposta.affectedRows == 1) {
            quadraModel.atualizarNivelQuadra(idQuadra).then(resposta => {
                if(resposta.affectedRows == 1) {
                    res.status(200).send("ACAO CONFIRMADA");
                }
            })
        }
    })
}

module.exports = {
    cadastrar,
    buscar,
    buscarPeloId,
    usuarioParticipar
}