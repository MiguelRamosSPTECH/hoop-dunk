create database hoopdunk;

use hoopdunk;

create table usuario(
	id int primary key auto_increment,
    nome varchar(45),
    nomePerfil varchar(20),
    email varchar(50),
    senha varchar(255),
    posicao varchar(15),
    nivel varchar(25),
    foto text,
    created_at datetime
);

create table seguidores(
	idSeguidor int,
    idSeguido int,
	dtHora datetime,
    primary key(idSeguidor, idSeguido),
    constraint fkseguidor_seguidores foreign key(idSeguidor) references usuario(id),
    constraint fkseguido_seguidores foreign key(idSeguido) references usuario(id)
);

create table post(
	id int primary key auto_increment,
    idUsuario int not null,
    descricao varchar(100),
    foto text,
    dtPost datetime
);
create table comentarioPost(
	id int primary key auto_increment,
	idPost int not null,
    idUsuario int not null,
    descricao varchar(100),
    fotoComentario text,
    created_at datetime,
    constraint fkpost_comentarioPost foreign key(idPost) references post(id),
    constraint fkusuario_comentarioPost foreign key(idUsuario) references usuario(id)
);


create table quadra(
	id int primary key auto_increment,
    nome varchar(30),
    foto text,
    nivel varchar(25),
    descricao varchar(300),
    localizacao varchar(50),
    created_at datetime
);


create table quadraJogadores(
	idQuadra int,
    idJogador int,
    tipoJogador varchar(20),
    primary key(idQuadra, idJogador),
    constraint chk_tipoJogador check(tipoJogador in('criador', 'jogador')),
	constraint fkquadra_quadraJogadores foreign key(idQuadra) references quadra(id),
    constraint fkjogador_quadraJogadores foreign key(idJogador) references usuario(id)
);

SELECT * FROM information_schema.table_constraints WHERE table_name = 'quadraJogadores';

create table evento(
	id int primary key auto_increment,
    nome varchar(25),
    modalidade varchar(45),
    dtHoraComeco datetime,
    dtHoraEncerramento datetime,
    nivelJogo varchar(25),
    observacao varchar(255),
    idQuadra int,
    created_at datetime,
    constraint chk_dtHoraEncerramento check(dtHoraEncerramento > dtHoraComeco),
    constraint fkquadra_evento foreign key(idQuadra) references quadra(id)
);

create table eventoJogadores(
	idEvento int,
    idJogador int,
    tipoJogador varchar(20),
    primary key(idEvento, idJogador),
	constraint fkevento_eventoJogadores foreign key(idEvento) references evento(id),
    constraint fkjogador_eventoJogadores foreign key(idJogador) references usuario(id)
);

-- inserindo dados
INSERT INTO usuario (nome, nomePerfil, email, senha, posicao, nivel, foto, created_at)
VALUES
-- Junho/2024
('Lucas Silva', 'lucas.s', 'lucas.silva@example.com', 'senha123', 'Armador', 'Intermediário', '', '2024-06-04 10:00:00'),
('Ana Paula', 'anapaula', 'ana.paula@example.com', 'senha123', 'Ala', 'Básico', '', '2024-06-22 15:30:00'),

-- Julho/2024
('Rafael Costa', 'rafa.c', 'rafael.costa@example.com', 'senha123', 'Pivô', 'Avançado', '', '2024-07-08 11:10:00'),
('Bruna Lima', 'brunalima', 'bruna.lima@example.com', 'senha123', 'Armador', 'Básico', '', '2024-07-25 18:45:00'),

-- Agosto/2024
('Carlos Eduardo', 'cadu', 'carlos.eduardo@example.com', 'senha123', 'Ala', 'Intermediário', '', '2024-08-03 08:20:00'),
('Juliana Rocha', 'ju.rocha', 'juliana.rocha@example.com', 'senha123', 'Pivô', 'Avançado', '', '2024-08-21 16:00:00'),

-- Setembro/2024
('Felipe Souza', 'felipes', 'felipe.souza@example.com', 'senha123', 'Armador', 'Avançado', '', '2024-09-10 14:15:00'),
('Larissa Alves', 'lari.alves', 'larissa.alves@example.com', 'senha123', 'Ala', 'Intermediário', '', '2024-09-27 19:30:00'),

-- Outubro/2024
('Matheus Duarte', 'matduarte', 'matheus.duarte@example.com', 'senha123', 'Pivô', 'Básico', '', '2024-10-06 09:50:00'),
('Beatriz Campos', 'bia.campos', 'beatriz.campos@example.com', 'senha123', 'Ala', 'Avançado', '', '2024-10-24 20:10:00'),

