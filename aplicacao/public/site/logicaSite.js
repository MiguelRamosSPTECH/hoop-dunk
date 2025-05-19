function carregarMenuLateral() {
    const menuHamburguer = document.getElementById('menu-hamburguer')
    const menuLateral = document.getElementById('menu-lateral');
    if(menuLateral.style.display == "none") {
        menuLateral.style.display = "flex"
        menuHamburguer.src = `../../rede-social/IMAGE/close-icon.png`
    } else {
       menuLateral.style.display = "none"
       menuHamburguer.src = `./IMAGE/menu-hamburguer.png`
    }
}