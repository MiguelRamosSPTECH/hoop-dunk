var database = require("../database/config")

function autenticar(perfil, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", perfil, senha)
    var instrucaoSql = `
        SELECT * FROM usuario WHERE nomePerfil = '${perfil}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, nomePerfil, email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, nomePerfil,  email, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome, nomePerfil, email, senha) VALUES ('${nome}', '${nomePerfil}', '${email}', '${senha}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizar(id, usuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function atualizar():", usuario);
    console.log("MODEL: ",usuario.foto)
    var instrucaoSql = ``
    if(usuario.senha == "") {
        instrucaoSql = `
        UPDATE usuario set nome = '${usuario.nome}', nomePerfil = '${usuario.nomePerfil}', 
        email = '${usuario.email}', posicao = '${usuario.posicao}', nivel = '${usuario.nivel}', 
        foto = '${usuario.foto}' WHERE id = ${id};
        `
    } else {
        instrucaoSql = `
            UPDATE usuario set nome = '${usuario.nome}', nomePerfil = '${usuario.nomePerfil}', 
            email = '${usuario.email}', posicao = '${usuario.posicao}', nivel = '${usuario.nivel}', 
            foto = '${usuario.foto}', senha = '${usuario.senha}' WHERE id = ${id};
            `
    }
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql); 
}

function buscarUsuario(id) {
console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarUsuario():", id);
    
    let instrucaoSql = `
    SELECT * FROM usuario WHERE id = ${id};
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);     
}

function naoSeguidores(id) {
        console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", id);

        var instrucaoSql = 
        `
            select id, nome, nomePerfil from usuario 
            left join seguidores s on
            usuario.id = s.idSeguidor
            where s.idSeguidor is null
            and s.idSeguido is null
            and usuario.id <> ${id}
            limit 6;
        `
    return database.executar(instrucaoSql);
}

module.exports = {
    naoSeguidores,
    autenticar,
    cadastrar,
    atualizar,
    buscarUsuario
};