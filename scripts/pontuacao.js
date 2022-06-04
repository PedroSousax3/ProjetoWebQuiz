(function () {
    class Pontuacao {
        constructor () {
    
        }

        listarHistoricoPontuacao () {
            const perguntas = JSON.parse(sessionStorage.getItem('perguntas'));
            
            return JSON.parse(sessionStorage.getItem('historico')).map(m => {
                return {
                    historico: m,
                    resposta: m.respostas.map(
                        mR => {
                            return { 
                                pergunta: perguntas.find(f => f.codigo == mR.codigoPergunta), 
                                resposta: mR.resposta 
                            } 
                        }
                    )
                };
            })
        }
    
        listarUltimaPontuacao () {
            return this.listarHistoricoPontuacao().findLast(f => true);
        }
    
        popularUltimaPontuacao () {
            const ultimaPontuacao = this.listarUltimaPontuacao();
            
            return `
                <div>
                    <table>
                        <thead>
                            <tr>Pergunta<tr>
                            <tr>Resposta<tr>
                            <tr>Acertou?</tr>
                        </thead>
                        <tbody>
                            {

                            }
                        </tbody>
                    </table>
                <div>
            `;
        }
    }

    const pontuacao = new Pontuacao();

    console.log(pontuacao.listarUltimaPontuacao());

}())