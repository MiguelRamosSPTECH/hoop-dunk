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

function buscar() {
    formataData();
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar():");
    var instrucaoSql = `
        SELECT e.id, e.nome, e.modalidade, e.nivelJogo, e.dtHoraComeco, q.localizacao FROM evento e
        INNER JOIN quadra q ON
        e.idQuadra = q.id
        where e.dtHoraComeco >= '${dataFormatada.split(" ")[0]}'
        order by e.dtHoraComeco;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);    
    return database.executar(instrucaoSql);    
}

function cadastrarJogo(jogo) {
    formataData()
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarJogo():");
    let instrucaoSql = `
        INSERT INTO evento (nome, modalidade, nivelJogo, dtHoraComeco, dtHoraEncerramento, idQuadra, observacao, created_at)
        VALUES 
        ('${jogo.nome}', '${jogo.modalidade}', (select nivel from usuario where id = ${jogo.idUsuario}), 
        '${jogo.dtHoraComeco}', '${jogo.dtHoraEncerramento}', ${jogo.idQuadra}, '${jogo.observacao}', '${dataFormatada}');
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);    
    return database.executar(instrucaoSql);
}


function verificarDisponibilidadeJogo(jogo, metodo) {

    let instrucaoSql = `
        select 1 from evento where 
        (('${jogo.dtHoraComeco}' between dtHoraComeco and dtHoraEncerramento )
        or (dthoraComeco between '${jogo.dtHoraComeco}' and '${jogo.dtHoraEncerramento}'))
        and idQuadra = ${jogo.idQuadra}`
    if(metodo == "update") {
        instrucaoSql+=` and evento.id <> ${jogo.id}`
    }
    instrucaoSql+=` limit 1;`
    console.log("Executando instrucao SQL: \n"+ instrucaoSql);
    return database.executar(instrucaoSql);
}

function participarJogo(idUsuario, tipoJogador, tipoAcao, idJogo) {
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function participarJogo():", idUsuario, tipoJogador, tipoAcao, idJogo);
    let instrucaoSql = ``
    if(tipoAcao == "Sair") {
        instrucaoSql = `DELETE FROM eventoJogadores where idEvento = ${idJogo} and idJogador = ${idUsuario}`
    } else {
        if(tipoJogador == "criador") {
            instrucaoSql = `
                INSERT INTO eventoJogadores (idEvento, idJogador, tipoJogador) VALUES ((select id from evento order by created_at desc limit 1), ${idUsuario}, '${tipoJogador}')
            `
        } else {
            instrucaoSql = `
                INSERT INTO eventoJogadores (idEvento, idJogador, tipoJogador) VALUES (${idJogo}, ${idUsuario}, '${tipoJogador}')
            `            
        }   
    }
    console.log("Executando a instrução SQL: \n" + instrucaoSql);    
    return database.executar(instrucaoSql);    
}

function detalhesJogo(idJogo, idUsuario) {
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function detalhesJogo():");
    let instrucaoSql = `
        select 
            e.id as idJogo,
            e.nome as nomeJogo, 
            e.nivelJogo as nivelJogo, 
            e.modalidade as modalidadeJogo, 
            date_format(e.dtHoraComeco, "%d/%m/%Y, %Hh%i") as dtHoraComeco, date_format(e.dtHoraEncerramento, "%d/%m/%Y, %Hh%i") as dtHoraEncerramento, 
            e.observacao as observacaoJogo,
            q.nome as nomeQuadra,
            q.localizacao as localizacaoQuadra,
            q.foto as fotoQuadra, 
            u.id as idJogador, 
            u.nome as nomeJogador, 
            u.nomePerfil as nomePerfilJogador, 
            u.foto as fotoJogador,
                (select count(*) from eventoJogadores where idEvento = e.id) as qtdJogadores,
                (
                    select 1 from seguidores where idSeguidor = ${idUsuario} and idSeguido = u.id
                ) as voceSegue,
            ej.tipoJogador as tipoJogador
            from evento e
            inner join quadra q on
            q.id = e.idQuadra
            left join eventoJogadores ej on
            ej.idEvento = e.id
            left join usuario u on
            u.id = ej.idJogador
            where e.id = ${idJogo};
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function verificarJogoAgora(idJogo, idQuadra) {
    formataData()
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function verificarJogo():", idJogo, idQuadra);
    let instrucaoSql = ``
    if(idQuadra  == "false" || idQuadra == false) {
        instrucaoSql = `
            select 1 as eventoRolando from evento where '${dataFormatada}' between dtHoraComeco and dtHoraEncerramento and id =${idJogo};        
        `
    } else {
        instrucaoSql = `
            select 1 as eventoRolando, e.id as jogoId from evento e 
            inner join quadra q on
            q.id = e.idQuadra
            where q.id = ${idQuadra}
            and '${dataFormatada}' between e.dtHoraComeco and e.dtHoraEncerramento;     
        `
    }
    console.log("EXECUTANDO A INSTRUÇÃO SQL:"+ instrucaoSql)
    return database.executar(instrucaoSql);
}

function buscarPorId(idJogo) {
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarPorId():", idJogo);

    var instrucaoSql = `
        SELECT 
        e.id as idJogo,
        e.nome as NomeJogo,
        e.modalidade as ModalidadeJogo,
        date_format(e.dtHoraComeco, "%Y-%m-%dT%H:%i") as dtHoraComeco,
        date_format(e.dtHoraEncerramento, "%Y-%m-%dT%H:%i") as dtHoraEncerramento,
        e.observacao as descJogo,
        e.idQuadra as idQuadra,
        e.nome as nomeQuadra
        FROM EVENTO e 
        inner join quadra q on
        e.idQuadra = q.id
        where e.id = ${idJogo};`;

    console.log("EXECUTANDO A INSTRUÇÃO SQL:"+ instrucaoSql)
    return database.executar(instrucaoSql);
}

function editJogo(dados) {
    console.log("entrei no model do JOGO E ACESSEI A FUNÇÃO editJogo()")
    let instrucaoSql = `
        UPDATE evento SET 
        nome = '${dados.nome}', 
        modalidade = '${dados.modalidade}',
        dtHoraComeco = '${dados.dtHoraComeco}',
        dtHoraEncerramento = '${dados.dtHoraEncerramento}',
        observacao = '${dados.observacao}',
        idQuadra = ${dados.idQuadra}
        WHERE id = ${dados.id};
    `
    console.log("Executando a query: ", instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarJogo,
    verificarDisponibilidadeJogo,
    buscar,
    participarJogo,
    detalhesJogo,
    verificarJogoAgora,
    buscarPorId,
    editJogo
}