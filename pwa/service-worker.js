//dou um nome com versão ao meu cache. Se eu mudar algum arquivo do app no futuro,aumento a versão(v2,v3..) para os usuários receberem os arquivos novos
const version = 1
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
                //e guardo uma cópia no cache para a próxima vez
                //uso clone() porque a resposta só pode ser lida uma vez
                //uma cópia vai para o cache e outra vai para o app
                let responseClone = response.clone()
                caches.open(cachename).then(function (cache) {
                    cache.put(event.request, responseClone)
                })
                return response

            }).catch(function () {
                //se não tem no cache e não tem internet, eu entrego a página principal guardada
                return caches.match('./index.html')
            })
        })
    )
})
