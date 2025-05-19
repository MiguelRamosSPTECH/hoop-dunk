const buttonOpen = document.getElementById('btn-addQuadra')
const modal = document.getElementById('modal')
const hide = document.getElementById('hide');
const buttonClose = document.getElementById('close-modal')

buttonOpen.addEventListener('click', () => {
    modal.showModal()
    hide.style.display = 'block'
})
buttonClose.addEventListener('click', () => {
    modal.close()
    hide.style.display = 'none'
})

function mudarFoto() {
    const fotoAtual = document.getElementsByClassName('edit')[0];
    const foto = ipt_fotoQuadra.files[0]
    if(foto) {
        const imgURL = URL.createObjectURL(foto);
        fotoAtual.style.backgroundImage = `url('${imgURL}')`;
    }
}

function cadastrarQuadra() {
    const idUser = JSON.parse(sessionStorage.DADOS_USUARIO)[0].id;
    const formData = new FormData();
    formData.append("nome", ipt_nome.value);
    formData.append("localizacao", ipt_localizacao.value);
    formData.append("foto", ipt_fotoQuadra.files[0])
    formData.append("descricao", ipt_desc.value);

    fetch(`/quadras/${idUser}/cadastrar`, {
        method: "POST",
        body: formData
    })
    .then(async resposta => {
        if(resposta.ok) {
            const msg = await resposta.text();
            modal.close()
            location.reload();
            console.log(msg);
        } else {
            const msgErro = await resposta.json();
            console.log("ERRo", msgErro);
        }
    })

}

function carregarQuadras() {
    fetch('/quadras/buscar', {
        method: "GET"
    })
    .then(async resposta => {
        if(resposta.ok) {
            let quadras = ``
            const bodyQuadra = document.getElementById('body-quadras');
            const infosQuadras = await resposta.json();
            infosQuadras.forEach(quadra => {
                quadras+=
                `
                    <div class="card-quadra">
                        <div class="foto-quadra" id="foto_quadra" style="background-image:url('../../assets/imgs/${quadra.foto}')"></div>
                        <div class="info-quadra">
                            <div class="titulo-info">
                                <span class="nome-quadra">${quadra.nome}</span>
                                <button onclick="window.location = './detalhes.html?id=${quadra.id}'">Ver Detalhes</button>
                            </div>
                            <label>Localizacao: <span>${quadra.localizacao}</span></label>
                            <label>Nível: <span>${quadra.nivel}</span></label>
                            <div class="descricao">
                                <label>Descrição</label>
                                <div class="desc-quadra">${quadra.descricao}</div>
                            </div>
                        </div>
                    </div>                 
                `
            });
            bodyQuadra.innerHTML = quadras;
        }
    })
}

// function updateNivelQuadra(id) {
//     fetch('/atualizarNivel')
// }

function detalhesQuadra() {
    const params = new URLSearchParams(window.location.search); //pega url que estou e pega os parametros dps do ?
    const id = params.get('id');
    const nomeUsuario = JSON.parse(sessionStorage.DADOS_USUARIO)[0].nome;
    fetch(`/quadras/${id}/detalhes`, {
        method: "GET",
    })
    .then(async resposta => {
        let jogadoresQuadra = ``
        let isJogador = false;
        const dadosQuadra = await resposta.json();
        const fotoQuadra = document.getElementById('foto-quadra');

        fotoQuadra.style.backgroundImage = `url('../../assets/imgs/${dadosQuadra[0].fotoQuadra}')`
        nome_quadra.innerHTML = dadosQuadra[0].nomeQuadra;
        localizacao_quadra.innerHTML = dadosQuadra[0].localizacaoQuadra;
        nivel_quadra.innerHTML = dadosQuadra[0].nivelQuadra;
        descricao_quadra.innerHTML = dadosQuadra[0].descricaoQuadra
        qtdJogadores.innerHTML = dadosQuadra[0].qtdJogadores;

        const areaJogadores = document.getElementById('jogadores-para-seguir')

        for(let i=0;i<dadosQuadra.length;i++) {
            if(dadosQuadra[i].fotoJogador == null) {
                dadosQuadra[i].fotoJogador = `sem_imagem_avatar.png`
            }
            if(dadosQuadra[i].nomeJogador != null) {
                jogadoresQuadra+=`
                    <div class="pessoa-seguir">
                        <img src="../../assets/imgs/${dadosQuadra[i].fotoJogador}" alt="">
                        <div class="info-pessoa">
                            <label>${dadosQuadra[i].nomeJogador}</label>
                            <span>@${dadosQuadra[i].perfilJogador}</span>
                        </div>
                        ${dadosQuadra[i].nomeJogador == nomeUsuario ? "" : "<button>Seguir</button>"}
                    </div> 
                `  
                if(nomeUsuario == dadosQuadra[i].nomeJogador) {
                    isJogador = true;
                }
            } else {
                jogadoresQuadra = `<h4>Nenhum jogador registrado na quadra</h4>`
            }
        }
        areaJogadores.innerHTML = jogadoresQuadra;
        if(dadosQuadra[0].eventoRolando == 1) {
            evento_rolando.innerHTML = `<img src="../../rede-social/IMAGE/icon-evento-rolando.png"> EVENTO ROLANDO`
        }
        if(isJogador) {
            participar_quadra.style.display = "none"
        }
    })
    
}

function participarQuadra() {
    const id = JSON.parse(sessionStorage.DADOS_USUARIO)[0].id;
    const params = new URLSearchParams(window.location.search); //pega url que estou e pega os parametros dps do ?
    const idQuadra = params.get('id');
    fetch(`/quadras/${id}/${idQuadra}/participar`, {
        method: "POST"
    })
    .then(async resposta => {
        if(resposta.ok) {
            const msg = await resposta.text();
            alert(msg)
            location.reload();            
        }

    })
}