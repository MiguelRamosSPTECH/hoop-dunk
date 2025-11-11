
const modal = document.getElementsByClassName('modal');
const fundoModal = document.getElementById('hide');

function abrirFecharModal(indice) {
    if(modal[indice].open) {
        modal[indice].close();
        fundoModal.style.display = "none"
    } else {
        modal[indice].showModal();
        fundoModal.style.display = "block"
    }
}

function mudarFoto() {
    const foto = document.getElementsByClassName('edit')[0];
    const fotoEscolhida = ipt_fotoPerfil.files[0]; //retorna array de "fotos" por isso pego na primeira posicao
    if(fotoEscolhida) {
        const imgURL = URL.createObjectURL(fotoEscolhida) //transforma em uma url local para colocar a foto
        foto.style.backgroundImage = `url('${imgURL}')`
    }
}

function preencherDadosUsuario(dados) {
    name_user.innerHTML = dados.nome;
    nickname_user.innerHTML = `@${dados.nomePerfil}`;
    foto_user.style.backgroundImage = `url('../../assets/imgs/${dados.foto || 'sem_imagem_avatar.png'}')`;  
    posicao_game.innerHTML = dados.posicao || "Posição não definida";
    level_player.innerHTML = dados.nivel || "Nível não definido";
    seguidores.innerHTML = dados.seguidores || 0;
    seguindo.innerHTML = dados.seguindo || 0;

    // inputs
    ipt_nome.value = dados.nome;
    ipt_nomePerfil.value = dados.nomePerfil
    select_level.value = dados.nivel
    select_position.value = dados.posicao
    ipt_email.value = dados.email
}

function carregarPerfil() {
    const dadosJson = JSON.parse(sessionStorage.DADOS_USUARIO)[0];
    const params = new URLSearchParams(window.location.search);
    const id = params.get('idUsuario');
    
        fetch(`/usuarios/${dadosJson.id}/${id || false}/buscarPeloid`, {
            method: "GET"
        })
        .then(async resposta => {
            if(resposta.ok) {
                const divButtons = document.getElementById('centraliza-botao');
                const divPosts = document.getElementById('posts');
                let postsText = ``
                const dados = await resposta.json(); 
                preencherDadosUsuario(dados[0]);   
                if(dados[dados.length-1].mensagem != undefined) {
                    divButtons.innerHTML = `
                        <button onclick="seguirJogador(${dadosJson.id},${dados[0].id}, this.innerText)">${dados[0].voceSegue ? "Deixar de seguir" : "Seguir"}</button>
                    `
                }
                if(dados[0].fotoPost != null || dados[0].descPost != null) {
                    dados.forEach(post => {
                        if(post.mensagem != "proprioUsuario") {
                            postsText+=`
                                <div class="post">
                                    <div class="area1-post">
                                        <div class="infoUser">
                                            <img class="foto-user-post" src="../../assets/imgs/${post.foto || 'sem_imagem_avatar.png'}" alt="">
                                            <div class="infos-user-post">
                                                <span>${post.nome}</span>
                                                <span class="arroba">@${post.nomePerfil}</span>
                                                <span class="data_post">• ${post.dtPost}</span>
                                            </div>
                                        </div>
                                        <span id="edit-post">•••</span>
                                    </div>
                                    <div class="descricao_post">${post.descPost}</div>
                                    ${post.fotoPost == "null" ? '' : `<div class="foto_posts"><img src="../../assets/imgs/${post.fotoPost}" alt=""></div>`}
                                    <div class="info-post"><img onclick='carregarDescPost(${post.idPost}, "perfil")' src='../../rede-social/IMAGE/coment-icon.png'> ${post.qtdComentarios}</div>
                                </div>                                             
                            `
                        }
                    })
                }
                divPosts.innerHTML = postsText == "" ? "<h3>Sem posts ainda</h3>" : postsText;

            } else {
                console.error("Erro ao buscar dados do usuário");
                return;                    
            }
        }) 
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
                location.reload(); 
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
    formData.append("foto", ipt_fotoPerfil.files[0] || null);

    if(formData.get('nome') == "" || formData.get('nomePerfil') == "" || formData.get('nivel') == "#" || formData.get('posicao') == "#" || formData.get('email') == "" || formData.get('nivel') == "" || formData.get('posicao') == "") {
        gerarAlerta('Campos em branco!')
    } else if(!/^([A-Z][a-z]+)(\s[A-Z][a-z]+)+$/.test(formData.get('nome'))) {
        gerarAlerta('Insira Nome e Sobrenome com primeira letra maiuscula')
    } else if(formData.get('nomePerfil').length < 5) {
        gerarAlerta('Nome de perfil deve ter no mínimo 5 caracteres')
    } else if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.get('email'))) {
        gerarAlerta(`Insira um e-mail válido`)
    } else {
        fetch(`/usuarios/${id}/atualizar`, {
            method:"PUT",
            body: formData,
        })
        .then(async resposta => {
            if(resposta.ok) {
                const dadosAtualizados = await resposta.json();
                console.log("DADOS ATUALIZADOS: ", dadosAtualizados);
                sessionStorage.DADOS_USUARIO = JSON.stringify(dadosAtualizados);
                location.reload()
            }
        })
        .catch(async erro => {
            const mgsErro = await resposta.text();
            console.log("deu erro", mgsErro);
        })
    }
}

