# Jogo da Cobrinha

Jogo de cobrinha para navegador, feito com HTML, CSS e JavaScript nativo. Inclui menu, guia do jogador, pontuação, recorde local e fases com itens e obstáculos.

Escolha entre Português (Brasil) e English (United States) no menu. A preferência fica salva no navegador e traduz o menu, o guia e as mensagens da partida.

## Executar

Não é necessário instalar dependências nem usar Python. Como o jogo usa módulos JavaScript, execute-o por um servidor local, não diretamente como arquivo:

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**.
3. Abra o `index.html` e clique em **Go Live** na barra inferior, ou clique com o botão direito no arquivo e selecione **Open with Live Server**.
4. O jogo será aberto no navegador.

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

![Fim de jogo](screenshots/fim-de-jogo.png)

## Como jogar

- Selecione **Jogar** no menu e use as setas para mover a cobra.
- Selecione **Idiomas** no menu para trocar entre Português - BR e English - US.
- Use **← Voltar** para sair da partida e voltar ao menu; no guia, use **← Menu** para retornar.
- Pressione **Espaço** para pausar; escolha uma direção para continuar.
- Cada fruta vale 10 pontos e faz a cobra crescer. Há até três frutas no tabuleiro, cada uma por 10 segundos.
- As bordas conectam os lados opostos do tabuleiro.
- Você perde ao colidir com o próprio corpo, uma bomba ou uma parede móvel.
- Preencher todas as casas do tabuleiro resulta em vitória.

## Fases

| Pontuação | Novidade |
| --- | --- |
| 0–99 | Três frutas disponíveis; cada uma desaparece após 10 segundos. |
| 100–199 | Bombas aparecem por até 8 segundos. Após sumirem, podem surgir novamente. |
| 200–299 | Dois portais transportam a cobra. Duram 15 segundos e reaparecem em outras posições após uma pausa. |
| 300–399 | Poção roxa que reduz o comprimento da cobra em até cinco segmentos. |
| 400–499 | Quatro paredes móveis no centro do tabuleiro; mudam de posição a cada 15 segundos. |
| 500+ | Sobrevivência: a velocidade aumenta a cada 50 pontos, e as novidades anteriores continuam ativas. |

## Estrutura do projeto

```text
.
├── index.html
├── script.js              # Entrada dos módulos JavaScript
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

English: [README.md](README.md)
