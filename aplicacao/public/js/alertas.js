async function gerarAlerta(mensagem, sucesso) {
    //criando elemento
    const alerta = document.createElement('div')
    alerta.className = 'div_alerta';
    if(sucesso) {
        alerta.style.backgroundColor = "green";
    }
    const img = document.createElement('img');
    img.src = `../IMAGE/icon-erro-card.png`

    const texto = document.createElement('span');
    texto.textContent = mensagem;
    
    //adiciono na div alerta os elementos filhos img e texto
    alerta.appendChild(img);
    alerta.appendChild(texto);
    document.body.appendChild(alerta); //adiciono essa div no meu html
    
    setTimeout(() => 
        alerta.remove()
    ,2000)        

}