function explorar(elemento) {
    let idUsuario = JSON.parse(sessionStorage.DADOS_USUARIO)[0].id
    let parametro = search_people.value;
    fetch(`/usuarios/${parametro}/${elemento}/explorar`, {
        method: "GET"
    })
    .then(async resposta => {
        let resultadoBusca = await resposta.json();
        let divBusca = document.getElementById('search_result');
        let bodyBusca = document.getElementById('body-search');
        let buscaTexto = ``
        divBusca.style.display = "block";
        resultadoBusca.forEach(busca => {
            if(elemento == "Pessoas") {
                buscaTexto+=`
                    <div class="pessoa-search" onclick="window.location='./perfil-jogador/index.html${busca.id == idUsuario ? "" : `?idUsuario=${busca.id}`}'">
                        <img src="../assets/imgs/${busca.foto || "sem_imagem_avatar.png"}">
                        <div class="pessoa-info-search">
                            <span class="nome_pessoa_search">${busca.nome}</span>
                            <span class="arroba_pessoa_search">@${busca.nomePerfil}</span>
                        </div>
                    </div>                
                `
            } else {
                buscaTexto+=`
                    <div class="posts">
                        <div class="area1-post">
                            <div class="infoUser">
                                <img onclick="window.location='./perfil-jogador/index.html${busca.idUsuario == idUsuario ? "" : `?idUsuario=${busca.idUsuario}`}'" class="foto-user-post" src="../assets/imgs/${busca.fotoUsuario || 'sem_imagem_avatar.png'}" alt="">
                                <div class="infos-user-post">
                                    <span>${busca.nomeUsuario}</span>
                                    <span class="arroba">@${busca.perfilUsuario}</span>
                                    <span class="data_post">• ${busca.dtPost}</span>
                                </div>
                            </div>
                            <span id="edit-post">•••</span>
                        </div>
                        <div class="descricao_post">${busca.postDescricao}</div>
                        ${busca.postFoto == "null" ? '' : `<div class="foto_posts"><img src="../assets/imgs/${busca.postFoto}" alt=""></div>`}
                        <div class="info-post"><img onclick='carregarDescPost(${busca.idPost}, "explorar")' src='../../rede-social/IMAGE/coment-icon.png'> ${busca.qtdComentarios}</div>
                    </div> 
                `
            }
        })
        bodyBusca.innerHTML = buscaTexto;
    })
}


