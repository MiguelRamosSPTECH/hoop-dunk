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
module.exports = router;