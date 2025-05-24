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
        SELECT e.nome, e.modalidade, e.nivelJogo, e.dtHoraComeco, q.localizacao FROM evento e
        INNER JOIN quadra q ON
        e.idQuadra = q.id;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);    
    return database.executar(instrucaoSql);    
}

function cadastrarJogo(jogo) {
    console.log("ACESSEI O JOGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarJogo():");
    var instrucaoSql = `
        INSERT INTO evento (nome, modalidade, nivelJogo, dtHoraComeco, dtHoraEncerramento, idQuadra, observacao, created_at)
        VALUES 
        ('${jogo.nome}', '${jogo.modalidade}', (select nivel from usuario where id = ${jogo.idUsuario}), 
        '${jogo.dtHoraComeco}', '${jogo.dtHoraEncerramento}', ${jogo.idQuadra}, '${jogo.observacao}', '${dataFormatada}');
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);    
    return database.executar(instrucaoSql);
}

function verificarDisponibilidadeJogo(jogo) {

    var instrucaoSql = `
        select 1 from evento where 
        ('${jogo.dtHoraComeco}' between dtHoraComeco and dtHoraEncerramento 
        or '${jogo.dtHoraEncerramento}' 
        between dtHoraComeco and dtHoraEncerramento) 
        and idQuadra = ${jogo.idQuadra};    
    
    `
    console.log("Executando instrucao SQL: \n"+ instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarJogo,
    verificarDisponibilidadeJogo,
    buscar
}