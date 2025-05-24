var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var perfil = req.body.perfilJogador;
    var senha = req.body.senhaJogador;

    if (perfil== undefined) {
        res.status(400).send("Perfil não definido");
    } else if (senha == undefined) {
        res.status(400).send("Senha não definida");
    } else {

        usuarioModel.autenticar(perfil, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        res.status(200).json(resultadoAutenticar);
                    } else {
                        res.status(403).send("Perfil e/ou senha inválido(s)");
                    } 
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeJogador;
    var nomePerfil = req.body.perfilJogador
    var email = req.body.emailJogador;
    var senha = req.body.senhaJogador;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Campo nome não identificado!");
    } else if (nomePerfil == undefined) {
        res.status(400).send("Nome do perfil não foi identificado!")
    } else if (email == undefined) {
        res.status(400).send("Campo email não identificado!");
    } else if (senha == undefined) {
        res.status(400).send("Campo da senha não identificado!");
    }  else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, nomePerfil, email, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function sugestoesNaoSeguidores(req,res) {
    let idJogador = req.params.id;
    if(idJogador == null) {
        res.status(401).send("Id do usuário não identificado")
    } else {
        usuarioModel.naoSeguidores(idJogador)
        .then(resposta => {
            res.status(200).json(resposta)
        })
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
    }
}

function atualizar(req, res) {
    const id = req.params.id;
    const foto = req.file.filename //pegando a foto que vem como file.

    const { nome, nomePerfil, nivel, posicao, email, senha } = req.body;
    const usuario = { nome, nomePerfil, nivel, posicao, email, senha, foto};

    usuarioModel.atualizar(id, usuario).then(resposta => {
        if(resposta.affectedRows == 1) {
            usuarioModel.buscarUsuario(id, false).then(resposta => {
                if(resposta.length > 0) {
                    res.status(200).json(resposta);
                }
            })
        } else {
            res.status(401).send("Erro ao dar update")
        }
    })
    .catch(erro => {
        res.status(401).send("Deu erro")
    })
}

function buscarPeloid(req,res) {
    const { idSeguidor, idSeguido } = req.params;
    usuarioModel.buscarUsuario(idSeguidor, idSeguido).then(resposta => {
        if(idSeguido != "false"){
            resposta.push({
                mensagem: "proprioUsuario"
            }) //gambiarra
        }
        res.status(200).json(resposta);
    })
    .catch(erro => {
        res.status(401).send("Deu erro", erro);
    })
}

function seguirJogador(req,res) {
    const { idSeguidor, idSeguido, tipoAcao } = req.params;
    usuarioModel.seguirJogador(idSeguidor, idSeguido, tipoAcao).then(resposta => {
        if(resposta.affectedRows == 1) {
            res.status(200).json({mensagem: "OK"})
        }
    })
    .catch(erro => {
        res.status(401).json({mensagem: `Erro ao seguir este usuário: ${erro}`})
    })
}

module.exports = {
    autenticar,
    cadastrar,
    sugestoesNaoSeguidores,
    atualizar,
    buscarPeloid,
    seguirJogador
}