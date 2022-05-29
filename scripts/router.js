function rotear (page, nome, callback = null) {
    if (!!page) {
        sessionStorage.setItem('page', page || 'home');
        sessionStorage.setItem('name', nome || 'Início');
    }
    let path = `${window.location.origin}/pages/${sessionStorage.getItem('page') || 'home'}.html`;

    fetch(path, { 
        method: 'GET',
        //cache: 'force-cache'
    })
    .then((resp) => resp.text())
    .then(function (content) {
        document.title = sessionStorage.getItem('name') || "Início";
        document.getElementById("conteudo").style.marginTop = `${document.getElementById("menu-top").getBoundingClientRect().height}px`;
        document.getElementById("conteudo").innerHTML = '';
        document.getElementById("conteudo").appendChild(
            document.createRange().createContextualFragment(content)
        );
        if (callback)
            callback();
    });

    gerenciarMenu();
}

function gerenciarMenu () {
    let elemento = document.getElementById("nvMenuTopMobile");
    if (window.innerWidth <= 575){
        elemento.style.display = elemento.style.display == 'none' ? 'flex' : 'none';
    }
    else
        elemento.style.display = 'none';
}