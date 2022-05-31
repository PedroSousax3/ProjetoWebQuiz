//#region Carregar perguntas
function carregarPerguntas() {
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
                sessionStorage.setItem('perguntas', JSON.stringify(embaralharList(dados)));
            }).catch(function (ex) {
                alert(`Erro:\n${ex}`);
            });
    }
    catch (ex) {
        alert(`Erro:\n${ex}`);
    }
}
//#endregion

//#region Manipular Perguntas e Respostas
const listarPerguntas = () => JSON.parse(sessionStorage.getItem('perguntas')) || [];
const consultarPerguntas = (codigoPergunta) => listarPerguntas().find(f => f.codigo == parseInt(codigoPergunta));

function criarTempleteAlternativa(id, alternatica) {
    return `<div>\n
                <input id="rbResposta${id}" type="radio" name="resposta" value="${alternatica.codigo}" />
                <label for="rbResposta${id}">${alternatica.resposta}</label>
            </div>`;
}

const listarRespostas = () => JSON.parse(sessionStorage.getItem('respostas'));

function inserirRespostar(resposta) {
    let respostas = listarRespostas();
    respostas.push(resposta);
    sessionStorage.setItem('respostas', JSON.stringify(respostas));
}
//#endregion

//#region Templates
function popularTemplatePergunta() {
    const codigoPergunta = parseInt(sessionStorage.getItem("codigoPergunta"));
    const containerPergunta = document.getElementById("pergunta");
    const containerAlternativas = document.getElementById("alternativas");
    const pergunta = consultarPerguntas(codigoPergunta);

    containerPergunta.innerHTML = pergunta.pergunta;
    containerAlternativas.innerHTML = '';
    pergunta.alternativa.forEach((f, i) => {
        containerAlternativas.innerHTML = containerAlternativas.innerHTML + criarTempleteAlternativa(i, f);
    });
}

function criarTempleteContadorPergunta() {
    let perguntas = listarPerguntas();
    let posicaoAtual = perguntas == null ? -1 : perguntas.findIndex(f => f.codigo == parseInt(sessionStorage.getItem("codigoPergunta")));

    const elementoContadorQuiz = document.querySelector('#contadorQuiz');
    // document.querySelector('#contadorQuiz').onload = function () {
    //     console.log(this);
    // }

    elementoContadorQuiz.style.display = posicaoAtual < 0 ? 'none' : 'block';
    elementoContadorQuiz.innerText = `${posicaoAtual + 1} / ${perguntas.length}`;
}
//#endregion

function responder() {
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
            inserirRespostar({ codigoPergunta : codigoPergunta, resposta : value });
        }
    }
    catch (ex) {
        throw ex;
    }

    return true;
}

function proximaPergunta() {
    try {
        let btnProximaPergunta = document.getElementById('btnProximaPergunta');
        btnProximaPergunta.innerText = 'PROXIMO';
        
        const perguntas = listarPerguntas();
        let codigoPergunta = parseInt(sessionStorage.getItem('codigoPergunta'));
        let indiceAtual = perguntas.findIndex(f => f.codigo == codigoPergunta);

        if (responder()) {
            if ((indiceAtual + 1) == perguntas.length) {
                contarAcertos();
                rotear('home', 'Início');
                sessionStorage.setItem('perguntas', JSON.stringify(embaralharList(listarPerguntas())));
                sessionStorage.setItem('codigoPergunta', listarPerguntas()[0].codigo);
            }
            else{
                sessionStorage.setItem('codigoPergunta', perguntas[indiceAtual + 1].codigo);
                popularTemplatePergunta();
            }
        }

        criarTempleteContadorPergunta();
    }
    catch (ex) {
        alert(`Erro:\n${ex}`);
    }
}

function contarAcertos () {
    let perguntas = listarPerguntas();
    let respostas = listarRespostas();

    let qtdRespostasCertas = 
        respostas.filter(f => 
            perguntas.find(fi => fi.codigo == f.codigoPergunta).alternativaCorreta == f.resposta
        ).length;
    return qtdRespostasCertas;
}

function limparQuiz() {
    sessionStorage.setItem('codigoPergunta', 0);
    sessionStorage.setItem('acertos', 0);
    sessionStorage.setItem('respostas', '[]');
    sessionStorage.setItem('perguntas', JSON.stringify(embaralharList(listarPerguntas())));

    carregarPerguntas();
    criarTempleteContadorPergunta();
}

function routerQuiz() {
    rotear("quiz", "Quiz");
    limparQuiz();
}

function embaralharList (lista) {
    let novaLista = [];
    lista.forEach((elemento, index) => {
        const novaPosicao = parseInt(Math.random() * (10 ^ String(lista.length).length));
        novaLista.splice(novaPosicao, 0, elemento);
    });
    return novaLista;
}