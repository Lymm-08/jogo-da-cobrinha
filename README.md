# Jogo da Cobrinha

Jogo de cobrinha para navegador, feito com HTML, CSS e JavaScript nativo. Inclui menu, instruções, pontuação, recorde local e fases com itens e obstáculos.

## Executar

Não há dependências para instalar nem etapa de build. Como o jogo usa módulos JavaScript, abra-o por um servidor local, não diretamente como arquivo.

```bash
python3 -m http.server 8000
```

Depois, acesse <http://localhost:8000> no navegador.

## Como jogar

- Selecione **Jogar** no menu e use as setas para mover a cobra.
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