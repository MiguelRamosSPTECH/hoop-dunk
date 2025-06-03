let id = JSON.parse(sessionStorage.DADOS_USUARIO)[0].id

function trazerSugestoesPessoas() {
    fetch(`/usuarios/${id}/nao-seguidores`, {
        method: "GET"
    })
    .then(async resposta => {
        if(resposta.ok) {
            let usuariosNaoSeguir = ``
            let divPessoaSeguir = document.getElementById('para-seguir');
            const usuarios = await resposta.json();
            usuarios.forEach(usuario  => {
                usuariosNaoSeguir+= `
                    <div onclick="window.location = './perfil-jogador/index.html?idUsuario=${usuario.id}'" class="pessoa-seguir">
                        <img src="../../assets/imgs/${usuario.foto || `sem_imagem_avatar.png`}" alt="">
                        <div class="info-pessoa">
                            <label>${usuario.nome}</label>
                            <span>@${usuario.nomePerfil}</span>
                        </div>
                        <button>Seguir</button>
                    </div>
                `
            });
            divPessoaSeguir.innerHTML = usuariosNaoSeguir;
        }
    })
}

//poderia ter reutilizado mas fazer o que
//listar seguidores/quem ele segue 
function trazerPessoas(tipoAcao) {
    let acao = tipoAcao.innerText;
    const params = new URLSearchParams(window.location.search);
    const idVisitado = params.get('idUsuario');
    if(idVisitado != null) {
        id = idVisitado
    }
    fetch(`/usuarios/${id}/${acao}/listarSeguidores`, {
        method: "GET"
    })
    .then(async resposta => {
        const divPessoas = document.getElementById('body-modal-seguidores');
        if(resposta.ok) {
            let listaPessoas = ``
            const pessoas = await resposta.json();
            pessoas.forEach(pessoa => {
                listaPessoas+=`
                    <div class="pessoa">
                        <img onclick="window.location = 'index.html?${pessoa.id == JSON.parse(sessionStorage.DADOS_USUARIO)[0].id ? "" : `idUsuario=${pessoa.id}`}'"  src="../../assets/imgs/${pessoa.foto || `sem_imagem_avatar.png`}" alt="">
                        <div class="info-pessoa">
                            <label>${pessoa.nome}</label>
                            <span>@${pessoa.nomePerfil}</span>
                        </div>
                        ${idVisitado != null ? "" : `<button onclick="seguirJogador(${acao == "Seguidores" ? pessoa.id : id}, ${acao == "Seguindo" ? pessoa.id : id}, 'pararSeguir')">${acao == "Seguidores" ? "Remover" : "Deixar de seguir"}</button>`}
                    </div>                
                `
            })
            divPessoas.innerHTML = listaPessoas;
        } else {
            const msgErro = await resposta.text();
            divPessoas.innerHTML = idVisitado != null ? `Este usuário ainda não ${acao == "Seguidores" ? "possui seguidores" : "segue ninguém"}` : msgErro;
        }
    })
}