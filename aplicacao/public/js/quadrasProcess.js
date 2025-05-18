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
    const formData = new FormData();
    formData.append("nome", ipt_nome.value);
    formData.append("localizacao", ipt_localizacao.value);
    formData.append("foto", ipt_fotoQuadra.files[0])
    formData.append("descricao", ipt_desc.value);

    fetch('/quadras/cadastrar', {
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
            const bodyQuadra = document.getElementById('body-quadras');
            const infosQuadras = await resposta.json();
            infosQuadras.forEach(quadra => {
                bodyQuadra.innerHTML+=
                `
                    <div class="card-quadra">
                        <div class="foto-quadra" id="foto_quadra" style="background-image:url('../../assets/imgs/${quadra.foto}')"></div>
                        <div class="info-quadra">
                            <div class="titulo-info">
                                <span class="nome-quadra">${quadra.nome}</span>
                                <button>Ver Detalhes</button>
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
        }
    })
}