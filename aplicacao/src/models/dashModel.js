var database = require('../database/config')

let dataFormatada;
function trataData() {
    let data = new Date().toLocaleString();
    data = data.replace(" ", "");
    data = data.replaceAll("/", "-");
    data = data.split(",");
    const horas = data[0].split("-");
    dataFormatada = `${horas[2]}-${horas[1]}-${horas[0]} ${data[1]}`
}

function buscarFluxoUsuarios(tipoFiltro) {
    let instrucaoSql = `
        select
            date_format(created_at, '%Y-%m') AS anoMes,
            count(*) AS qtdUsuarios
        from usuario
        where created_at >= date_sub(curdate(), interval ${tipoFiltro})
        group by date_format(created_at, '%Y-%m')
        order by date_format(created_at, '%Y-%m');            
    `
    return database.executar(instrucaoSql);
}

function dadosUserDash() {
    trataData()
    console.log("ENTREI NO USER MODEL E TO PEGANDO DADOS PARA A DASH")
    let instrucaoSql = `
-- USUARIOS  
select (
		select count(*) from usuario where MONTH(created_at) = MONTH('${dataFormatada}')
        and year(created_at) = year('${dataFormatada}')
        ) as totalMesAtual,
	   (
			select count(*) from usuario where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
            and year(created_at) = year(date_sub('${dataFormatada}', interval 1 month))
       ) as mesPassado,
       (
            truncate(
					(
						(
							(select count(*) from usuario where MONTH(created_at) = MONTH('${dataFormatada}')) 
							- (	select count(*) from usuario where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
								and year(created_at) = year(date_sub('${dataFormatada}', interval 1 month))
								)
                        )
                        /
						(select count(*) from usuario where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
							and year(created_at) = year(date_sub('${dataFormatada}', interval 1 month))
                        )
					) * 100, 2)
       ) as porcentagem,
       (
		select count(*) from usuario
       ) as total
       
-- JOGOS
UNION ALL
select  (
		select count(*) from evento where MONTH(created_at) = MONTH('${dataFormatada}')
        ) as totalMesAtualEvento,
	   (
			select count(*) from evento where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
       ) as mesPassadoEvento,
       (
            truncate(
					(
						(
							(select count(*) from evento where MONTH(created_at) = MONTH('${dataFormatada}')) 
							- (	select count(*) from evento where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
								and year(created_at) = year(date_sub('${dataFormatada}', interval 1 month))
								)
                        )
                        /
						(select count(*) from evento where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
							and year(created_at) = year(date_sub('${dataFormatada}', interval 1 month))
                        )
					) * 100, 2)
       ) as porcentagemEvento,
       (
		select count(*) from evento
       ) as totalEventos
       
-- QUADRAS
UNION ALL
select  (
		select count(*) from quadra where MONTH(created_at) = MONTH('${dataFormatada}')
        ) as mesAtual,
	   (
			select count(*) from quadra where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
       ) as mesPassado,
       (
            truncate(
					(
						(
							(select count(*) from quadra where MONTH(created_at) = MONTH('${dataFormatada}')) 
							- (	select count(*) from quadra where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
								and year(created_at) = year(date_sub('${dataFormatada}', interval 1 month))
								)
                        )
                        /
						(select count(*) from quadra where MONTH(created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month))
							and year(created_at) = year(date_sub('${dataFormatada}', interval 1 month))
                        )
					) * 100, 2)
       ) as porcentagem,
       (
		select count(*) from quadra
       ) as total
	UNION ALL
-- MEDIA POR JOGO
select truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH('${dataFormatada}'))
) / (select count(id) from evento),0) as mediaPorJogoAtual,

truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month)) and year('${dataFormatada}') = year(date_sub('${dataFormatada}', interval 1 month)))
) / (select count(id) from evento),0) as mediaPorJogoMesPassado,

truncate(((truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH('${dataFormatada}'))
) / (select count(id) from evento),0)
-truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month)) and year('${dataFormatada}') = year(date_sub('${dataFormatada}', interval 1 month)))
) / (select count(id) from evento),0))
/
truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH(date_sub('${dataFormatada}', interval 1 month)) and year('${dataFormatada}') = year(date_sub('${dataFormatada}', interval 1 month)))
) / (select count(id) from evento),0) * 100), 2) as porcentagemMediaJogadorPorJogo,
-- só aqui p bater num de colunas do union all
(select 1 from evento where id = 1 ) as nada;         
          
    `
    return database.executar(instrucaoSql);
}

function tipoJogadoresEvento() {
    var instrucaoSql = `
        select tipoJogador, count(distinct idJogador) as qtdUsuarios from eventoJogadores
        group by tipoJogador;    
    `
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarFluxoUsuarios,
    dadosUserDash,
    tipoJogadoresEvento
}