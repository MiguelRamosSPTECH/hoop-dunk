var database = require("../database/config")

    let data = new Date().toLocaleString();
    data = data.replace(" ", "");
    data = data.replaceAll("/", "-");
    data = data.split(",");
    const horas = data[0].split("-");
    let dataFormatada = `${horas[2]}-${horas[1]}-${horas[0]} ${data[1]}`

function cadastrar(quadra ,idUser) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", quadra);

    var instrucaoSql = `
        INSERT INTO quadra (nome, localizacao, descricao, foto, nivel, created_at) VALUES ('${quadra.nome}', '${quadra.localizacao}', '${quadra.descricao}', '${quadra.foto}', (select nivel from usuario where id = ${idUser}), '${dataFormatada}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);    
}

function buscar() {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar():");
    
    var instrucaoSql = `
        SELECT * FROM quadra;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql); 
}

function buscaPeloId(id) {
    let data = new Date().toLocaleString();
    data = data.replace(" ", "");
    data = data.replaceAll("/", "-");
    data = data.split(",");
    const horas = data[0].split("-");
    let dataFormatada = `${horas[2]}-${horas[1]}-${horas[0]} ${data[1]}`
    var instrucaoSql = `
    select 
    q.nome as nomeQuadra,
    q.nivel as nivelQuadra,
    q.localizacao as localizacaoQuadra,
    q.descricao as descricaoQuadra,
    q.foto as fotoQuadra,
    u.nome as nomeJogador,
    u.nomePerfil as perfilJogador,
    qj.tipoJogador as tipoJogador,
    u.foto as fotoJogador,
        (select 1 from evento
            where q.id = evento.idQuadra and
            '${dataFormatada}' between dtHoraComeco and dtHoraEncerramento
        ) as eventoRolando,
            (
                select count(*) from quadraJogadores qj2
                where q.id = qj2.idQuadra
            ) as qtdJogadores
    from quadra q
    left join quadraJogadores qj on
    qj.idQuadra = q.id
    left join usuario u on
    qj.idJogador = u.id
    where q.id = ${id};
    `;

    console.log("Executando a instrução SQL:\n", instrucaoSql)
    return database.executar(instrucaoSql);
}

function participarQuadra(idUsuario, idQuadra, tipoJogador) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar():");
    
    var instrucaoSql = ``
    if(tipoJogador == 'criador') {
        instrucaoSql = `
            insert into quadraJogadores(idQuadra, idJogador, tipoJogador) values( 
            (select id from quadra
            order by created_at desc
            limit 1),
            ${idUsuario}, 'criador');        
        `
    } else {
        instrucaoSql = `
            INSERT INTO quadraJogadores VALUES (${idQuadra}, ${idUsuario}, '${tipoJogador}');
        `;
    }
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarNivelQuadra(idQuadra) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar():");

    var instrucaoSql = `
        update quadra set nivel = (
        select nivel from usuario
        inner join quadraJogadores qj on
        qj.idJogador = usuario.id
        where qj.idQuadra = quadra.id
        group by nivel
        order by count(nivel) desc limit 1)
        where id =${idQuadra};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);     
}

module.exports = {
    cadastrar,
    buscar,
    buscaPeloId,
    participarQuadra,
    atualizarNivelQuadra
}