-- Novembro/2024
('Diego Martins', 'diegom', 'diego.martins@example.com', 'senha123', 'Armador', 'Intermediário', '', '2024-11-01 12:40:00'),
('Fernanda Reis', 'fer.reis', 'fernanda.reis@example.com', 'senha123', 'Pivô', 'Básico', '', '2024-11-19 17:55:00'),

-- Dezembro/2024
('João Henrique', 'joaohen', 'joao.henrique@example.com', 'senha123', 'Ala', 'Avançado', '', '2024-12-07 07:30:00'),
('Camila Moraes', 'camilam', 'camila.moraes@example.com', 'senha123', 'Pivô', 'Intermediário', '', '2024-12-29 21:25:00'),

-- Janeiro/2025
('Igor Nascimento', 'igor.n', 'igor.nascimento@example.com', 'senha123', 'Armador', 'Básico', '', '2025-01-12 13:00:00'),
('Vanessa Barros', 'vaneb', 'vanessa.barros@example.com', 'senha123', 'Ala', 'Avançado', '', '2025-01-28 22:10:00'),

-- Fevereiro/2025
('Pedro Almeida', 'pedroa', 'pedro.almeida@example.com', 'senha123', 'Pivô', 'Intermediário', '', '2025-02-06 15:10:00'),
('Tatiane Melo', 'tati.melo', 'tatiane.melo@example.com', 'senha123', 'Ala', 'Básico', '', '2025-02-23 08:45:00'),

-- Março/2025
('André Luiz', 'andrel', 'andre.luiz@example.com', 'senha123', 'Armador', 'Avançado', '', '2025-03-03 10:00:00'),
('Mariana Vieira', 'mavieira', 'mariana.vieira@example.com', 'senha123', 'Pivô', 'Intermediário', '', '2025-03-19 19:00:00'),

-- Abril/2025
('Henrique Torres', 'henriquet', 'henrique.torres@example.com', 'senha123', 'Ala', 'Básico', '', '2025-04-09 09:15:00'),
('Patrícia Lopes', 'pat.lopes', 'patricia.lopes@example.com', 'senha123', 'Armador', 'Avançado', '', '2025-04-27 14:35:00'),

-- Maio/2025
('Thiago Ramos', 'thi.ramos', 'thiago.ramos@example.com', 'senha123', 'Pivô', 'Intermediário', '', '2025-05-11 11:55:00'),
('Débora Castro', 'deb.castro', 'debora.castro@example.com', 'senha123', 'Ala', 'Avançado', '', '2025-05-30 17:20:00');


INSERT INTO seguidores (idSeguidor, idSeguido, statusAcao, dtHora) VALUES
(3, 2, 'aceito', CURDATE()),
(4, 2, 'aceito', CURDATE());

select * from usuario;

select * from seguidores;

delete from seguidores where idSeguidor = 1;

select * from quadra;

select * from evento;

		-- trazendo seguidores, quem o cara segue e se o usuario segue ele
        select *,
        (select count(*) from seguidores s1 where s1.idSeguido = u.id)as seguidores,
        (select count(*) from seguidores s2 where s2.idSeguidor = u.id) as seguindo,
		(select 1 from seguidores where idSeguidor = 1 and idSeguido = 13) as voceSegue
        from usuario u
        where id = 13;
        

-- jogadores na quadra 1
insert into quadraJogadores (idQuadra, idJogador, tipoJogador) values
(4, 1, 'criador'),
(4, 3, 'jogador'),
(4, 4, 'jogador'),
(4, 5, 'jogador'),
(4, 6, 'jogador');



-- nivel da quadra da update conforme o nivel predominante dos jogadores
update quadra set nivel = (
select nivel from usuario
inner join quadraJogadores qj on
qj.idJogador = usuario.id
where qj.idQuadra = quadra.id
group by nivel
order by count(nivel) desc limit 1)
where id =4;


-- trazendo todas as descricoes das quadras
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
            curdate() between dtHoraComeco and dtHoraEncerramento
        ) as eventoRolando,
            (
                select count(*) from quadraJogadores qj2
                where q.id = qj2.idQuadra
            ) as qtdJogadores
    from quadra q
    inner join quadraJogadores qj on
    qj.idQuadra = q.id
	inner join usuario u on
    qj.idJogador = u.id
    where q.id = 1;


