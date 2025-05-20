const buttonEdit = document.getElementById('edit-profile')
const closeModal = document.getElementById('close-modal')
const modal = document.getElementById('modal');
const fundoModal = document.getElementById('hide');

// area do modal
buttonEdit.addEventListener('click', () => {
    hide.style.display = "block"
    modal.showModal()
})

closeModal.addEventListener('click', ()=> {
    hide.style.display = "none"
    modal.close();
} )

function mudarFoto() {
    const foto = document.getElementsByClassName('edit')[0];
    const fotoEscolhida = ipt_fotoPerfil.files[0]; //retorna array de "fotos" por isso pego na primeira posicao
    if(fotoEscolhida) {
        const imgURL = URL.createObjectURL(fotoEscolhida) //transforma em uma url local para colocar a foto
        foto.style.backgroundImage = `url('${imgURL}')`
    }
}

function preencherDadosUsuario(dados) {
    name_user.innerHTML = dados.nome || "Nome não definido";
    nickname_user.innerHTML = dados.nomePerfil || "Nickname não definido";
    foto_user.style.backgroundImage = `url('../../assets/imgs/${dados.foto || 'sem_imagem_avatar.png'}')`;  
    posicao_game.innerHTML = dados.posicao || "Posição não definida";
    level_player.innerHTML = dados.nivel || "Nível não definido";
    seguidores.innerHTML = dados.seguidores || 0;
    seguindo.innerHTML = dados.seguindo || 0;
}

function carregarPerfil() {
    const dadosJson = JSON.parse(sessionStorage.DADOS_USUARIO)[0];
    const params = new URLSearchParams(window.location.search);
    const id = params.get('idUsuario');
    if(id) {
        fetch(`/usuarios/${dadosJson.id}/${id}/buscarPeloid`, {
            method: "GET"
        })
        .then(async resposta => {
            if(resposta.ok) {
                const divButtons = document.getElementById('centraliza-botao');
                const dados = await resposta.json(); 
                preencherDadosUsuario(dados[0]);   

                // botao para seguir/deixar de seguir
                divButtons.innerHTML = `
                    <button onclick="seguirJogador(${dadosJson.id},${dados[0].id}, this.innerText)">${dados[0].voceSegue ? "Deixar de seguir" : "Seguir"}</button>
                `
            } else {
                console.error("Erro ao buscar dados do usuário");
                return;                    
            }
        }) 
    } else {
        preencherDadosUsuario(dadosJson);       
    }
}

function seguirJogador(idSeguidor, idSeguido, tipoAcao) {
    if  ( 
            (idSeguidor != null && idSeguido != null) && 
            (idSeguidor != undefined && idSeguido != undefined) &&
            tipoAcao != null && tipoAcao != undefined
        ) {
            if(tipoAcao == "Deixar de seguir") {
                tipoAcao = "pararSeguir"
            }
        fetch(`/usuarios/${idSeguidor}/${idSeguido}/${tipoAcao}/seguir`, {
            method:"POST"
        })
        .then(async resposta => {
            if(resposta.ok) {
                const msg = await resposta.json();
                console.log(msg);
                location.reload() 
                divButtons.innerHTML = `
                    <button onclick="seguirJogador(${dadosJson.id},${dados[0].id})">Deixar de Seguir</button>
                `               
            }
        })
    }
}

function editProfile() {
    const id = JSON.parse(sessionStorage.DADOS_USUARIO)[0].id;
    
    const formData = new FormData();
    formData.append("nome", ipt_nome.value);
    formData.append("nomePerfil", ipt_nomePerfil.value);
    formData.append("nivel", select_level.value);
    formData.append("posicao", select_position.value);
    formData.append("email", ipt_email.value);
    formData.append("senha", ipt_senha.value);
    formData.append("foto", ipt_fotoPerfil.files[0]);
    //aqui ele cuida dos tipos dos dados automaticamente.

    fetch(`/usuarios/${id}/atualizar`, {
        method:"PUT",
        body: formData,
    })
    .then(async resposta => {
        if(resposta.ok) {
            const dadosAtualizados = await resposta.json();
            sessionStorage.DADOS_USUARIO = JSON.stringify(dadosAtualizados);
            modal.close()
            location.reload()
        }
    })
    .catch(async erro => {
        const mgsErro = await resposta.text();
        console.log("deu erro", mgsErro);
    })
}
