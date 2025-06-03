var express = require("express");
var upload = require("../config/configUpload")
var router = express.Router();

var postController = require("../controllers/postController");

router.post('/publicar', upload.single('fotoPost'), (req,res)=> {
    postController.publicar(req,res)
})
router.get('/buscar', (req,res)=> {
    postController.allPosts(req,res);
})

router.get('/:idPost/descPost', (req,res) => {
    postController.descPost(req,res);
})

router.post('/comentarPost', upload.single('fotoComentario'), (req,res)=>{
    postController.comentarPost(req,res)
})
module.exports = router;