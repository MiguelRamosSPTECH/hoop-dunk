
function kpiDadosUsuarios() {
    fetch('/dash/dadosDash', {
        method: "GET"
    })
    .then(async resposta => {
        if(resposta.ok) {
            const divKpis = document.getElementById('area-kpi');
            const dados = await resposta.json();
            let dadosText = ``
            for(let i=0;i<dados.length;i++) {
                let nomeKpi = ``
                let fotoKpi = ``
                if(i == 0){
                    nomeKpi = `Usuários Cadastrados`
                    fotoKpi = `person-dash.png`
                } else if(i == 1) {
                    nomeKpi = `Eventos Cadastrados`
                    fotoKpi = `game-dash.png`
                } else if(i == 2) {
                    nomeKpi = `Quadras Cadastradas`
                    fotoKpi = `quadra-dash.png`
                } else {
                    nomeKpi = `Taxa de Participações por Jogo`
                    fotoKpi = `mediaPlayer-dash.png`
                }
                if(dados[i].porcentagem == null) {
                    dados[i].porcentagem = 100
                }
                dadosText+=`
                    <div class="kpi">
                        <div class="title-kpi">
                            <div class="content-image">
                                <img src="../IMAGE/${fotoKpi}" alt="">
                            </div>
                            <span ${i == 3 ? `style="width:70% !important"` : ``}>${nomeKpi}</span>
                        </div>
                        <div class="body-kpi">
                            <div class="first-infos">
                                <div class="infos">
                                    <span class="title-info">ÚLTIMO MÊS</span>
                                    <span class="info">${dados[i].mesPassado}</span>
                                </div>
                                <div class="infos">
                                    <span class="title-info">MÊS ATUAL</span>
                                    <span class="info">${dados[i].totalMesAtual} <span style="${dados[i].porcentagem <= 0 ? "color:red !important" : "color:green"}" class="porcent">${dados[i].porcentagem}%</span></span>
                                </div>                                
                            </div>
                                <div class="infos" ${i == 3 ? `style="opacity: 0 !important;"` : ``}>
                                    <span class="title-info">TOTAL</span>
                                    <span class="info">${dados[i].total}</span>
                                </div>                             
                        </div>
                    </div>                
                `
            }
            divKpis.innerHTML = dadosText;
        }
    })
}

function buscarFluxoUsuarios() {
    let tipoFiltro = filtroGrafico.value;
    if(tipoFiltro == "5 month") {
        text_filtro.innerText = "6 meses"
    } else if(tipoFiltro == "1 year") {
        text_filtro.innerText = "1 ano"
    } else {
        text_filtro.innerText = "3 meses"
    }
    fetch(`/dash/fluxoUsuarios/${tipoFiltro}`, {
        method: "GET",
    })
    .then(async resposta => {
        if(resposta.ok) {
            let dadosFluxo = await resposta.json();
            plotarGraficoLinha(dadosFluxo)
        }
    })
}

var myChart;
function plotarGraficoLinha(dados) {
    var meses = []
    var usuarios = []
    var maiorDado = 0
    for(let i=0;i<dados.length;i++) {
        meses.push(dados[i].anoMes)
        usuarios.push(dados[i].qtdUsuarios)
        if(dados[i].qtdUsuarios > maiorDado) {
            maiorDado = dados[i].qtdUsuarios;
        }
    }

    let ctx = document.getElementById('fluxo-usuarios').getContext('2d');
    if(myChart) {
        myChart.destroy()
    }
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets:[{
                data: usuarios,
                backgroundColor: [
                  '#eaad59', // Cor de fundo das linhas
                ],        
                borderColor: [
                    '#eaad59'
                ]       , 
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: maiorDado+5
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })
}

function tipoJogadoresEvento() {
    fetch('/dash/tipoJogadoresEvento', {
        method: "GET"
    })
    .then(async resposta => {
        const dados = await resposta.json();
        plotarGraficoPizza(dados);
    })
}
var graficoPizza;
function plotarGraficoPizza(dados) {
    var tipos = []
    let jogadores = []

    for(let i=0;i<dados.length;i++) {
        tipos.push(dados[i].tipoJogador)
        jogadores.push(dados[i].qtdUsuarios);
    }
    if(graficoPizza) {
        graficoPizza.destroy()
    }
    let ctx = document.getElementById('tipo-jogadores').getContext('2d');
    graficoPizza = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: tipos,
            datasets: [{
            data: jogadores,
            backgroundColor: [
                '#0559d4',
                '#b4926b',
            ],
            hoverOffset: 4,
            borderWidth: 0
            }]
        }
    });
}