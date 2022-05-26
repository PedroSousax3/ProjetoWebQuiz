function rotear (page, nome) {
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
        document.getElementById("conteudo").style.marginTop = `${document.getElementById("menu-top").getBoundingClientRect().height}px`;
        document.getElementById("conteudo").innerHTML = content;
        document.title = sessionStorage.getItem('name') || "Início";
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