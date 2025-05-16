// sessão
function validarSessao() {
    if (sessionStorage.DADOS_USUARIO != undefined) {
        let dadosJson = JSON.parse(sessionStorage.DADOS_USUARIO)[0];
        let nome = dadosJson.nome;
        let nomePerfil = dadosJson.nomePerfil;
        
        nomeUsuario.innerHTML = nome;
        nickname.innerHTML = `@${nomePerfil}`;
    } else {
        window.location = "../site/login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
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

