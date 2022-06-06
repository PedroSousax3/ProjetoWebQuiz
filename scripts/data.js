export class Utils {
    constructor () {}

    embaralhar (lista) {
        let novaLista = [];
        lista.forEach((elemento, index) => {
            let novaPosicao = parseInt(Math.random() * lista.length);
            novaLista.splice(novaPosicao, 0, elemento);
        });

        return novaLista;
    }
}

export class Historico {
    #perguntas;

    constructor () {
        this.#perguntas = new Perguntas();
    }

    listarHistoricoPontuacao () {
        const perguntas = this.#perguntas.listarPerguntas();
        
        return this.lista().map(m => {
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
        });
    }

    lista () {
        return JSON.parse(localStorage.getItem('historico')) || [];
    }

    listarUltimaPontuacao () {
        return this.listarHistoricoPontuacao().findLast(f => true);
    }
}

export class Perguntas {
    #utils;

    constructor () {
        this.#utils = new Utils();
    }

    embaralharListPeguntas (lista) {
        let ultimo = lista.pop(lista.length - 1);
        let novaLista = this.#utils.embaralhar(lista);
        novaLista.push(ultimo);
        return novaLista;
    }

    carregarPerguntas () {
        try {
            fetch('/assets/dadosIniciais.json')
            .then(function (response) {
                if (response.status == 200)
                return response.json();
                else
                    throw 'Não foi possivel acessar as perguntas';
                }).catch(function (ex) {
                    alert(`Erro:\n${ex}`);
                }).then((dados) => {
                    localStorage.setItem('perguntas', JSON.stringify(this.embaralharListPeguntas(dados)));
                }).catch(function (ex) {
                    console.log(`Erro:\n${ex}`);
                });
        }
        catch (ex) {
            alert(`Erro:\n${ex}`);
        }
    }

    listarPerguntas () {
        return JSON.parse(localStorage.getItem('perguntas')) || [];
    }

    consultarPerguntas (codigoPergunta) {
        return this.listarPerguntas().find(f => f.codigo == parseInt(codigoPergunta));
    } 


}

export class Respostas {
    constructor () {}

    inserir (resposta) {
        let respostas = this.listar();
        respostas.push(resposta);
        localStorage.setItem('respostas', JSON.stringify(respostas));
    }

    listar () {
        return JSON.parse(localStorage.getItem('respostas'));
    } 
}