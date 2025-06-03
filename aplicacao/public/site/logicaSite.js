
const menuHamburguer = document.getElementById('menu-hamburguer')
const menuLateral = document.getElementById('menu-lateral');
function carregarMenuLateral() {
    if(menuLateral.style.display == "none") {
        menuLateral.style.display = "flex"
        menuHamburguer.src = `../../rede-social/IMAGE/close-icon.png`
        menuHamburguer.style.position = "fixed"
        menuHamburguer.style.width = "25px"
    } else {
        menuLateral.style.display = "none"
        menuHamburguer.style.position = "relative"
        menuHamburguer.style.width = "35px"
        menuHamburguer.src = `./IMAGE/menu-hamburguer.png`
    }
}
function tocarMusica() {
    const audio = new Audio();
    audio.src = `../rede-social/musicas/Drake - Laugh Now Cry Later (Official Music Video) ft. Lil Durk.mp3`
    audio.volume = 0.005
    audio.play() 
}