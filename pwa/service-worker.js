//dou um nome com versão ao meu cache. Se eu mudar algum arquivo do app no futuro,aumento a versão(v2,v3..) para os usuários receberem os arquivos novos
//assim o navegador cria um cache novo e o evento "activate" apaga o antigo
const version = 2
const cachename = 'app-cache-v' + version

//essa é a lista de arquivos que eu guardo que eu guardo no cache logo na instalação
//eu usei caminhos relativos (./) para funcionar no Live server e no github pages
const arquivos = [
    './',
    './index.html',
    './script.js',
    './manifest.json',
    './imagens/icone192.png',
    './imagens/icone512.png'
]

//INSTALAÇÃO: quando o navegador instala o service worker eu abro o cache e guardo todos os arquivos da lista.
//waitUntil diz ao navegador: "só termine a instalação depois que o cache estiver pronto"
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cachename).then(function (cache) {
            return cache.addAll(arquivos)
        })
    )
})

//ATIVAÇÃO: roda quando este service worker novo assume o lugar do antigo
//apago todos os caches que não tem o nome da são atual, porque o caches.match procura em todos os caches e poderia me entregar um arquivo velho do v1
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (nomes) {
            return Promise.all(
                nomes
                    .filter(function (nome) { return nome !== cachename })
                    .map(function (nome) { return caches.delete(nome) })
            )
        })
    )
})

//EXECUÇÃO: toda vez que o app pede qualuqer arquivo (html, js, imagem, dados da API), este evento "fetch" é disparado e eu decido de onde a resposta vem
self.addEventListener('fetch', function (event) {
    event.respondWith(
        //primeiro eu procuro no cache
        caches.match(event.request).then(function (response) {
            //se encontrei no cache, eu entrego direto (rápido e funciona offline)
            if(response !== undefined) {
                return response
            }

            //se não encontrei, eu busco na internet
            return fetch(event.request).then(function (response) {
               //só guardo no cache se a resposta for de sucesso (status 200 a 299)
               //descobri isso quando a fakeStoreAPI caiu com erro 521: sem esse if eu guardaria o erro e o cache-first entregaria o erro para sempre
               if (response.ok) {
                    //uso clone() porque a resposta só pode ser lida uma vez
                    //uma cópia vai para o cache e a outra vai para o app
                    let responseClone = response.clone()
                    caches.open(cachename).then(function (cache) {
                    cache.put(event.request, responseClone)
                    })
               }
               //entrego a resposta ao app mesmo quando é erro, para o meu try/catch mostrar o alerta vermelho
               return response

            }).catch(function () {
                //se não tem no cache e não tem internet, eu entrego a página principal guardada
                return caches.match('./index.html')
            })
        })
    )
})
