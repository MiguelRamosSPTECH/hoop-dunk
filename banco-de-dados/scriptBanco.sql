create database hoopdunk;

use hoopdunk;

create table usuario(
	id int primary key auto_increment,
    nome varchar(45),
    nomePerfil varchar(20),
    email varchar(50),
    senha varchar(25),
    posicao varchar(15),
    nivel varchar(25)
);

create table seguidores(
	idSeguidor int,
    idSeguido int,
    statusAcao varchar(25),
	dtHora date,
    primary key(idSeguidor, idSeguido),
    constraint fkseguidor_seguidores foreign key(idSeguidor) references usuario(id),
    constraint fkseguido_seguidores foreign key(idSeguido) references usuario(id)
);

create table post(
	id int primary key auto_increment,
    idUsuario int not null,
    descricao varchar(100),
    foto varchar(100)
);

create table comentarioPost(
	id int primary key auto_increment,
	idPost int not null,
    idUsuario int not null,
    descricao varchar(100),
    constraint fkpost_comentarioPost foreign key(idPost) references post(id),
    constraint fkusuario_comentarioPost foreign key(idUsuario) references usuario(id)
);

create table quadra(
	id int primary key auto_increment,
    descricao varchar(150),
    foto varchar(100),
    nivel varchar(25),
    localizacao varchar(50)
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

create table evento(
	id int primary key auto_increment,
    dtHoraComeco datetime,
    dtHoraEncerramento datetime,
    nivelJogo varchar(25),
    idQuadra int,
    constraint chk_dtHoraEncerramento check(dtHoraEncerramento > dtHoraComeco),
    constraint fkquadra_evento foreign key(idQuadra) references quadra(id)
);

create table eventoJogadores(
	idEvento int,
    idJogador int,
    primary key(idEvento, idJogador),
	constraint fkevento_eventoJogadores foreign key(idEvento) references evento(id),
    constraint fkjogador_eventoJogadores foreign key(idJogador) references usuario(id)
);

-- selects
select * from usuario;







