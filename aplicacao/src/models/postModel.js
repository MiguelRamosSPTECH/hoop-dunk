var database = require('../database/config')

let dataFormatada;
function formataData() {
    let data = new Date().toLocaleString();
    data = data.replace(" ", "");
    data = data.replaceAll("/", "-");
    data = data.split(",");
    const horas = data[0].split("-");
    dataFormatada = `${horas[2]}-${horas[1]}-${horas[0]} ${data[1]}`        
}

function publicarPost(post) {
    formataData()
    console.log("ENTREI NO POST MODEL E TO EXECUTANDO A publicarPost()", post)
    let instrucaoSql = `
        INSERT INTO post (idUsuario, descricao, foto, dtPost) 
        VALUES (${post.idUsuario}, '${post.descPost}', '${post.foto}', '${dataFormatada}');
    `
    console.log("EXECUTANDO A INSTRUÇÃO ", instrucaoSql);
    return database.executar(instrucaoSql);
}

function allPosts() {
    console.log("ENTREI NO MODEL DO POST E TO EXECUTANDO A FUNÇÃO allPosts()")
    let instrucaoSql = `
        select 
        u.id as idUsuario,
        u.nome as nomeUsuario, 
        u.nomePerfil as perfilUsuario, 
        u.foto as fotoUsuario,
        p.id as idPost,
        p.descricao as postDescricao, p.foto as postFoto,
        date_format(p.dtPost, "%d de %M") as dtPost,
                (
	                select count(idUsuario) from comentarioPost where comentarioPost.idPost = p.id
                ) as qtdComentarios
        from post p
        inner join usuario u on
        u.id = p.idUsuario
        order by p.id desc;
    `;
    console.log("EXECUTANDO A INSTRUÇÃO: ", instrucaoSql);
    return database.executar(instrucaoSql);
}

function descPost(idPost) {
    let instrucaoSql = `
        select
        p.descricao as descPost,
        p.foto as fotoPost,
        date_format(dtPost, "%m de %M") as dtPost,
        u.id as idCPost,
        u.nome as nomeCPost,
        u.nomePerfil as perfilCPost,
        u.foto as fotoCPost,
        uc.id as idComentador,
        uc.nome as nomeComentador,
        uc.nomePerfil as perfilComentador,
        uc.foto as fotoComentador,
        cp.descricao as descComentario,
        cp.fotoComentario,
        date_format(cp.created_at, "%m de %M") as dtComentario,
        (
            select count(idUsuario) from comentarioPost where idPost = p.id
        ) as qtdComentarios
        from comentarioPost cp
        right join post p on
        p.id = cp.idPost
        left join usuario uc on
        uc.id = cp.idUsuario
        inner join usuario u on
        u.id = p.idUsuario
        where p.id = ${idPost}
        order by cp.id desc;
    `
    return database.executar(instrucaoSql);
}

function comentarPost(dados) {
    formataData()
    let instrucaoSql = `
        INSERT INTO comentarioPost (idPost, idUsuario, descricao, fotoComentario, created_at) 
        VALUES (${dados.idPost}, ${dados.idUsuario}, '${dados.descComentario}', '${dados.foto}', '${dataFormatada}');
    `
    return database.executar(instrucaoSql);
}

module.exports = {
    publicarPost,
    allPosts,
    descPost,
    comentarPost
}