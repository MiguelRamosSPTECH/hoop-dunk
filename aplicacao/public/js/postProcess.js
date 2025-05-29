
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
    const fotoPost = ipt_foto_post.files[0];
    const formData = new FormData();
    formData.append("idUsuario", JSON.parse(sessionStorage.DADOS_USUARIO)[0].id);
    formData.append("descPost", descPost)
    formData.append("fotoPost", fotoPost);

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

function allPosts() {
    fetch('/posts/buscar', {
        method: "GET"
    })
    .then(async resposta => {
        const allPosts = await resposta.json();
        let divAllPosts = document.getElementById('posts-all');
        let textoPosts = ``

        allPosts.forEach(post => {
            let dataFormatada = post.dtPost.split("T")[0].split("-");
            dataFormatada = `${dataFormatada[2]}/${dataFormatada[1]}/${dataFormatada[0]}`
            textoPosts+=`
            <div class="posts">
                <div class="area1-post">
                    <div class="infoUser">
                        <img onclick="window.location='./perfil-jogador/index.html?idUsuario=${post.idUsuario}'" class="foto-user-post" src="../assets/imgs/${post.fotoUsuario || 'sem_imagem_avatar.png'}" alt="">
                        <div class="infos-user-post">
                            <span>${post.nomeUsuario}</span>
                            <span class="arroba">@${post.perfilUsuario}</span>
                        </div>
                    </div>
                    <span class="data_post">${dataFormatada}</span>
                </div>
                <div class="descricao_post">${post.postDescricao}</div>
                <div class="foto_posts"><img src="../assets/imgs/${post.postFoto}" alt=""></div>
            </div>            
            `
        })
        divAllPosts.innerHTML+=textoPosts;
    })
}