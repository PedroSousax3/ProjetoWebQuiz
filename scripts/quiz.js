(async function () {
    const data = await import('./data.js');
    const perguntasData = new data.Perguntas();
    const respostasData = new data.Respostas();

    const Quiz = {    
        //#region Template alternativas
        criarTempleteAlternativa: function (id, alternatica) {
            return `<div>\n
                        <input id="rbResposta${id}" type="radio" name="resposta" value="${alternatica.codigo}" />
                        <label for="rbResposta${id}">${alternatica.resposta}</label>
                    </div>`;
        },
        //#endregion
    
        //#region Templates
        popularTemplatePergunta: function () {
            const codigoPergunta = parseInt(localStorage.getItem("codigoPergunta"));
            const containerPergunta = document.getElementById("pergunta");
            const containerAlternativas = document.getElementById("alternativas");
            const pergunta = perguntasData.consultarPerguntas(codigoPergunta);
    
            containerPergunta.innerHTML = pergunta.pergunta;
            containerAlternativas.innerHTML = '';

            const alernativas = perguntasData.embaralharListPeguntas(pergunta.alternativa);
            alernativas.forEach((f, i) => {
                containerAlternativas.innerHTML = containerAlternativas.innerHTML + Quiz.criarTempleteAlternativa(i, f);
            });
        },
    
        criarTempleteContadorPergunta: function () {
            let perguntas = perguntasData.listarPerguntas();
            let posicaoAtual = perguntas == null ? -1 : perguntas.findIndex(f => f.codigo == parseInt(localStorage.getItem("codigoPergunta")));
    
            const elementoContadorQuiz = document.querySelector('#contadorQuiz');
    
            elementoContadorQuiz.style.display = posicaoAtual < 0 ? 'none' : 'block';
            elementoContadorQuiz.innerText = `${posicaoAtual + 1} / ${perguntas.length}`;
        },
        //#endregion
    
        responder: function() {
            try {
                if (parseInt(localStorage.getItem("codigoPergunta")) > 0) {
                    let codigoPergunta = parseInt(localStorage.getItem("codigoPergunta"));
                    let value;
                    try {
                        value = parseInt(document.getElementById("alternativas").querySelector("input[name=resposta]:checked").getAttribute('value'));
                    }
                    catch (ex) {
                        alert('Selecione uma opção para proceguir.');
                        return false;
                    }
                    respostasData.inserir({ codigoPergunta : codigoPergunta, resposta : value });
                }
            }
            catch (ex) {
                throw ex;
            }
    
            return true;
        },
    
        proximaPergunta: function () {
            try {
                let btnProximaPergunta = document.getElementById('btnProximaPergunta');
                btnProximaPergunta.innerText = 'PROXIMO';
                
                const perguntas = perguntasData.listarPerguntas();
                let codigoPergunta = parseInt(localStorage.getItem('codigoPergunta'));
                let indiceAtual = perguntas.findIndex(f => f.codigo == codigoPergunta);
    
                if (Quiz.responder()) {
                    if ((indiceAtual + 1) == perguntas.length) {
                        Quiz.contarAcertos();
                        rotear('home', 'Início');
                        localStorage.setItem('perguntas', JSON.stringify(perguntasData.embaralharListPeguntas(perguntasData.listarPerguntas())));
                        localStorage.setItem('codigoPergunta', perguntasData.listarPerguntas()[0].codigo);
                    }
                    else{
                        localStorage.setItem('codigoPergunta', perguntas[indiceAtual + 1].codigo);
                        Quiz.popularTemplatePergunta();
                    }
                }
    
                Quiz.criarTempleteContadorPergunta();
            }
            catch (ex) {
                alert(`Erro:\n${ex}`);
            }
        },
    
        contarAcertos: function () {
            let perguntas = perguntasData.listarPerguntas();
            let respostas = respostasData.listar();
    
            let qtdRespostasCertas = 
                respostas.filter(f => 
                    perguntas.find(fi => fi.codigo == f.codigoPergunta).alternativaCorreta == f.resposta
                ).length;
    
            let hiostorico = JSON.parse(localStorage.getItem('historico')) || [];
            hiostorico.push({
                respostas: respostas,
                qtdRespostasCertas: qtdRespostasCertas,
                dtFinalizacaoQuiz: new Date()
            });
            localStorage.setItem(
                'historico',
                JSON.stringify(hiostorico)
            )
    
            return qtdRespostasCertas;
        },
    
        limparQuiz: function () {
            localStorage.setItem('codigoPergunta', 0);
            localStorage.setItem('acertos', 0);
            localStorage.setItem('respostas', '[]');
            perguntasData.carregarPerguntas();
        },
    
        routerQuiz: function () {
            rotear("quiz", "Quiz");
            Quiz.limparQuiz();
        }
    }

    Quiz.limparQuiz();
    document
        .querySelector('#btnProximaPergunta')
        .addEventListener(
            'click', 
            Quiz.proximaPergunta
        );
}());