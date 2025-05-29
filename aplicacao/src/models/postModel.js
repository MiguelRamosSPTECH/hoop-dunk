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
        p.descricao as postDescricao, p.foto as postFoto,
        p.dtPost as dtPost
        from post p
        inner join usuario u on
        u.id = p.idUsuario
        order by dtPost desc;
    `;
    console.log("EXECUTANDO A INSTRUÇÃO: ", instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    publicarPost,
    allPosts
}