function trazerSugestoesPessoas() {
    let id = JSON.parse(sessionStorage.DADOS_USUARIO)[0]

    fetch(`/usuarios/${id.id}/nao-seguidores`, {
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