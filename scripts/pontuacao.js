async () => { await import('./data').then(f => console.log(f)); }

(async function () {
    class Pontuacao {
        #perguntasData;
        #respostasData;
        #historicosData;

        constructor () { 
        }

        async init () {
            await import('./data.js').then(t => {
                this.#perguntasData = new t.Perguntas();
                this.#respostasData = new t.Respostas();
                this.#historicosData = new t.Historico();
            });
        }

        listarHistoricoPontuacao () {
            const perguntas = this.#perguntasData.listarPerguntas(); //JSON.parse(localStorage.getItem('perguntas'));
            return (JSON.parse(localStorage.getItem('historico')) || []).map(m => {
                return {
                    historico: m,
                    dtFinalizacaoQuiz: m.dtFinalizacaoQuiz,
                    qtdRespostasCertas: m.qtdRespostasCertas,
                    respostas: m.respostas.map(
                        mR => {
                            return { 
                                pergunta: perguntas.find(f => f.codigo == mR.codigoPergunta), 
                                resposta: mR.resposta,
                                acertou: mR.resposta == perguntas.find(f => f.codigo == mR.codigoPergunta).alternativaCorreta
                            } 
                        }
                    )
                };
            })
        }
    
        listarUltimaPontuacao () {
            return this.listarHistoricoPontuacao().findLast(f => true);
        }
    
        criarTempleteRespostas(historico) {
            return (
                historico ? historico.respostas.map((m, i) => {
                    console.log(m)
                    return ( 
                        `<div class='containerPeguntaPontuacao ${(m.acertou ? 'fundo-opacity-green' : 'fundo-opacity-red')}'>
                            <div>Pergunta: ${m.pergunta.pergunta}</div>
                            <div style="margin-top: 15px;">
                                <div>Resposta: ${m.pergunta.alternativa.find(f => f.codigo == m.resposta).resposta}</div>
                                ${(m.acertou ? '' : `<div>Resposta correta: ${m.pergunta.alternativa.find(f => f.codigo == m.pergunta.alternativaCorreta).resposta}</div>`)}
                            </div>
                        </div>`
                    );
                }).join('') : 'Nenhuma pontuação foi encontrada.'
            )
        }

        popularTempleteRespostas(historico) {
            document.querySelector('#dvResultado').appendChild(
                document.createRange().createContextualFragment(
                    pontuacao.criarTempleteRespostas(pontuacao.listarUltimaPontuacao(historico))
                )
            );
        
        
            document.querySelector('#dvResultado').querySelectorAll("video, audio").forEach(f => {
                f.removeAttribute('autoplay');
                f.setAttribute('controls', true);
                f.removeAttribute('loop')
            });
        }

        criarTemplateContadorRespostas (historico) {
            if (historico)
                return (`
                    <div id='containerAcertos'>
                        <div>${new Date(historico.dtFinalizacaoQuiz).toLocaleString()}</div>
                        <div>Acertos: ${historico.qtdRespostasCertas} de ${historico.respostas.length}</div>
                    </div>
                `);
            
        }

        popularContadorRespostas(historico) {
            if (historico)
                document.querySelector('#dvContadorAcertos').appendChild(
                    document.createRange().createContextualFragment(
                        this.criarTemplateContadorRespostas(historico)
                    )
                );
        }
    }

    const pontuacao = new Pontuacao();
    await pontuacao.init();
    pontuacao.popularContadorRespostas(pontuacao.listarUltimaPontuacao());
    pontuacao.popularTempleteRespostas(pontuacao.listarUltimaPontuacao());
}())