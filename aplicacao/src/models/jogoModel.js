var database = require('../database/config')

    let data = new Date().toLocaleString();
    data = data.replace(" ", "");
    data = data.replaceAll("/", "-");
    data = data.split(",");
    const horas = data[0].split("-");
    let dataFormatada = `${horas[2]}-${horas[1]}-${horas[0]} ${data[1]}`


function buscar() {
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar():");
    var instrucaoSql = `
        SELECT e.id, e.nome, e.modalidade, e.nivelJogo, e.dtHoraComeco, q.localizacao FROM evento e
        INNER JOIN quadra q ON
        e.idQuadra = q.id
        order by e.dtHoraComeco desc;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);    
    return database.executar(instrucaoSql);    
}

function cadastrarJogo(jogo) {
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


function verificarDisponibilidadeJogo(jogo) {

    let instrucaoSql = `
        select 1 from evento where 
        ('${jogo.dtHoraComeco}' between dtHoraComeco and dtHoraEncerramento 
        or '${jogo.dtHoraEncerramento}' 
        between dtHoraComeco and dtHoraEncerramento) 
        and idQuadra = ${jogo.idQuadra};    
    
    `
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

function detalhesJogo(idJogo) {
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function detalhesJogo():");
    let instrucaoSql = `
        select 
            e.nome as nomeJogo, 
            e.nivelJogo as nivelJogo, 
            e.modalidade as modalidadeJogo, 
            date_format(e.dtHoraComeco, "%d/%m/%Y, %Hh%i") as dtHoraComeco, date_format(e.dtHoraEncerramento, "%d/%m/%Y, %Hh%i") as dtHoraEncerramento, 
            e.observacao as observacaoJogo,
            q.nome as nomeQuadra,
            q.localizacao as localizacaoQuadra,
            q.foto as fotoQuadra, 
            u.nome as nomeJogador, 
            u.nomePerfil as nomePerfilJogador, 
            u.foto as fotoJogador ,
                (select count(*) from eventoJogadores where idEvento = e.id) as qtdJogadores,
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
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function verificarJogo():", idJogo, idQuadra);
    let instrucaoSql = ``
    if(idQuadra  == "false" || idQuadra == false) {
        instrucaoSql = `
            select 1 as eventoRolando from evento where '${dataFormatada}' between dtHoraComeco and dtHoraEncerramento and id =${idJogo};        
        `
    } else {
        instrucaoSql = `
            select 1 as eventoRolando from evento e 
            inner join quadra q on
            q.id = e.idQuadra
            where q.id = ${idQuadra}
            and '${dataFormatada}' between e.dtHoraComeco and e.dtHoraEncerramento;     
        `
    }
    console.log("EXECUTANDO A INSTRUÇÃO SQL:"+ instrucaoSql)
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarJogo,
    verificarDisponibilidadeJogo,
    buscar,
    participarJogo,
    detalhesJogo,
    verificarJogoAgora
}