
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
    if(formData.get('foto') == "undefined") {
        gerarAlerta('Insira uma foto da quadra!')
    } else if(formData.get('nome').length < 10 || formData.get('nome').length > 25) {
        gerarAlerta('Nome da quadra deve ter entre 10 e 25 caracteres')
    } else if(formData.get('localizacao').length < 10 || formData.get('localizacao') > 50) {
        gerarAlerta('Localização deve conter de 10 a 50 caracteres')
    } else if(formData.get('descricao').length < 45) {
        gerarAlerta('Descrição muito curta')
    } else if(formData.get('descricao').length > 300) {
        gerarAlerta("Descrição muito longa, máximo: 300 caracteres")
    } else {
        fetch(`/quadras/${idUser}/cadastrar`, {
            method: "POST",
            body: formData
        })
        .then(async resposta => {
            if(resposta.ok) {
                const msg = await resposta.text();
                gerarAlerta(msg, true);
                setTimeout(()=>
                    location.reload()
                ,2000)
            } else {
                const msgErro = await resposta.json();
                console.log("ERRo", msgErro);
            }
        })
    }


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


function detalhesQuadra() {
    const params = new URLSearchParams(window.location.search); //pega url que estou e pega os parametros dps do ?
    const id = params.get('id');
    const nomeUsuario = JSON.parse(sessionStorage.DADOS_USUARIO)[0].nome;
    const idUsuario = JSON.parse(sessionStorage.DADOS_USUARIO)[0].id
    fetch(`/quadras/${id}/${idUsuario}/detalhes`, {
        method: "GET",
    })
    .then(async resposta => {
        let jogadoresQuadra = ``
        let isJogador = false;
        let idCreator;
        const dadosQuadra = await resposta.json();
        const fotoQuadra = document.getElementById('foto-quadra');
        console.log("foto, ", dadosQuadra[0].fotoQuadra);
        fotoQuadra.style.backgroundImage = `url('../../assets/imgs/${dadosQuadra[0].fotoQuadra}')`
        nome_quadra.innerHTML = dadosQuadra[0].nomeQuadra;
        localizacao_quadra.innerHTML = dadosQuadra[0].localizacaoQuadra;
        nivel_quadra.innerHTML = dadosQuadra[0].nivelQuadra;
        descricao_quadra.innerHTML = dadosQuadra[0].descricaoQuadra
        qtdJogadores.innerHTML = dadosQuadra[0].qtdJogadores;

        const areaJogadores = document.getElementById('jogadores-para-seguir')

        for(let i=0;i<dadosQuadra.length;i++) {
            if(dadosQuadra[i].nomeJogador != null) {
                
                jogadoresQuadra+=`
                    <div onclick="window.location='../perfil-jogador/index.html${dadosQuadra[i].idJogador == idUsuario ? "" : `?idUsuario=${dadosQuadra[i].idJogador}`}'" class="pessoa-seguir">
                        <img src="../../assets/imgs/${dadosQuadra[i].fotoJogador ||`sem_imagem_avatar.png`}" alt="">
                        <div class="info-pessoa">
                            <label>${dadosQuadra[i].nomeJogador}</label>
                            <span>@${dadosQuadra[i].perfilJogador}</span>
                        </div>
                        ${dadosQuadra[i].idJogador == idUsuario ? "" : `<button>${dadosQuadra[i].voceSegue == 1 ? `Seguindo` : "Seguir"}</button>`}
                    </div> 
                `  
                if(nomeUsuario == dadosQuadra[i].nomeJogador) {
                    isJogador = true;
                }
                if(dadosQuadra[i].tipoJogador == "criador") {
                    idCreator = dadosQuadra[i].idJogador
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
            if(idCreator == JSON.parse(sessionStorage.DADOS_USUARIO)[0].id) {
                header.innerHTML=`
                    <h2>DESCRICAO QUADRA</h2>
                    <button id="editar_quadra" onclick="showModalEdit()">Editar</button>
                `
                editar_quadra.style.backgroundColor = `#cdcdcd`
                editar_quadra.style.color = "black"
            } else {
                participar_quadra.innerText = "Sair"
                participar_quadra.style.backgroundColor = `red`
            }
        }

        btnEdit.value = dadosQuadra[0].idQuadra;
    })
    
}

function participarQuadra() {
    const id = JSON.parse(sessionStorage.DADOS_USUARIO)[0].id;
    const params = new URLSearchParams(window.location.search); //pega url que estou e pega os parametros dps do ?
    const idQuadra = params.get('id');
    let tipoAcao = participar_quadra.innerText;
    fetch(`/quadras/${id}/${idQuadra}/${tipoAcao}/participar`, {
        method: "POST"
    })
    .then(async resposta => {
        if(resposta.ok) {
            console.log(resposta);
            const dados = await resposta.text();
            location.reload();            
        }

    })
}

function verificarJogo() {
    const params = new URLSearchParams(window.location.search)
    const idQuadra = params.get('id');
    fetch(`/jogos/${false}/${idQuadra}/verJogoAgora`, {
        method: "GET"
    })
    .then(async resposta => {
        if(resposta.ok) {
            const retornoJogo = await resposta.json();
            if(retornoJogo.length == 0) {
               console.log("Jogo não rolou ainda") 
            } else {
                evento_rolando.innerHTML = `
                    <img src="../IMAGE/icon-evento-rolando.png">   
                    <span>JOGO ROLANDO</span>                     
                `
                btn_desc.innerHTML =  `<button onclick="window.location='../jogos/detalhes.html?idJogo=${retornoJogo[0].jogoId}'">Detalhes do jogo</button>`
            }
        }
    })
    setTimeout(() => verificarJogo(), 3000);
}

function showModalEdit() {
    const hideEdit = document.getElementById('hide-edit');
    const modalEdit = document.getElementById('modal-edit');
    const fotoEdit = document.getElementsByClassName('edit'); //classe edit da foto da quadra do modal
    const fotoQuadra = document.getElementById('foto-quadra'); //id da foto da quadra
    if(modalEdit.open) {
        modalEdit.close();
        hideEdit.style.display = "none"        
    } else {
        modalEdit.showModal()
        hideEdit.style.display = "flex"
        ipt_nome.value = nome_quadra.innerText
        ipt_localizacao.value = localizacao_quadra.innerText
        ipt_desc.value = descricao_quadra.innerText
        fotoEdit[0].style.backgroundImage = fotoQuadra.style.backgroundImage
    }
}

function editarQuadra() {
    const fotoEdit = document.getElementsByClassName('edit');
    const idQuadra = Number(btnEdit.value);
    const formData = new FormData();
    formData.append("nome", ipt_nome.value);
    formData.append("localizacao", ipt_localizacao.value);
    formData.append("foto", ipt_fotoQuadra.files[0])
    formData.append("descricao", ipt_desc.value);
    formData.append("idQuadra", idQuadra);
    if(formData.get('nome').length < 10 || formData.get('nome').length > 25) {
        gerarAlerta('Nome da quadra deve ter entre 10 e 25 caracteres')
    } else if(formData.get('localizacao').length < 10 || formData.get('localizacao') > 50) {
        gerarAlerta('Localização deve conter de 10 a 50 caracteres')
    } else if(formData.get('descricao').length < 45) {
        gerarAlerta('Descrição muito curta')
    } else if(formData.get('descricao').length > 300) {
        gerarAlerta("Descrição muito longa, máximo: 300 caracteres")
    } else {    
        fetch('/quadras/editarQuadra', {
            method: "PUT",
            body: formData
        })
        .then(resposta => {
            if(resposta.ok) {
                location.reload()
            }
        })
        .catch(async erro => {
            const msgErro = await erro.json();
            gerarAlerta(msgErro);
        })
    }
}