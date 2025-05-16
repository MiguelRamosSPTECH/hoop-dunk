function cadastrar() {
    const nome = document.getElementById('nome').value;
    const nomeUsuario = document.getElementById('nomePerfil');
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha');
    const divErros = document.getElementById('erros');
    let mensagem = ``;

    if(nome == "" || nomeUsuario.value == "" || email == "" || senha.value == "") {
        mensagem = `Você deve preencher todos os campos!`
    } else if(nome.length < 2) {
        mensagem = `O nome deve ter pelo menos 3 caracteres.`
    } else if(nomeUsuario.validity.tooShort) {
        mensagem = `Nome de perfil deve conter mais que 5 caracteres!`
    } else if(!email.includes('@') || !email.includes('.')) {
        mensagem = `Email no formato incorreto!`
    } else if(senha.validity.tooShort) {
        mensagem = `Sua senha deve ter mais que 8 caracteres!`
    } else {
        fetch('/usuarios/cadastrar', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                nomeJogador: nome,
                perfilJogador: nomeUsuario.value,
                emailJogador: email,
                senhaJogador: senha.value
            })
        })
        .then(async resposta => {
            if(resposta.ok) {
                alert("Login efetuado com sucesso!")

                // substituir por uma div dps de notificação
                setTimeout(() => window.location = "../site/login.html", 2000)
            } else {
                const msgErro = await resposta.json()
                divErros.innerHTML = msgErro
            }
        })
        .catch(erro => {
            console.error("#ERRO, ",erro)
        })
    }
    divErros.innerHTML = mensagem
}

function logar() {
    const nomePerfil = document.getElementById('nomeUsuario').value;
    const senha = document.getElementById('senha').value;
    let mensagem = ``
    if(nomePerfil == "" || senha == "") {
        mensagem = `Preencha todos os campos para logar!`
    } else {
        fetch('/usuarios/autenticar', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                perfilJogador: nomePerfil,
                senhaJogador: senha
            })
        })
        .then(async resposta => {
            if(resposta.ok) {
                const dadosUsuario = await resposta.json();

                sessionStorage.DADOS_USUARIO = JSON.stringify(dadosUsuario);

                alert("Login efetuado com sucesso");
                setTimeout(() => window.location = "../rede-social/index.html", 1500)
                
            } else {
                const msgErro = await resposta.text();
                erros.innerHTML = msgErro
            }
        })
    }
    erros.innerHTML = mensagem
}