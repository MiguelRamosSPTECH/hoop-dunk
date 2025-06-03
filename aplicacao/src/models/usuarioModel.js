
var database = require("../database/config")

let dataFormatada;
function trataData() {
    let data = new Date().toLocaleString();
    data = data.replace(" ", "");
    data = data.replaceAll("/", "-");
    data = data.split(",");
    const horas = data[0].split("-");
    dataFormatada = `${horas[2]}-${horas[1]}-${horas[0]} ${data[1]}`
}

function autenticar(perfil, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", perfil, senha)
    var instrucaoSql = `
        select * ,
        (select count(*) from seguidores s1 where s1.idSeguido = u.id)as seguidores,
        (select count(*) from seguidores s2 where s2.idSeguidor = u.id) as seguindo
        from usuario u
        where u.nomePerfil = '${perfil}' and u.senha = SHA2('${senha}', 256);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, nomePerfil, email, senha) {
    trataData();
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, nomePerfil,  email, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome, nomePerfil, email, senha, created_at) VALUES ('${nome}', '${nomePerfil}', '${email}', SHA2('${senha}', 256), '${dataFormatada}');
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
        email = '${usuario.email}', posicao = '${usuario.posicao}', nivel = '${usuario.nivel}' 
        ${usuario.foto == null ? "" : `, foto = '${usuario.foto}'`} WHERE id = ${id};
        `
    } else {
        instrucaoSql = `
            UPDATE usuario set nome = '${usuario.nome}', nomePerfil = '${usuario.nomePerfil}', 
            email = '${usuario.email}', posicao = '${usuario.posicao}', nivel = '${usuario.nivel}'
            ${usuario.foto == null ? "" : `, foto = '${usuario.foto}'`}, senha = SHA2('${usuario.senha}', 256) WHERE id = ${id};
            `
    }
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql); 
}

function buscarUsuario(idSeguidor, idSeguido) {
console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarUsuario():", idSeguidor, idSeguido);
    let instrucaoSql = ``
    if(idSeguido == "false" || idSeguido == false) { //dependendo da onde vem ele vem como texto e como boolean msm
        instrucaoSql = `
            select u.*,
            p.id as idPost,
            p.idUsuario,
            p.descricao as descPost,
            p.foto as fotoPost,
            date_format(p.dtPost, "%d de %M") as dtPost,
            (
	            select count(idUsuario) from comentarioPost where idPost = p.id
            ) as qtdComentarios,
            (select count(*) from seguidores s1 where s1.idSeguido = u.id)as seguidores,
            (select count(*) from seguidores s2 where s2.idSeguidor = u.id) as seguindo
            from usuario u
            left join post p on
            p.idUsuario = u.id
            where u.id = ${idSeguidor}
            order by p.id desc; 
        `
    } else {
            instrucaoSql = `select u.*,
            p.id as idPost,
            p.idUsuario,
            p.descricao as descPost,
            p.foto as fotoPost,
            date_format(p.dtPost, "%d de %M") as dtPost,
            (
	            select count(idUsuario) from comentarioPost where idPost = p.id
            ) as qtdComentarios,
            (select count(*) from seguidores s1 where s1.idSeguido = u.id)as seguidores,
            (select count(*) from seguidores s2 where s2.idSeguidor = u.id) as seguindo,
            (select 1 from seguidores where idSeguidor = ${idSeguidor} and idSeguido = ${idSeguido}) as voceSegue
            from usuario u
            left join post p on
            p.idUsuario = u.id            
            where u.id = ${idSeguido}
            order by p.id desc;
        `
    }
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);     
}

function naoSeguidores(id) {
        console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", id);

        var instrucaoSql = 
        `
            select distinct u.id, u.nome, u.nomePerfil, u.foto from usuario u
            left join seguidores s on
            u.id = s.idSeguido
            where u.id <> ${id}
            and u.id not in (
            select idSeguidor from seguidores where idSeguido = ${id}
            UNION
            select idSeguido from seguidores where idSeguidor = ${id}
            );
        `
    return database.executar(instrucaoSql);
}

function seguirJogador(idSeguidor, idSeguido, tipoAcao) {
    trataData()
console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function seguirJogador():", idSeguidor, idSeguido);
    
let instrucaoSql = ``;
    if(tipoAcao == "pararSeguir") {
        instrucaoSql = `delete from seguidores where idSeguidor = ${idSeguidor} and idSeguido = ${idSeguido};`
    } else {
        instrucaoSql = `insert into seguidores(idSeguidor, idSeguido, dtHora) values (${idSeguidor}, ${idSeguido}, '${dataFormatada}');`
    }
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);       
}


function listarSeguidores(idUsuario, tipoAcao) {
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarSeguidores():");
  let instrucaoSql = ``
  if(tipoAcao == "Seguindo") {
    instrucaoSql = `
        select seguido.id, seguido.nome, seguido.nomePerfil, seguido.foto from usuario seguido
        inner join seguidores s1 on
        seguido.id = s1.idSeguido
        inner join usuario seguidor on
        s1.idSeguidor = seguidor.id
        where seguidor.id = ${idUsuario}
        and seguido.id <> ${idUsuario};
  `    
  } else {
    instrucaoSql = `
        select seguidor.id, seguidor.nome, seguidor.nomePerfil, seguidor.foto from usuario seguido
        inner join seguidores s1 on
        seguido.id = s1.idSeguido
        inner join usuario seguidor on
        s1.idSeguidor = seguidor.id
        where seguido.id = ${idUsuario};
    `
  } 
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}

function explorar(parametro, tipoBusca) {
    let instrucaoSql = ``
    if(tipoBusca == "Pessoas") {
        instrucaoSql = `
            SELECT id, nome, nomePerfil, foto FROM usuario
            WHERE nome LIKE '%${parametro}%' OR nomePerfil LIKE '%${parametro}%'
        `
    } else {
        instrucaoSql = `
            select 
            u.id as idUsuario,
            u.nome as nomeUsuario, 
            u.nomePerfil as perfilUsuario, 
            u.foto as fotoUsuario,
            p.id as idPost,
            p.descricao as postDescricao, 
            p.foto as postFoto,
            date_format(p.dtPost, "%d de %M") as dtPost,
            (
	            select count(idUsuario) from comentarioPost where idPost = p.id
            ) as qtdComentarios
            from post p
            inner join usuario u on
            u.id = p.idUsuario
            where u.nome LIKE '%${parametro}%' or u.nomePerfil LIKE '%${parametro}%'
            order by dtPost desc;
        `        
    }
    console.log("ENTREI NO USUARIO MODEL PARA EXPLORAR EXECUTANDO FUNÇÃO: ", instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    naoSeguidores,
    autenticar,
    cadastrar,
    atualizar,
    buscarUsuario,
    seguirJogador,
    listarSeguidores,
    explorar
};