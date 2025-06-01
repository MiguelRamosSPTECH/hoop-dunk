// sessão
function validarSessao() {
    const nomeUsuario = document.getElementsByClassName('nomeUsuario');
    const nickname = document.getElementsByClassName('nickname')
    const fotoUsuario = document.getElementsByClassName('foto-perfil');
    if (sessionStorage.DADOS_USUARIO != undefined) {
        let dadosJson = JSON.parse(sessionStorage.DADOS_USUARIO)[0];
        let nome = dadosJson.nome;
        let nomePerfil = dadosJson.nomePerfil;
        let foto = dadosJson.foto;
        if(!foto) {
            foto = `sem_imagem_avatar.png`;
        }
        //for para as fotos
        for(let i=0;i<fotoUsuario.length;i++) {
            fotoUsuario[i].style.backgroundImage = `url('../../assets/imgs/${foto}')`
        }

        // for para os nomes
        for(let i=0;i<nomeUsuario.length;i++) {
            nomeUsuario[i].innerHTML = `${nome}`
            nickname[i].innerHTML = `@${nomePerfil}`
        }
    } else {
        window.location = "../../site/login.html";
    }
}

function validarSessaoAdm() {
    if(sessionStorage.DADOS_USUARIO == undefined || JSON.parse(sessionStorage.DADOS_USUARIO)[0].id != 16) {
        limparSessao()
        window.location = "../../site/login.html"
    }
    nome_adm.innerHTML = JSON.parse(sessionStorage.DADOS_USUARIO)[0].nome;
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../../site/login.html";
}

// carregamento (loading)
function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErrosLogin = document.getElementById("div_erros_login");
    if (texto) {
        divErrosLogin.style.display = "flex";
        divErrosLogin.innerHTML = texto;
    }
}


