var postModel = require("../models/postModel");
const { all } = require("../routes/posts");

function publicar(req,res) {
    const foto = req.file.filename;
    const { idUsuario, descPost } = req.body;
    const post = { idUsuario, descPost, foto };
    post.idUsuario = Number(post.idUsuario)
    
    postModel.publicarPost(post).then(resposta => {
        if(resposta.affectedRows == 1) {
            res.status(200).send("Post criado")
        }
    })
    .catch(erro => {
        res.status(401).send("Erro ao criar post");
    })
}
function allPosts(req,res) {
    postModel.allPosts().then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta);
        }
    })
}

module.exports = {
    publicar,
    allPosts
}