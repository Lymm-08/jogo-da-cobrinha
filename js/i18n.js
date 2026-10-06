const translations = {
    "pt-BR": {
        pageTitle: "Jogo da Cobrinha - Codespaces",
        menuKicker: "ARCADE · JOGO 01",
        menuTitlePrefix: "Jogo da",
        menuTitleName: "Cobrinha",
        play: "Jogar",
        playerGuide: "Guia do jogador",
        languages: "Idiomas",
        languageKicker: "IDIOMAS",
        chooseLanguage: "Escolha seu idioma",
        portugueseBrazil: "Português - BR",
        englishUs: "English - US",
        menuBack: "← Menu",
        howToPrefix: "Como",
        howToEmphasis: "jogar",
        controls: "Controles",
        controlsMove: "Movem a cobra.",
        space: "Espaço",
        controlsPause: "Pausa a partida; escolha uma direção para continuar.",
        controlsFood: "Coma as frutas para ganhar 10 pontos e crescer. As laterais dão a volta para o outro lado.",
        controlsHazards: "Você perde ao bater no próprio corpo, em uma bomba ou em uma parede móvel. A cobra pode atravessar as bordas e usar os portais.",
        phasesTitle: "Fases e novidades",
        phaseOne: "Fase 1 · Começo",
        phaseOneDescription: "Três frutas aparecem no tabuleiro. Cada fruta some após 10 segundos se não for comida.",
        phaseTwo: "Fase 2 · Bombas",
        phaseTwoDescription: "Bombas aparecem por 8 segundos. Encostar em uma encerra a partida.",
        phaseThree: "Fase 3 · Portais",
        phaseThreeDescription: "Dois portais transportam a cobra. Eles duram 15 segundos e, após uma pausa curta, reaparecem em outros lugares.",
        phaseFour: "Fase 4 · Poção",
        phaseFourDescription: "A poção roxa faz a cobra encolher em até cinco segmentos. Pegue-a antes que suma.",
        phaseFive: "Fase 5 · Paredes móveis",
        phaseFiveDescription: "Quatro paredes aparecem no centro e mudam de lugar a cada 15 segundos.",
        survival: "Sobrevivência",
        survivalDescription: "A cobra acelera 10% a cada 50 pontos. As novidades das fases anteriores continuam no jogo.",
        back: "← Voltar",
        gameTitle: "Jogo da Cobrinha",
        score: "Pontos:",
        highScore: "Recorde:",
        gameOverRestart: "Game Over! Pressione ESPAÇO para reiniciar.",
        startDirection: "Escolha uma direção para começar.",
        bombCollision: "Game Over! Você comeu uma bomba. Pressione ESPAÇO para reiniciar.",
        win: "Você venceu! O tabuleiro está cheio. Pressione ESPAÇO para jogar novamente.",
        paused: "Jogo pausado. Escolha uma direção para continuar.",
        portugueseAria: "Português do Brasil",
        englishAria: "Inglês dos Estados Unidos"
    },
    "en-US": {
        pageTitle: "Snake Game - Codespaces",
        menuKicker: "ARCADE · GAME 01",
        menuTitlePrefix: "Snake",
        menuTitleName: "Game",
        play: "Play",
        playerGuide: "Player guide",
        languages: "Languages",
        languageKicker: "LANGUAGES",
        chooseLanguage: "Choose your language",
        portugueseBrazil: "Português - BR",
        englishUs: "English - US",
        menuBack: "← Menu",
        howToPrefix: "How to",
        howToEmphasis: "play",
        controls: "Controls",
        controlsMove: "Move the snake.",
        space: "Space",
        controlsPause: "Pauses the game; choose a direction to continue.",
        controlsFood: "Eat fruit to earn 10 points and grow. The edges wrap around to the other side.",
        controlsHazards: "You lose if you hit your own body, a bomb, or a moving wall. The snake can cross the edges and use portals.",
        phasesTitle: "Phases and features",
        phaseOne: "Phase 1 · Start",
        phaseOneDescription: "Three fruits appear on the board. Each fruit disappears after 10 seconds if uneaten.",
        phaseTwo: "Phase 2 · Bombs",
        phaseTwoDescription: "Bombs appear for 8 seconds. Touching one ends the game.",
        phaseThree: "Phase 3 · Portals",
        phaseThreeDescription: "Two portals transport the snake. They last 15 seconds and reappear in new places after a short break.",
        phaseFour: "Phase 4 · Potion",
        phaseFourDescription: "The purple potion shrinks the snake by up to five segments. Grab it before it disappears.",
        phaseFive: "Phase 5 · Moving walls",
        phaseFiveDescription: "Four walls appear in the center and move every 15 seconds.",
        survival: "Survival",
        survivalDescription: "The snake speeds up by 10% every 50 points. Features from previous phases remain in play.",
        back: "← Back",
        gameTitle: "Snake Game",
        score: "Score:",
        highScore: "High score:",
        gameOverRestart: "Game over! Press SPACE to restart.",
        startDirection: "Choose a direction to start.",
        bombCollision: "Game over! You hit a bomb. Press SPACE to restart.",
        win: "You win! The board is full. Press SPACE to play again.",
        paused: "Game paused. Choose a direction to continue.",
        portugueseAria: "Portuguese (Brazil)",
        englishAria: "English (United States)"
    }
};

export let currentLanguage = localStorage.getItem("snakeLanguage") || "pt-BR";

if (!Object.hasOwn(translations, currentLanguage)) {
    currentLanguage = "pt-BR";
}

export function translate(key) {
    const message = translations[currentLanguage][key];
    if (message === undefined) {
        throw new Error(`Missing "${key}" translation for ${currentLanguage}.`);
    }
    return message;
}

export function setLanguage(language) {
    if (!Object.hasOwn(translations, language)) {
        throw new RangeError(`Unsupported language: ${language}`);
    }

    currentLanguage = language;
    localStorage.setItem("snakeLanguage", language);
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = translate(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
        element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    });
    document.querySelectorAll("[data-language]").forEach(element => {
        element.setAttribute("aria-pressed", String(element.dataset.language === language));
    });
}

setLanguage(currentLanguage);
