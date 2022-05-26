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
                sessionStorage.setItem('perguntas', JSON.stringify(dados));
            }).catch(function (ex) {
                alert(`Erro:\n${ex}`);
            });
    }
    catch (ex) {
        alert(`Erro:\n${ex}`);
    }
}

function listarPerguntas() {
    return JSON.parse(sessionStorage.getItem('perguntas'));
}

function consultarPerguntas(codigoPergunta) {
    return listarPerguntas().find(f => f.codigo == parseInt(codigoPergunta));
}

function criarTempleteAlternativa(alternatica) {
    return `<div>\n<input type="radio" name="resposta" value="${alternatica.codigo}" /><label>${alternatica.resposta}</label></div>`
}

function popularTela() {
    let codigoPergunta = parseInt(sessionStorage.getItem("codigoPergunta"));
    let containerPergunta = document.getElementById("pergunta");
    let containerAlternativas = document.getElementById("alternativas");
    let pergunta = consultarPerguntas(codigoPergunta);
    console.log(pergunta, codigoPergunta)
    containerPergunta.innerHTML = pergunta.pergunta;
    containerAlternativas.innerHTML = '';
    pergunta.alternativa.forEach(f => {
        containerAlternativas.innerHTML = containerAlternativas.innerHTML + criarTempleteAlternativa(f);
    });
}

function proximaPergunta() {
    try {
        let btnProximaPergunta = document.getElementById('btnProximaPergunta');
        btnProximaPergunta.innerText = 'PROXIMO';
        if (parseInt(sessionStorage.getItem('codigoPergunta')) == (listarPerguntas().length)) {
            rotear("home", "Início");
            sessionStorage.setItem('codigoPergunta', 0);
        }
        else{
            sessionStorage.setItem('codigoPergunta', parseInt(sessionStorage.getItem('codigoPergunta')) + 1);
            popularTela();
        }
    }
    catch (ex) {
        alert(`Erro:\n${ex}`);
    }
}

function verificarAcerto() {
    let codigoPergunta = parseInt(sessionStorage.getItem("codigoPergunta"));
    let pergunta = consultarPerguntas(codigoPergunta);
    let value = parseInt(document.getElementById("alternativas").querySelector("input[name=resposta]:checked").getAttribute('value'));
}

function routerQuiz() {
    rotear("quiz", "Quiz");
    sessionStorage.setItem('codigoPergunta', 0);
    sessionStorage.setItem('acertos', 0);
    carregarPerguntas();
}