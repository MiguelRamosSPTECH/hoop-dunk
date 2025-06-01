function kpiDadosUsuarios() {
    fetch('/usuarios/dadosDash', {
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
                                    <span class="info">${dados[i].totalMesAtual} <span style="${dados[i].porcentagem < 0 ? "color:red !important" : "color:green"}" class="porcent">${dados[i].porcentagem}%</span></span>
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