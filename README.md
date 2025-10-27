# ✨ Lumos Data - Desafio Zetta Lab 2025 ✨

Uma aplicação front-end responsiva desenvolvida como parte do **Desafio de Desenvolvimento de Software Zetta Lab 2025**. O objetivo foi consumir e apresentar visualmente dados de uma API pública, demonstrando habilidades em desenvolvimento front-end, organização de código, boas práticas e criatividade na resolução de problemas.

**Explore o universo mágico:** [https://lumos-data.vercel.app/](https://lumos-data.vercel.app/) 👈

---

## 📜 Sobre o Projeto

Lumos Data permite aos usuários explorar informações detalhadas sobre o universo de Harry Potter, incluindo personagens, feitiços, poções, livros e filmes. A aplicação utiliza a rica [PotterDB API](https://potterdb.com/) para buscar e exibir os dados, oferecendo uma interface interativa e visualmente temática.

O desenvolvimento focou em:
* **Boas Práticas:** Código limpo, componentização, commits semânticos (Conventional Commits), estrutura de projeto organizada.
* **Tecnologias Modernas:** Utilização de Angular em modo Standalone, TypeScript para tipagem segura e SASS/SCSS para estilização modular.
* **Experiência do Usuário:** Design responsivo, tema visual imersivo (dark mode com fundo parallax), feedback de carregamento e navegação intuitiva.
* **Resolução de Problemas:** Adaptação da estratégia de carregamento de dados (uso de `forkJoin` para listas curadas) para contornar limitações da API e otimizar a experiência inicial.

---

## 🛠️ Tecnologias Utilizadas

* **[Angular](https://angular.io/) (v17+):** Framework front-end (utilizando Standalone Components).
* **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript para tipagem estática.
* **[SASS/SCSS](https://sass-lang.com/):** Pré-processador CSS para estilos modulares e variáveis.
* **[Bootstrap 5+](https://getbootstrap.com/):** Framework CSS para layout responsivo e componentes UI.
* **[PotterDB API](https://potterdb.com/):** API pública RESTful com dados do universo Harry Potter.
* **[RxJS](https://rxjs.dev/):** Biblioteca para programação reativa (utilizada para `forkJoin`, `debounceTime`, etc.).
* **[Git & GitHub](https://github.com/):** Controle de versão e hospedagem do código.
* **[Vercel](https://vercel.com/):** Plataforma de deploy e hospedagem.

---

## ✨ Funcionalidades

* **Navegação Completa:** Acesso fácil às seções de Personagens, Feitiços, Poções, Livros e Filmes através do header.
* **Listas Curadas:** As páginas de Personagens, Feitiços e Poções exibem inicialmente uma seleção dos itens mais populares/importantes para uma melhor experiência inicial.
* **Busca Dinâmica:** Funcionalidade de busca em tempo real nas páginas de Personagens, Feitiços e Poções, consumindo a API com filtros (`filter[name_cont]`, `filter[image_not_null]`).
* **Rolagem Infinita:** Na página de Poções, novos itens são carregados automaticamente ao rolar a página para baixo.
* **Layouts Adaptáveis:**
    * Cards verticais em grid responsivo (Personagens, Feitiços, Poções).
    * Cards horizontais (imagem à esquerda, texto à direita) para Livros e Filmes, otimizados para exibir mais conteúdo textual.
* **Detalhes do Personagem:** Página dedicada (`/character/:id`) exibindo informações completas de um personagem selecionado.
* **Tema Visual:** Interface escura com fundo parallax, fontes temáticas (Cinzel, Lexend), cores inspiradas no universo HP e títulos decorados.
* **Responsividade:** Layout adaptado para diferentes tamanhos de tela (mobile, tablet, desktop), seguindo os breakpoints sugeridos [cite: 16-19].
* **Utilidades:** Botão flutuante "Voltar ao Topo".

---

## 🚀 Como Executar Localmente

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/joaogsribeiro/Desafio_ZettaLab2025.git
    ```
    
2.  **Navegue até a Pasta:**
    ```bash
    cd Desafio_ZettaLab2025
    ```

3.  **Instale as Dependências:**
    ```bash
    npm install
    ```

4.  **Execute a Aplicação:**
    ```bash
    ng serve -o
    ```
    *(O comando `-o` abre automaticamente a aplicação no seu navegador padrão).*

5.  **Acesse:** Abra [http://localhost:4200/](http://localhost:4200/) no seu navegador.

---

## 📝 Licença

Este projeto é distribuído sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Agradeço novamente à **Agência Zetta** pela oportunidade de participar deste desafio!
