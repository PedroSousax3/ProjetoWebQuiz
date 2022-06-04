(function () {
    const Quiz = {
        //#region Carregar perguntas
        carregarPerguntas : function () {
            try {
                fetch('/assets/dadosIniciais.json')
                    .then(function (response) {
                        if (response.status == 200)
                            return response.json();
                        else
                            throw 'Não foi possivel acessar as perguntas';
                    }).catch(function (ex) {
                        alert(`Erro:\n${ex}`);
                    }).then(function (dados) {
                        sessionStorage.setItem('perguntas', JSON.stringify(Quiz.embaralharListPeguntas(dados)));
                    }).catch(function (ex) {
                        alert(`Erro:\n${ex}`);
                    });
            }
            catch (ex) {
                alert(`Erro:\n${ex}`);
            }
        },
        //#endregion
    
        //#region Manipular Perguntas e Respostas
        listarPerguntas : () => JSON.parse(sessionStorage.getItem('perguntas')) || [],
        consultarPerguntas: (codigoPergunta) => Quiz.listarPerguntas().find(f => f.codigo == parseInt(codigoPergunta)),
    
        criarTempleteAlternativa: function (id, alternatica) {
            return `<div>\n
                        <input id="rbResposta${id}" type="radio" name="resposta" value="${alternatica.codigo}" />
                        <label for="rbResposta${id}">${alternatica.resposta}</label>
                    </div>`;
        },
    
        listarRespostas : () => JSON.parse(sessionStorage.getItem('respostas')),
    
        inserirRespostar: function (resposta) {
            let respostas = Quiz.listarRespostas();
            respostas.push(resposta);
            sessionStorage.setItem('respostas', JSON.stringify(respostas));
        },
        //#endregion
    
        //#region Templates
        popularTemplatePergunta: function () {
            const codigoPergunta = parseInt(sessionStorage.getItem("codigoPergunta"));
            const containerPergunta = document.getElementById("pergunta");
            const containerAlternativas = document.getElementById("alternativas");
            const pergunta = Quiz.consultarPerguntas(codigoPergunta);
    
            containerPergunta.innerHTML = pergunta.pergunta;
            containerAlternativas.innerHTML = '';

            const alernativas = Quiz.embaralharList(pergunta.alternativa);
            alernativas.forEach((f, i) => {
                containerAlternativas.innerHTML = containerAlternativas.innerHTML + Quiz.criarTempleteAlternativa(i, f);
            });
        },
    
        criarTempleteContadorPergunta: function () {
            let perguntas = Quiz.listarPerguntas();
            let posicaoAtual = perguntas == null ? -1 : perguntas.findIndex(f => f.codigo == parseInt(sessionStorage.getItem("codigoPergunta")));
    
            const elementoContadorQuiz = document.querySelector('#contadorQuiz');
            // document.querySelector('#contadorQuiz').onload = function () {
            //     console.log(Quiz);
            // }
    
            elementoContadorQuiz.style.display = posicaoAtual < 0 ? 'none' : 'block';
            elementoContadorQuiz.innerText = `${posicaoAtual + 1} / ${perguntas.length}`;
        },
        //#endregion
    
        responder: function() {
            try {
                if (parseInt(sessionStorage.getItem("codigoPergunta")) > 0) {
                    let codigoPergunta = parseInt(sessionStorage.getItem("codigoPergunta"));
                    let value;
                    try {
                        value = parseInt(document.getElementById("alternativas").querySelector("input[name=resposta]:checked").getAttribute('value'));
                    }
                    catch (ex) {
                        alert('Selecione uma opção para proceguir.');
                        return false;
                    }
                    Quiz.inserirRespostar({ codigoPergunta : codigoPergunta, resposta : value });
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
                
                const perguntas = Quiz.listarPerguntas();
                let codigoPergunta = parseInt(sessionStorage.getItem('codigoPergunta'));
                let indiceAtual = perguntas.findIndex(f => f.codigo == codigoPergunta);
    
                if (Quiz.responder()) {
                    if ((indiceAtual + 1) == perguntas.length) {
                        Quiz.contarAcertos();
                        rotear('home', 'Início');
                        sessionStorage.setItem('perguntas', JSON.stringify(Quiz.embaralharListPeguntas(Quiz.listarPerguntas())));
                        sessionStorage.setItem('codigoPergunta', Quiz.listarPerguntas()[0].codigo);
                    }
                    else{
                        sessionStorage.setItem('codigoPergunta', perguntas[indiceAtual + 1].codigo);
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
            let perguntas = Quiz.listarPerguntas();
            let respostas = Quiz.listarRespostas();
    
            let qtdRespostasCertas = 
                respostas.filter(f => 
                    perguntas.find(fi => fi.codigo == f.codigoPergunta).alternativaCorreta == f.resposta
                ).length;
    
            let hiostorico = JSON.parse(sessionStorage.getItem('historico')) || [];
            hiostorico.push({
                respostas: respostas,
                qtdRespostasCertas: qtdRespostasCertas,
                dtFinalizacaoQuiz: new Date()
            });
            sessionStorage.setItem(
                'historico',
                JSON.stringify(hiostorico)
            )
    
            return qtdRespostasCertas;
        },
    
        limparQuiz: function () {
            sessionStorage.setItem('codigoPergunta', 0);
            sessionStorage.setItem('acertos', 0);
            sessionStorage.setItem('respostas', '[]');
            sessionStorage.setItem('perguntas', JSON.stringify(Quiz.embaralharListPeguntas(Quiz.listarPerguntas())));
    
            Quiz.carregarPerguntas();
            //Quiz.criarTempleteContadorPergunta();
        },
    
        routerQuiz: function () {
            rotear("quiz", "Quiz");
            Quiz.limparQuiz();
        },
    
        embaralharListPeguntas: function (lista) {
            let ultimo = lista.pop(lista.length - 1);
            let novaLista = Quiz.embaralharList(lista);
            novaLista.push(ultimo);
            return novaLista;
        },

        embaralharList: function (lista) {
            let novaLista = [];
            lista.forEach((elemento, index) => {
                let novaPosicao = parseInt(Math.random() * lista.length);
                novaLista.splice(novaPosicao, 0, elemento);
            });

            return novaLista;
        }
    }

    Quiz.limparQuiz();
    document.querySelector('#btnProximaPergunta').addEventListener('click', Quiz.proximaPergunta);
}());