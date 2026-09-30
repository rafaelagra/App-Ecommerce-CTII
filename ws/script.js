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

    //essa função mostra os detalhes de um produto. Em vez de ter um arquivo HTML para cada
    function mostrarDetalhes(produto, imagem, categoria, preco, descricao, nota, avaliacoes) {

        //primeiro eu troco para a tela de produto, reaproveitando a navegar()
        navegar('tela-produto')

        //pego a área vazia que deixei preparada no HTML para receber os detalhes
        let detalhes = document.getElementById('detalhes-produto')

        //preencho essa área com innerHTML
        detalhes.innerHTML = `
            <div class="row g-3">
                <div class="col-md-4 text-center">
                    <img src="${imagem}" class="img-fluid" alt="${produto}">
                </div>
                <div class="col-md-8">
                    <h2>${produto}</h2>
                    <p><strong>Categoria:</strong> ${categoria}</p>
                    <p><strong>Preço:</strong> R$ ${preco}</p>
                    <p><strong>Descrição:</strong> ${descricao}</p>
                    <p><strong>Avaliação:</strong> ${nota.toFixed(1)} ⭐ (${avaliacoes} avaliações)</p>
                </div>
            </div>
        `
    }

    //============= PRODUTOS VINDO DA API =======================

    //essa função busca na API os produtos de uma categoria (ou todos) e monta a vitrine
    //o parãmetro categoria permite usar a mesma função para todos os menus
    async function carregarPorCategoria(categoria) {

        //peguei a área vazia da vitrine, onde os cards vão entrar
        const lista = document.getElementById('lista-produtos')

        //usei try/catch porque a requisição pode falhar(sem internet, API fora do ar)
        //se algo der errado dentro do try, o código pula para o catch em vez de quebrar
        try {
            //decidi qual endpoint chamar de acordo com a categoria recebida
            let url
            if(categoria === 'todos') {
                url = 'https://fakestoreapi.com/products'
            } else {
                //uso template string para encaixar a categoria no final da URL
                url = `https://fakestoreapi.com/products/category/${categoria}`
            }

            const response = await axios.get(url)
            const produtos = response.data 

            //limpo a vitrine antes de preencher, pra não duplicar cards
            lista.innerHTML = ''

            //percorro a lista e, para cada produto, crio um card
            produtos.forEach(produto => {
                const coluna = document.createElement('div')
                coluna.className = 'col'

                //usei as chaves do JSON que mapeei anteriormente: title, price, image
                //toFixed(2) garante sempre 2 casas decimais no preço
                coluna.innerHTML = `
                    <div class="card h-100">
                        <img src="${produto.image}" class="card-img-top p-3" alt="${produto.title}" style="height: 250px; object-fit: contain;">
                        <div class="card-body">
                            <h5 class="card-title">${produto.title}</h5>
                            <p class="card-text">R$ ${produto.price.toFixed(2)}</p>
                        </div>
                    </div>
                `

                //coloco o card pronto dentro da vitrinwe
                lista.appendChild(coluna)
            })

            //depois de montar a vitrini, garanto que a tela home está visível
            navegar('tela-home')

        } catch (error) {
            //se a API falhar,mostro o erro no console para conseguir investigar
            console.error('Erro ao carregar produtos:', error)
        }
    }

    //quando o app abre, carrega todos os produtos
    carregarPorCategoria('todos')