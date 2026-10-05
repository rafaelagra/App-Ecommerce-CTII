//guardo em duas variáveis qual tela está aparecendo agora e qual apareceu antes
//preciso disso para o botão "voltar" saber para onde voltar
//usei "let" porque esses valores vão mudar
let telaAnterior = 'tela-home'
let telaAtual = 'tela-home'

//guardo a última categoria pedida, para o botão "tentar novamente" saber qual carregar
let categoriaAtual = 'todos'

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

    //essa função abre os detalhes de um produto, buscando os dados na API pelo id
    //passo só um id (um número) no onclick, e não o nome e a descrição, porque textos com apóstrofo (como men's) quebrariam o onclick
    //e assim os dados vem sempre atualizados
    async function abrirDetalhes(id) {

        const detalhes = document.getElementById('detalhes-produto')

        //primeiro eu mostro a tela de produto e um aviso, porque a API demora um pouco para responder
        navegar('tela-produto')
        detalhes.innerHTML = '<p class="text-center my-4">Carregando...</p>'

        try {
            //peço para a API só o produto com esse id
            const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
            const p = response.data

            //preencho a tela com as chaves do JSON que mapeei anteriormente
            //a nota fica dentro de rating, por isso uso p.rating.rate e p.rating.count
            detalhes.innerHTML = `
                <div class="row g-3">
                    <div class="col-md-4 text-center">
                        <img src="${p.image}" class="img-fluid" alt="${p.title}">
                    </div>
                    <div class="col-md-8">
                        <h2>${p.title}</h2>
                        <p><strong>Categoria:</strong> ${p.category}</p>
                        <p><strong>Preço:</strong> R$ ${p.price.toFixed(2)}</p>
                        <p><strong>Descrição:</strong> ${p.description}</p>
                        <p><strong>Avaliação:</strong> ${p.rating.rate.toFixed(1)} ⭐ (${p.rating.count} avaliações)</p>
                    </div>
                </div>
            `
        } catch (error) {
            //se não conseguir buscar o produto, eu aviso o usuário na tela
            //aqui posso passar o id direto no onclick porque ele é um número
            console.error('Erro ao carregar detalhes:', error)
            detalhes.innerHTML = `
                <div class="alert alert-danger text-center m-0">
                    <p class="mb-2">Não foi possível carregar este produto.</p>
                    <button class="btn btn-danger" onclick="abrirDetalhes(${id})">Tente Novamente</button>
                </div>
            `
        }
    }

    //============= PRODUTOS VINDO DA API =======================

    //essa função busca na API os produtos de uma categoria (ou todos) e monta a vitrine
    //agora ela também avisa o usuário enquanto carrega e quando dá erro
    async function carregarPorCategoria(categoria) {

        //peguei a área vazia da vitrine, onde os cards vão entrar
        const lista = document.getElementById('lista-produtos')

        //guardo qual categoria foi pedida, para poder tentar de novo se falhar
        categoriaAtual = categoria

        //primeiro mostro a vitrine e um spinner do bootstrap, porque a resposta demora um pouco
        //o col-12 faz o aviso ocupar a linha inteira do grid
        navegar('tela-home')
        lista.innerHTML = `
            <div class="col-12 text-center my-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Carregando produtos...</p>
            </div>
        `

        try {
            let url 
            if (categoria === 'todos') {
                url = 'https://fakestoreapi.com/products'
            } else {
                url = `https://fakestoreapi.com/products/category/${categoria}`
            }

            const response = await axios.get(url)
            const produtos = response.data

            //limpo a vitrine(tiro o spinner)antes de colocar os cards
            lista.innerHTML = ''

            produtos.forEach(produto => {
                const coluna = document.createElement('div')
                coluna.className = 'col'
                coluna.innerHTML = `
                    <div class="card h-100" style="cursor: pointer;" onclick="abrirDetalhes(${produto.id})">
                        <img src="${produto.image}" class="card-img-top p-3" alt="${produto.title}" style="height: 250px; object-fit: contain;">
                        <div class="card-body">
                            <h5 class="card-title">${produto.title}</h5>
                            <p class="card-text">R$ ${produto.price.toFixed(2)}</p>
                        </div>
                    </div>
                `

                lista.appendChild(coluna)
            })
        } catch (error) {
            //se a promessa for rejeitada (sem internet, API fora do ar), 
            // eu continuo registrando no console para investigar, mas agora também aviso o usuário na tela,
            //com um alerta vermelho do bootstrap e um botão para tentar de novo
            console.error('Erro ao carregar produtos:', error)
            lista.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        <p class="mb-2">Não foi possível carregar os produtos. Verifique sua conexão.</p>
                        <button class="btn btn-danger" onclick="carregarPorCategoria(categoriaAtual)">Tente Novamente</button>
                    </div>
                </div>
            `
    }
}

//quando o app abre, carrega todos os produtos
carregarPorCategoria('todos')

//====================== PWA: REGISTRO DO SERVICE WORKER ======================
//verifico se o navegador suporta service worker. se suportar, eu registro o meu arquivo service-worker.js, e ele passa a funcionar em segundo plano
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
}

//==================== PWA: BOTÃO DE INSTALAÇÃO ============================

//guardei aqui o "convite de instalação" que o navegador me entrega. começa vazio porque o navegador só entrega quando o app é instalável
let pedidoInstalacao = null

//o navegador dispara "beforeinstallprompt" quando o app pode ser instalado
window.addEventListener('beforeinstallprompt', function (evento) {


    //impedi o navegador de mostrar a sugestão de instalação dele na hora,porque quero que a instalação aconteça quando o usuário clicar no botão
    evento.preventDefault()

    //guardei o convite para usar depois, no clique
    pedidoInstalacao = evento

    //mostrei o item "instalar APP" no menu
    document.getElementById('installAppBt').classList.add('show')
})

//essa função roda quando o usuário clica em "instalar APP"
function installApp() {
    //se eu tenho o convite guardado, eu abro a janela de inscrição do navegador
    if(pedidoInstalacao) {
        pedidoInstalacao.prompt()
    }
}

//depois que o app é instalado, eu escondo o botão
window.addEventListener('appinstalled', function () {
    document.getElementById('installAppBt').classList.remove('show')
    pedidoInstalacao = null
})