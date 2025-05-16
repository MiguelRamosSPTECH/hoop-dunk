function trazerSugestoesPessoas() {
    let id = JSON.parse(sessionStorage.DADOS_USUARIO)[0]

    fetch(`/usuarios/${id.id}/nao-seguidores`, {
        method: "GET"
    })
    .then(async resposta => {
        if(resposta.ok) {
            let divPessoaSeguir = document.getElementById('para-seguir');
            const usuarios = await resposta.json();
            usuarios.forEach(usuario  => {
                divPessoaSeguir.innerHTML+= `
                    <div class="pessoa-seguir">
                        <img src="IMAGE/foto-ishowspeed.jpg" alt="">
                        <div class="info-pessoa">
                            <label>${usuario.nome}</label>
                            <span>@${usuario.nomePerfil}</span>
                        </div>
                        <button>Seguir</button>
                    </div>
                `
            });
        }
    })
}