-- funcao que traz os seguidores do usuario
select (select count(u.id) where u.id = seguidores.idSeguido) as Seguidores, (select count(s.id) where s.id = seguidores.idSeguidor) as Seguindo from usuario u
inner join seguidores  on
u.id = seguidores.idSeguido
inner join usuario s on
s.id = seguidores.idSeguidor;


-- trazendo pessoas que nao tem relação nenhuma com um x usuario
select distinct u.id, u.nome, u.nomePerfil from usuario u
left join seguidores s on
u.id = s.idSeguido
where u.id <> 2 -- sem isso ele me traz
and u.id not in (
select idSeguidor from seguidores where idSeguido = 2 -- quem é seguido pelo 2
UNION
select idSeguido from seguidores where idSeguidor = 2 -- quem segue o 2
);

-- verificando se o horario de comeco/fim inserido pelo usuario já existe ou nao em quadra x
select 1 from evento where 
('2025-05-24 17:00:00' between dtHoraComeco and dtHoraEncerramento 
or '2025-05-24 19:00:00' 
between dtHoraComeco and dtHoraEncerramento) 
and idQuadra = 4;


-- trazendo seguidores ou quem ele segue
select seguidor.nome, seguidor.nomePerfil, seguidor.foto, (select 1 from seguidores where idSeguidor = 1 and idSeguido = 2) as segueVoce from usuario seguido
inner join seguidores s1 on
seguido.id = s1.idSeguido
inner join usuario seguidor on
s1.idSeguidor = seguidor.id;



-- trazendo sugestões (quadras ou eventos que tem jogadores em que o usuário participa porém que não tem relação com ele de seguidores/seguindo)






-- trazendo a descricao completa do jogo
select 
e.nome as nomeJogo, 
e.nivelJogo as nivelJogo, 
e.modalidade as modalidadeJogo, 
date_format(e.dtHoraComeco, "%d/%m/%Y, %Hh%i") as dtHoraComeco, date_format(e.dtHoraEncerramento, "%d/%m/%Y, %Hh%i") as dtHoraEncerramento, 
q.nome as nomeQuadra,
q.localizacao as localizacaoQuadra, 
q.foto as fotoQuadra,
u.nome as nomeJogador, 
u.nomePerfil as nomePerfilJogador, 
u.foto as fotojogador ,
	(select count(*) from eventoJogadores where idEvento = e.id) as qtdJogadores
from evento e
inner join quadra q on
q.id = e.idQuadra
inner join eventoJogadores ej on
ej.idEvento = e.id
inner join usuario u on
u.id = ej.idJogador
where e.id = 4;


-- verificar jogo agoras
select 1 from evento where id = evento.idQuadra and curdate() between dtHoraComeco and dtHoraEncerramento;
select 1 as eventoRolando from evento where '2025-05-26 09:00:00' between dtHoraComeco and dtHoraEncerramento and id =4;

select 1 as eventoRolando from evento e 
inner join quadra q on
q.id = e.idQuadra
where q.id = 1
and '2025-05-26 09:00:00' between e.dtHoraComeco and e.dtHoraEncerramento;

select * from quadra;
select * from quadraJogadores;
select * from usuario;
select * from evento;

SELECT 
e.id as idJogo,
e.nome as NomeEvento,
e.modalidade as ModalidadeEvento,
e.dtHoraComeco,
e.dtHoraEncerramento,
e.nivelJogo as nivelJogo,
e.observacao as descJogo,
e.idQuadra as idQuadra
 FROM EVENTO e 
right join quadra q on
e.idQuadra = q.id
where e.id = 6;


-- funcao modificada para verificar se o horário do jogo está disponível
select * from evento;
select 1 as eventoRolando from evento 
where ('2025-06-03 11:00:00' between dtHoraComeco and dtHoraEncerramento)
or ('2025-06-03 13:00:00' between dtHoraComeco and dtHoraEncerramento)
and idQuadra = 5
limit 1;
-- com limit será?


-- posts

select * from seguidores;
select * from post;
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

select * from post;
select * from usuario;
delete from usuario where id between 9 and 10;


set lc_time_names = 'pt_BR';

            select u.*,
            p.descricao as descPost,
            p.foto as fotoPost,
            date_format(p.dtPost, "%d de %M") as dtPost,
            (select count(*) from seguidores s1 where s1.idSeguido = u.id)as seguidores,
            (select count(*) from seguidores s2 where s2.idSeguidor = u.id) as seguindo
            from usuario u
            inner join post p on
            p.idUsuario = u.id
            where u.id = 1; 
		

select * from usuario;


