# Jogo da Cobrinha

Jogo de cobrinha para navegador, feito com HTML, CSS e JavaScript nativo. Inclui menu, instruções, pontuação, recorde local e fases com itens e obstáculos.

## Executar

Não é necessário instalar dependências nem usar Python. Como o jogo usa módulos JavaScript, execute-o por um servidor local, não diretamente como arquivo:

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**.
3. Abra o `index.html` e clique em **Go Live** na barra inferior, ou clique com o botão direito no arquivo e selecione **Open with Live Server**.
4. O jogo será aberto no navegador.

## Demonstração

### Início

![Menu inicial do jogo](screenshots/menu-inicial.png)

### Instruções

![Controles do guia do jogador](screenshots/guia-do-jogador.png)

![Fases e novidades do jogo](screenshots/fases-do-jogo.png)

### Jogo em andamento (buracos de minhoca)

![Partida em andamento com portais e frutas](screenshots/partida-em-andamento.png)

### Game Over

![Tela de fim de jogo](screenshots/fim-de-jogo.png)

<!-- Opcional: adicione um vídeo e substitua o caminho abaixo.
[Assistir ao vídeo da demonstração](screenshots/video.mp4)
-->


## Estrutura

```text
.
├── index.html
├── script.js              # Entrada dos módulos
├── css/
│   ├── base.css
│   ├── game.css
│   ├── instructions.css
│   ├── menu.css
│   └── motion.css
└── js/
    ├── config.js          # Configurações do jogo
    ├── game.js            # Partida e controles
    ├── level-system.js    # Fases, itens e obstáculos
    └── renderer.js        # Desenho no canvas
```
