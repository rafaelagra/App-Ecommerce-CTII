//guardo em duas variáveis qual tela está aparecendo agora e qual apareceu antes
//preciso disso para o botão "voltar" saber para onde voltar
//usei "let" porque esses valores vão mudar
let telaAnterior = 'tela-home'
let telaAtual = 'tela-home'

//essa função troca a tela visível. O destino é o id da tela que eu quero mostrar
function navegar(destino) {
    //pego todas as telas de uma vez pela classe "tela"
    //getElementsByClassName devolve uma coleção, e eu uso Array.from para tranformar em array e poder usar o forEach
    let telas = document.getElementsByClassName('tela')

    //percorro cada tela e escondo todas: tiro "show" e coloco "collapse"
    Array.from(telas).forEach(tela => {
        tela.classList.remove('show')
        tela.classList.add('collapse')
    })

    //agora eu mostro só a tela de destino: tiro "collapse" e coloco "show"
    document.getElementById(destino).classList.remove('collapse')
    document.getElementById(destino).classList.add('show')

    //eu atualizo o "histórico": a tela atual vira a anterior, e o destino vira a atual
    telaAnterior = telaAtual
    telaAtual = destino
}

//essa função volta para a tela anterior, reaproveitando a função navegar
    function voltar() {
        navegar(telaAnterior)
    }