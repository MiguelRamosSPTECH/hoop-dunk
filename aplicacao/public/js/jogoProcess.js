const btnJogo = document.getElementById('addJogo');
const modal = document.getElementById('modal');
const backgroundModal = document.getElementById('hide');
const btnCloseModal = document.getElementById('close-modal');
btnJogo.addEventListener('click', ()=> {
    modal.showModal()
    backgroundModal.style.display = "block"
})

btnCloseModal.addEventListener('click', ()=> {
    modal.close()
    backgroundModal.style.display = "none"
})

async function carregarJogos() {
    fetch('/jogos/buscar', {
        method: "GET"
    })
    .then(async resposta => {
        const allJogos = await resposta.json();
        let contentJogos = ``
        allJogos.forEach(jogo => {
            let trataData = jogo.dtHoraComeco.split("T")[0].split("-");
            trataData = `${trataData[2]}/${trataData[1]}/${trataData[0]}`
            contentJogos+= `
            <tr class="linha-table">
                <td><img src="../IMAGE/icon-ball-game.png" class="icon-game"></td>
                    <td class="nome-infos-game">
                        <span>${jogo.nome}</span>
                        <div class="categorias-game">
                            <div class="categoria">${jogo.nivelJogo}</div>
                            <div class="categoria">${jogo.modalidade}</div>
                        </div>
                    </td>
                <td>${trataData}</td>
                <td id="localizacao-jogo">${jogo.localizacao}</td>
                <td><button>Ver detalhes</button></td>
            </tr>
            `
        })
        table_jogos.innerHTML+= contentJogos;
    })
}

function carregarQuadrasJogo() {
    fetch('/quadras/buscar', {
        method: "GET"
    })
    .then(async resposta => {
        if(resposta.ok) {
            const quadras = await resposta.json();
            if(quadras) {
                var allQuadras = ``
                quadras.forEach(quadra => {
                    allQuadras+=`
                        <option value="${quadra.id}">${quadra.nome}</option>               
                    `
                });
            }
            select_quadras.innerHTML+= allQuadras

        }
    })
}

function trataData(data) {
    if(data[0] == "") {
        return;
    }
    let trataHora = data[2].split("T");
    let dataTratada = `${data[0]}-${data[1]}-${trataHora[0]} ${trataHora[1]}:00`
    let segundos = (Number(trataHora[1].split(":")[0])*3600) + (Number(trataHora[1].split(":")[1]) *60)
    return [dataTratada, segundos];
}

function cadastrarJogo() { 
    let idUsuarioCriador = JSON.parse(sessionStorage.DADOS_USUARIO)[0].id;
    let nomeJogo = ipt_nome_jogo.value;
    let quadraSelecionada = select_quadras.value;
    let slctModalidade = select_modalidade.value;
    let iptDesc = ipt_desc.value;
    let horaComeco = (ipt_hora_inicio.value).split("-");
    let horaFinal = (ipt_hora_final.value).split("-");
    const dtComeco = trataData(horaComeco)
    const dtFinal = trataData(horaFinal);

    let dataAtual = new Date().toLocaleDateString().split("/");

    if(nomeJogo == "" || quadraSelecionada == "#" || horaComeco[0] == "" || horaFinal[0] == "" || slctModalidade == "" || iptDesc == "") {
        gerarAlerta("Preencha todos os campos!")
    } else if(nomeJogo.length < 6 || nomeJogo.length > 17) {
        gerarAlerta("Nome deve conter entre 6 a 15 caracteres!")
    } else if(Number(dataAtual[2]) > Number(horaComeco[0]) || Number(dataAtual[1]) > Number(horaComeco[1]) || Number(dataAtual[0]) > Number(horaComeco[2].split("T")[0])) {
        gerarAlerta("Insira uma data válida")
    } else if (horaComeco[2].split("T")[0] != horaFinal[2].split("T")[0] || horaComeco[1] != horaFinal[1] || horaComeco[0] != horaFinal[0]) {
        gerarAlerta("O jogo deve ser no mesmo dia!")
    } else if(dtFinal[1] - dtComeco[1] < 7200) {
        gerarAlerta("O jogo deve durar no mínimo 2 horas!")
    } else if(iptDesc.length < 30 || iptDesc.length > 150) {
        gerarAlerta("Descrição do jogo deve conter entre 30 a 150 caracteres!")
    } else {
        const jogo = {
            nome: nomeJogo,
            modalidade: slctModalidade,
            idUsuario: idUsuarioCriador,
            dtHoraComeco: dtComeco[0],
            dtHoraEncerramento: dtFinal[0],
            idQuadra: Number(quadraSelecionada),
            observacao: iptDesc
        }

        fetch(`/jogos/cadastrar`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(jogo)
        })
        .then(async resposta => {
            if(resposta.ok) {
                gerarAlerta("Jogo criado com sucesso!", true);
                // achar forma de recarregar página
            } else {
                const msgErro = await resposta.text()
                gerarAlerta(msgErro);
            }
        })
    }

      
}