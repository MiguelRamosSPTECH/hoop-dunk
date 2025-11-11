create database climetech;

use climetech;


create table empresa(
	idEmpresa int primary key auto_increment,
    nome varchar(50) not null,
    cnpj char(18) not null,
    email varchar(50) not null,
    senha varchar(20),
    acessoLiberado boolean default(false),
    unique unq_cnpj(cnpj),
    unique unq_email(email)
);

create table funcionarioEmpresa(
	idFuncionarioEmpresa int primary key auto_increment,
    nome varchar(35) not null,
    email varchar(50) not null,
    senha varchar(25) not null,
    dtCriacao datetime,
	tipoAcesso varchar(15) default('visualizador'),
	idEmpresa int, /* perguntar se vamos usar views, funcoes */
    unique unq_email(email),
    constraint chk_tipoAcesso check(tipoAcesso in('admin', 'visualizador')),
    constraint fkEmpresaFuncionario foreign key(idEmpresa) references empresa(idEmpresa)
);

/* se tiver banco no cadastro e login mudar primary key da empresa p cnpj dela */

create table estadio(
	idEstadio int primary key auto_increment,
    nome varchar(35),
    logradouro varchar(35),
    numLogradouro varchar(5),
    uf char(2),
    idEmpresa int,
    constraint fkEstadioEmpresa foreign key(idEmpresa) references empresa(idEmpresa)
);

create table shows(
	idEvento int primary key auto_increment,
    nome varchar(35),
    dtHoraComeco datetime,
    dtHoraFinal datetime,
    idEstadio int,
    constraint fkEstadioEvento foreign key(idEstadio) references estadio(idEstadio)
);

create table setor(
	idSetor int primary key auto_increment,
    ala varchar(35) not null,
	nivelAla varchar(15) not null,
    idEstadio int not null,
    constraint chk_nomeSetor check (ala in ('Norte','Leste','Oeste','Sul')),
    constraint chk_nivelSetor check (nivelAla in ('Inferior','Superior')),
    constraint fk_SetorEstadio foreign key(idEstadio) references estadio(idEstadio)
);

create table sensor(
	idSensor int primary key auto_increment,
    statusSensor varchar(20) not null,
    idSetor int not null,
    constraint fk_SensorSetorEstadio foreign key(idSetor) references setor(idSetor),
    constraint chk_statusSensor check(statusSensor in('Ativo','Inativo','Manutenção'))
);

create table dadosSensor(
	idDadosSensor int primary key auto_increment,
    temperatura decimal (5,2) not null,
	umidade int not null,
    dtHoraColeta datetime not null,
    idSensor int not null,
    constraint fkSensorDados foreign key(idSensor) references sensor(idSensor)
);

INSERT INTO empresa (nome, cnpj, email, senha) VALUES
('ClimeTech Ltda', '12.345.678/0001-90', 'climetech@gmail.com', 'Clime90_@$');

INSERT INTO funcionarioEmpresa (nome, email, senha, dtCriacao, idEmpresa) VALUES
('Miguel', 'miguel@climetech.com', 'm1Cl4@', '2025-05-20 15:00:00', 1);

INSERT INTO estadio (nome, logradouro, numLogradouro, uf, idEmpresa) VALUES
('Arena Central', 'Av. das Nações', '1000', 'DF', 1);

insert into shows values(null, 'Justin Bieber', '2025-05-31 23:00:00', '2025-06-01 03:00:00', 1);

INSERT INTO setor (ala, nivelAla, idEstadio) VALUES
('Norte', 'Inferior', 1);

INSERT INTO sensor (statusSensor, idSetor) VALUES
('Ativo', 1);

/*
	nível de alerta vão vir caso temperatura a partir de 32ºC ou umidade acima de 70%
 */

create view vw_sensacaoTermica 
as
SELECT 
    ROUND(
        temperatura + ((umidade / 100) * (temperatura * 0.2)), 
        2
    ) as sensacao_termica,
    dtHoraColeta, idSensor
FROM 
    dadosSensor;

-- trazendo sensação térmica atual
select sensacao_termica from vw_sensacaoTermica order by vw_sensacaoTermica.dtHoraColeta desc limit 1;

-- trazendo kpi de quantidade de alertas
select count(vw.sensacao_termica)
from vw_sensacaoTermica vw
inner join sensor s on s.idSensor = vw.idSensor
inner join setor st on st.idSetor = s.idSensor
inner join estadio e on e.idEstadio = st.idEstadio
inner join shows sw on sw.idEstadio = e.idEstadio
where vw.dtHoraColeta between '2025-04-22 00:00:00' and '2025-04-23 00:00:00'
and vw.sensacao_termica > 30;

-- trazendo qual setor mais quente



select * from shows;
select * from dadosSensor;

select * from setor;

drop database climetech;