-- querys para o backend
-- se for janeiro e eu fizer month() - 1 ele vai dar 0 por isso uso sub_date que ele entende que se for janeiro
-- ele só vai p dezembro sem problema e dou interval 1 month que é o mês passado
-- ano também, por que ele vai ir p 12 mas pode ser o mes 12 de qualquer ano, por isso uso o AND YEAR também;
select (
		select count(*) from usuario where MONTH(created_at) = MONTH('2025-06-30 23:00:00')
        and year(created_at) = year(curdate())
        ) as totalMesAtual,
	   (
			select count(*) from usuario where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
            and year(created_at) = year(date_sub(curdate(), interval 1 month))
       ) as mesPassado,
       (
            truncate(
					(
						(
							(select count(*) from usuario where MONTH(created_at) = MONTH(curdate())) 
							- (	select count(*) from usuario where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
								and year(created_at) = year(date_sub(curdate(), interval 1 month))
								)
                        )
                        /
						nullif((select count(*) from usuario where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
							and year(created_at) = year(date_sub(curdate(), interval 1 month))
                        ),0)
					) * 100, 2)
       ) as porcentagem,
       (
		select count(*) from usuario
       ) as total
       
       -- JOGOS
UNION ALL
select  (
		select count(*) from evento where MONTH(created_at) = MONTH(curdate())
        ) as totalMesAtualEvento,
	   (
			select count(*) from evento where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
       ) as mesPassadoEvento,
       (
            truncate(
					(
						(
							(select count(*) from evento where MONTH(created_at) = MONTH(curdate())) 
							- (	select count(*) from evento where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
								and year(created_at) = year(date_sub(curdate(), interval 1 month))
								)
                        )
                        /
						nullif((select count(*) from evento where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
							and year(created_at) = year(date_sub(curdate(), interval 1 month))
                        ), 0)
					) * 100, 2)
       ) as porcentagemEvento,
       (
		select count(*) from evento
       ) as totalEventos
       
       -- quadras
       UNION ALL
select  (
		select count(*) from quadra where MONTH(created_at) = MONTH(curdate())
        ) as mesAtual,
	   (
			select count(*) from quadra where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
       ) as mesPassado,
       (
            truncate(
					(
						(
							(select count(*) from quadra where MONTH(created_at) = MONTH(curdate())) 
							- (	select count(*) from quadra where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
								and year(created_at) = year(date_sub(curdate(), interval 1 month))
								)
                        )
                        /
						nullif((select count(*) from quadra where MONTH(created_at) = MONTH(date_sub(curdate(), interval 1 month))
							and year(created_at) = year(date_sub(curdate(), interval 1 month))
                        ), 0)
					) * 100, 2)
       ) as porcentagem,
       (
		select count(*) from quadra
       ) as total
	UNION ALL
-- MEDIA POR JOGO
select truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH(curdate()))
) / nullif((select count(id) from evento), 0),0) as mediaPorJogoAtual,
truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH(date_sub(curdate(), interval 1 month)) and year(date_sub(curdate(), interval 1 month)))
) / nullif((select count(id) from evento), 0),0) as mediaPorJogoMesPassado,

truncate(((truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH(curdate()))
) / nullif((select count(id) from evento), 0),0)
-truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH(date_sub(curdate(), interval 1 month)) and year(date_sub(curdate(), interval 1 month)))
) / nullif((select count(id) from evento), 0),0))
/
truncate(sum( 
	(select count(idJogador) from eventoJogadores inner join evento on evento.id = eventoJogadores.idEvento WHERE 
		MONTH(evento.created_at) = MONTH(date_sub(curdate(), interval 1 month)) and year(date_sub(curdate(), interval 1 month)))
) / nullif((select count(id) from evento), 0),0) * 100), 2) as porcentagemMediaJogadorPorJogo,
(select 1 from evento where id = 1 ) as nada;       

select * from usuario;


-- estudar melhor o porque essa query é a correta
select
  date_format(created_at, '%Y-%m') AS mes_ano,
  count(*) AS qtdUsuarios
from usuario
where created_at >= date_sub(curdate(), interval 6 month)
group by date_format(created_at, '%Y-%m')
order by date_format(created_at, '%Y-%m');
select * from usuario;

-- trazendo comentários dos posts
select * from comentarioPost;
select * from post;

select
p.descricao as descPost,
p.foto as fotoPost,
date_format(dtPost, "%m de %M") as dtPost,
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
where p.id = 29;

select * from usuario;

update usuario set  senha = SHA2('senha123', 256) where id = 29;