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

function carregarPerfil() {
    const dadosJson = JSON.parse(sessionStorage.DADOS_USUARIO)[0];
    ipt_nome.value = dadosJson.nome
    ipt_nomePerfil.value = dadosJson.nomePerfil;
    select_level.value = dadosJson.nivel;
    select_position.value = dadosJson.posicao;
    ipt_email.value = dadosJson.email;
    posicao_game.innerHTML = dadosJson.posicao;
    level_player.innerHTML = dadosJson.nivel;
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
