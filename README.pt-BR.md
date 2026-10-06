# Jogo da Cobrinha

Jogo de cobrinha para navegador, feito com HTML, CSS e JavaScript nativo. Inclui menu, guia do jogador, pontuação, recorde local e fases com itens e obstáculos.

Escolha entre Português (Brasil) e English (United States) no menu. A preferência fica salva no navegador e traduz o menu, o guia e as mensagens da partida.

## Executar

Uma vez que o jogo utiliza módulos JavaScript, execute-o a partir de um servidor web local, em vez de abrir o ficheiro diretamente:

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão Live Server.
3. Abra o ficheiro index.html e clique em «Go Live» na barra de estado, ou clique com o botão direito do rato no ficheiro e selecione «Abrir com o Live Server».
4. O jogo será aberto no seu navegador.

## Capturas de tela

### Tela inicial

![Menu inicial do jogo](screenshots/menu-inicial.png)

### Troca de idioma

![Tela de seleção de idioma com as bandeiras do Brasil e dos Estados Unidos](screenshots/troca-de-idioma.png)

### Guia do jogador

![Controles do guia do jogador em português](screenshots/guia-do-jogador.png)

![Fases e novidades do jogo em português](screenshots/fases-do-jogo.png)

### Partida

![Partida em andamento com portais e frutas](screenshots/partida-em-andamento.png)

### Fim da Partida

![Fim de jogo](screenshots/fim-de-jogo.png)



## Estrutura do projeto

```text
.
├── index.html
├── script.js             # Entrada dos módulos JavaScript
├── css/
│   ├── base.css
│   ├── game.css
│   ├── i18n.js
│   ├── instructions.css
│   ├── menu.css
│   └── motion.css
└── js/
    ├── config.js          # Configurações do jogo
    ├── game.js            # Partida e controles
    ├── level-system.js    # Fases, itens e obstáculos
    └── renderer.js        # Desenho no canvas
```


English: [README.md](README.md)
