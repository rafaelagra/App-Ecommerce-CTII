# 🛒 App E-commerce — Mão na Massa 1

Aplicativo mobile de e-commerce desenvolvido na disciplina **Programação para Dispositivos Móveis** do curso CTII — **IFSC**.

O projeto foi construído em **4 fases**, cada uma em sua própria pasta, seguindo a evolução proposta pelo professor:
**Bootstrap → SPA → Web Services (API REST) → PWA**.

**Aluno:** Rafael Agra

## 🔗 Links

| Fase | Acesse online |
|---|---|
| 1. Bootstrap | https://rafaelagra.github.io/App-Ecommerce-CTII/bootstrap/ |
| 2. SPA | https://rafaelagra.github.io/App-Ecommerce-CTII/spa/ |
| 3. Web Services | https://rafaelagra.github.io/App-Ecommerce-CTII/ws/ |
| 4. PWA | https://rafaelagra.github.io/App-Ecommerce-CTII/pwa/ |

🎥 **Vídeo de apresentação:** _(link do YouTube em breve)_

## 📁 Fases do projeto

### 1. `bootstrap/` — Layout com Bootstrap (MPA)
- Site com várias páginas HTML (uma por tela): home, categorias (Vestuário e Eletrônicos), detalhes de produto e contato.
- Navbar responsiva com menu hambúrguer no celular.
- Grid responsivo de cards (1 coluna no celular, 3 no computador).

### 2. `spa/` — Single Page Application
- Todas as telas em um único `index.html`, mostradas e escondidas com JavaScript (classes `show` e `collapse`).
- Função `navegar()` para trocar de tela e `voltar()` para retornar à tela anterior.
- Detalhes do produto montados dinamicamente com `innerHTML`.

### 3. `ws/` — Consumo de API REST
- Produtos carregados da **FakeStoreAPI** com **Axios** e `async/await`.
- Filtro por categoria (Vestuário, Eletrônicos, Acessórios).
- Detalhes buscados pelo **id** do produto.
- Spinner de carregamento e mensagem de erro com botão "Tente Novamente".

### 4. `pwa/` — Progressive Web App
- `manifest.json` com nome, cores e ícones (192 e 512 px).
- Service worker com cache (estratégia *cache-first*) para funcionar **offline**.
- O cache guarda apenas respostas de sucesso e apaga versões antigas ao atualizar.
- Botão **"Instalar APP"** no menu, que aparece quando o navegador permite a instalação.

## 🧰 Tecnologias
- HTML5, CSS3 e JavaScript
- Bootstrap 5.3 (via CDN)
- Axios (via CDN)
- FakeStoreAPI
- Service Worker e Web App Manifest
- GitHub Pages (hospedagem com HTTPS)

## ▶️ Como executar localmente
1. Clone o repositório:
   `git clone https://github.com/rafaelagra/App-Ecommerce-CTII.git`
2. Abra a pasta no VS Code.
3. Abra o `index.html` de uma das fases com a extensão **Live Server**.
4. Para testar o PWA, use a pasta `pwa/` pelo Live Server (`127.0.0.1`) ou pelo link do GitHub Pages, porque o service worker exige `localhost` ou HTTPS.

## ⚠️ Observações
- Os preços da FakeStoreAPI estão em **dólar**, mas são exibidos com "R$", como no exemplo do professor.
- Os nomes e descrições dos produtos vêm da API em **inglês**.
- As fases `ws/` e `pwa/` dependem da FakeStoreAPI. Se a API estiver fora do ar, o app mostra a mensagem de erro e o botão "Tente Novamente".

## 📚 Créditos
- Material e exemplos da disciplina: [dev-mobile-ctii](https://github.com/ctii-ead-ifsc-fln/dev-mobile-ctii) e [template-app-pwa](https://github.com/ctii-ead-ifsc-fln/template-app-pwa) — IFSC.
- E-book: *Programação para Dispositivos Móveis* — Velloso & Cardozo (IFSC, 2025).
- Dados dos produtos: [FakeStoreAPI](https://fakestoreapi.com).