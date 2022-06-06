function rotear (page, nome, callback = null) {
    if (!!page) {
        localStorage.setItem('page', page || 'home');
        localStorage.setItem('name', nome || 'Início');
    }
    let path = `${window.location.origin}/pages/${localStorage.getItem('page') || 'home'}.html`;

    fetch(path, { 
        method: 'GET',
        //cache: 'force-cache'
    })
    .then((resp) => resp.text())
    .then(function (content) {
        document.title = localStorage.getItem('name') || "Início";
        document.getElementById("conteudo").style.marginTop = `${document.getElementById("menu-top").getBoundingClientRect().height}px`;
        document.getElementById("conteudo").innerHTML = '';
        document.getElementById("conteudo").appendChild(
            document.createRange().createContextualFragment(content)
        );
        if (callback)
            callback();
    });

    document.getElementById("nvMenuTopMobile").style.display = 'none';
}

function gerenciarMenu () {
    let elemento = document.getElementById("nvMenuTopMobile");
    if (window.innerWidth <= 575){
        elemento.style.display = elemento.style.display == 'none' ? 'flex' : 'none';
    }
    else
        elemento.style.display = 'none';
}