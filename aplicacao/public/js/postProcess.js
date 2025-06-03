
function mudarFotoPost() {
    const fotoPost = ipt_foto_post.files[0]
    if(fotoPost) {
        const imagePost = document.getElementById('foto_post');
        const imgURL = URL.createObjectURL(fotoPost)
        imagePost.style.display = "block"
        imagePost.style.backgroundImage = `url('${imgURL}')`
    }
}

function publicarPost() {
    const descPost = document.getElementById('desc-post').value;
    const fotoPost = ipt_foto_post.files[0] || null;
    const formData = new FormData();
    formData.append("idUsuario", JSON.parse(sessionStorage.DADOS_USUARIO)[0].id);
    formData.append("descPost", descPost)
    formData.append("fotoPost", fotoPost);
    if(formData.get("descPost").length == 0 && fotoPost == null) {
        gerarAlerta("Post sem conteúdo")
    } else {
        fetch('/posts/publicar', {
            method: "POST",
            body: formData
        })
        .then(resposta => {
            if(resposta.ok) {
                location.reload()
            }
        })
    }
}

function allPosts() {
    fetch('/posts/buscar', {
        method: "GET"
    })
    .then(async resposta => {
        const allPosts = await resposta.json();
        let divAllPosts = document.getElementById('posts-all');
        let textoPosts = ``

        allPosts.forEach(post => {
            textoPosts+=`
            <div class="posts">
                <div class="area1-post">
                    <div class="infoUser">
                        <img onclick="window.location='./perfil-jogador/index.html${post.idUsuario == JSON.parse(sessionStorage.DADOS_USUARIO)[0].id ? "" : `?idUsuario=${post.idUsuario}`}'" class="foto-user-post" src="../assets/imgs/${post.fotoUsuario || 'sem_imagem_avatar.png'}" alt="">
                        <div class="infos-user-post">
                            <span>${post.nomeUsuario}</span>
                            <span class="arroba">@${post.perfilUsuario}</span>
                            <span class="data_post">• ${post.dtPost}</span>
                        </div>
                    </div>
                     <span id="edit-post">•••</span>
                </div>
                <div class="descricao_post">${post.postDescricao}</div>
                ${post.postFoto == "null" ? '' : `<div class="foto_posts"><img src="../assets/imgs/${post.postFoto}" alt=""></div>`}
                <div class="info-post"><img onclick='carregarDescPost(${post.idPost}, "feed")' src='../../rede-social/IMAGE/coment-icon.png'> ${post.qtdComentarios}</div>
            </div>            
            `
        })
        divAllPosts.innerHTML+=textoPosts;
    })
}

function carregarDescPost(idPost, pagina) {
    if(pagina == "feed" || pagina == "area-posts") { //outra gambiarra kkkkkkkkkk
        pagina = "area-posts"
    } else if(pagina == "explorar" || pagina == "search-explorar") {
        pagina = "search-explorar"
    } else {
        pagina = "feed"      
        window.location = `../index.html?idPost=${idPost}`
    }
    let divPosts = document.getElementById(`${pagina}`);
    const fotoUser = JSON.parse(sessionStorage.DADOS_USUARIO)[0].foto

    fetch(`/posts/${idPost}/descPost`, {
        method: "GET"
    })
    .then(async resposta => {
        const descPost = await resposta.json();
        divPosts.style.overflow = "auto";
        divPosts.style.scrollbarWidth = "none"

        console.log(descPost[0])
        divPosts.innerHTML = `
            <div class="posts">
                <div class="area1-post">
                    <div class="infoUser">
                        <img onclick="window.location='./perfil-jogador/index.html${descPost[0].idCPost == JSON.parse(sessionStorage.DADOS_USUARIO)[0].id ? "" : `?idUsuario=${descPost[0].idCPost}`}'" class="foto-user-post" src="../assets/imgs/${descPost[0].fotoCPost || 'sem_imagem_avatar.png'}" alt="">
                        <div class="infos-user-post">
                            <span>${descPost[0].nomeCPost}</span>
                            <span class="arroba">@${descPost[0].perfilCPost}</span>
                            <span class="data_post">• ${descPost[0].dtPost}</span>
                        </div>
                    </div>
                     <span id="edit-post">•••</span>
                </div>
                <div class="descricao_post">${descPost[0].descPost}</div>
                ${descPost[0].fotoPost == "null" ? '' : `<div class="foto_posts"><img src="../assets/imgs/${descPost[0].fotoPost}" alt=""></div>`}
                <div class="info-post"><img src='../../rede-social/IMAGE/coment-icon.png'> ${descPost[0].qtdComentarios}</div>
            </div>  
            
            <div class="area-send-post">
                <div class="content-post">
                    <div class="foto-perfil post" style="background-image: url('../../assets/imgs/${fotoUser || 'sem_imagem_avatar.png'}')!important;width:58px;height:55px"></div>
                    <textarea maxlength="43" id="desc-post" onkeyup="atualizaButton()" rows="1" placeholder="We’re gonna be championships!"></textarea>
                </div>
                <div id="foto_post"></div>
                <div id="functions-post">
                    <label for="ipt_foto_post">
                        <img id="send-photo" src="IMAGE/picture-icon.png" alt="">
                    </label>
                    <input onchange="mudarFotoPost()" type="file" id="ipt_foto_post">
                    <button id="send_post" class="comment" onclick="comentar(${idPost}, '${pagina}')">Responder</button>
                </div>
            </div>    
            
            <div id="comments-all"></div>
        `

        const divComentarios = document.getElementById('comments-all');
        let textoComentarios = ``
        if(descPost[0].idComentador != null) {
            descPost.forEach(desc => {
                textoComentarios+=`
                    <div class="posts">
                        <div class="area1-post">
                            <div class="infoUser">
                                <img onclick="window.location='./perfil-jogador/index.html${desc.idComentador == JSON.parse(sessionStorage.DADOS_USUARIO)[0].id ? "" : `?idUsuario=${desc.idComentador}`}'" class="foto-user-post" src="../assets/imgs/${desc.fotoComentador || 'sem_imagem_avatar.png'}" alt="">
                                <div class="infos-user-post">
                                    <span>${desc.nomeComentador}</span>
                                    <span class="arroba">@${desc.perfilComentador}</span>
                                    <span class="data_post">• ${desc.dtComentario}</span>
                                </div>
                            </div>
                            <span id="edit-post">•••</span>
                        </div>
                        <div class="descricao_post">${desc.descComentario}</div>
                        ${desc.fotoComentario == "null" ? '' : `<div class="foto_posts"><img src="../assets/imgs/${desc.fotoComentario}" alt=""></div>`}
                    </div>                     
                `
            })
        }
        divComentarios.innerHTML = textoComentarios;
    })
}

function comentar(idPost, pagina) {
    const descComment = document.getElementById('desc-post').value;
    const fotoComment = ipt_foto_post.files[0] || null;
    const formData = new FormData();
    formData.append("idUsuario", JSON.parse(sessionStorage.DADOS_USUARIO)[0].id);
    formData.append("descComentario", descComment);
    formData.append("fotoComentario", fotoComment);
    formData.append("idPost", idPost);
    if(formData.get("descComentario").length == 0 && fotoComment == null) {
        gerarAlerta("Comentário sem conteúdo")
    } else {
        fetch('/posts/comentarPost', {
            method: "POST",
            body:formData
        })
        .then(async resposta => {
            if(resposta.ok) {
                carregarDescPost(idPost, pagina);
            }
        })
    }    
}