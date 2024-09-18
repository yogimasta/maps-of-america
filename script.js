//INICIO PARTE BUENA
class Player {
  constructor(name, chips) {
      this.name = name;
      this.chips = chips;
      this.cards = [];
  }

  deal(cards) {
      this.cards = cards;
  }

  adjustChips(amount) {
      this.chips += amount;
      document.getElementById(`${this.name}-chips`).innerText = this.chips;
  }
}

let communityCards = [];

const player = new Player('user', 1000);
const bot1 = new Player('bot1', 1000);
const bot2 = new Player('bot2', 1000);
const bot3 = new Player('bot3', 1000);

let deck = [
  '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥',
  '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦',
  '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣',
  '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠'
];
if (deck.length < 1) {
  const potCards = document.getElementsByClassName("cards-pot");
  if (potCards.length > 0) {
    potCards[0].style.display = "none"; // Acceder al primer elemento de la colección
  }
}
function removeCard() {
  if (deck.length === 0) {
    const potCards = document.getElementsByClassName("cards-pot");
    if (potCards.length > 0) {
      potCards[0].style.display = "none"; // Ocultar el contenedor cuando deck esté vacío
    }
  }
}

// Simulación de quitar cartas hasta vaciar el deck



function shuffleDeck() {
  deck = deck.sort(() => Math.random() - 0.5); 
}

function dealCards() {
  if (deck.length < 9) { // Se necesitan al menos 9 cartas para repartir a 4 jugadores + comunidad
    console.log('No hay suficientes cartas, iniciando un nuevo mazo');
    resetDeck();
  }

  player.deal([deck.pop(), deck.pop()]);
  bot1.deal([deck.pop(), deck.pop()]);
  bot2.deal([deck.pop(), deck.pop()]);
  bot3.deal([deck.pop(), deck.pop()]);

 
  displayCards();
}

// Función para reiniciar y mezclar el mazo cuando se acaban las cartas
function resetDeck() {
  deck = [
    '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥',
    '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦',
    '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣',
    '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠'
  ];
  shuffleDeck();
}


function displayCards() {
  // Mostrar las cartas del jugador (User)
  const userCards = document.getElementById('user-cards');
  userCards.innerHTML = player.cards.map(card => `<div class="card">${card}</div>`).join(' ');

  // Mostrar las cartas de la comunidad (sin animación personalizada)
  const community = document.getElementById('community-cards');
  community.innerHTML = communityCards.map(card => `<div class="card">${card}</div>`).join(' ');

  // Mostrar las cartas del bot 1 con IDs únicos
  const bot1Cards = document.getElementById('bot1-cards');
  bot1Cards.innerHTML = bot1.cards.map((card, index) => {
    return `<div class="card" id="bot1-card${index + 1}">${card}</div>`;
  }).join(' ');

  // Mostrar las cartas del bot 2 con IDs únicos
  const bot2Cards = document.getElementById('bot2-cards');
  bot2Cards.innerHTML = bot2.cards.map((card, index) => {
    return `<div class="card" id="bot2-card${index + 1}">${card}</div>`;
  }).join(' ');

  // Mostrar las cartas del bot 3 con IDs únicos
  const bot3Cards = document.getElementById('bot3-cards');
  bot3Cards.innerHTML = bot3.cards.map((card, index) => {
    return `<div class="card" id="bot3-card${index + 1}">${card}</div>`;
  }).join(' ');

  // Activar la animación de las cartas del jugador y los bots
  setTimeout(() => {
    // Cartas del jugador
    document.querySelectorAll('#user-cards .card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('show'); // Añade la clase 'show' para activar la animación
      }, index * 100);
    });

    // Cartas del Bot 1
    document.querySelectorAll('#bot1-cards .card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('show');
      }, index * 100);
    });

    // Cartas del Bot 2
    document.querySelectorAll('#bot2-cards .card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('show');
      }, index * 100);
    });

    // Cartas del Bot 3
    document.querySelectorAll('#bot3-cards .card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('show');
      }, index * 100);
    });
  }, 100); // Breve retraso para que las cartas se hayan renderizado
}



//FINPARTE BUENA



///INICIO MEJORABLE
let currentPlayerIndex = 0;
let pot = 0; 
let currentBet = 0;
let currentStage = 0;
const players = [player, bot1, bot2, bot3];

// Inicializa la propiedad 'hasBet' para cada jugador al inicio del juego
players.forEach(player => {
  player.hasBet = false;  // No han apostado al iniciar
  player.isFolded = false;  // No se han retirado
});

// Función para iniciar el juego
function startGame() {
  communityCards.length = 0; // Limpiar las cartas comunitarias
  currentPlayerIndex = 0; // Reiniciar el índice del jugador
  players.forEach(player => player.cards = []); // Limpiar las cartas de cada jugador
  shuffleDeck();
  dealCards(); // Reparte las manos a los jugadores
  currentStage = 0; // Inicia con el Flop
  resetBettingRound(); // Resetea el estado de las apuestas
  nextStage(); // Comienza con la primera etapa (Flop)
  hideBotCards()
  console.log(deck.length)
}

// Función para resetear la ronda de apuestas
function resetBettingRound() {
  currentBet = 0; // Reinicia la apuesta actual
  players.forEach(player => {
    player.hasBet = false; // Ningún jugador ha apostado al iniciar la nueva ronda
  });
}

function nextStage() {
  if (currentStage === 0) {
    
    communityCards.push(deck.pop(), deck.pop(), deck.pop());
    displayFlop();
    resetBettingRound();
    handleBettingRound(); 
  } else if (currentStage === 1) {
    // Turn: Mostrar la cuarta carta comunitaria
    communityCards.push(deck.pop());
    displayTurn();
    resetBettingRound(); 
    handleBettingRound(); 
  } else if (currentStage === 2) {
    // River: Mostrar la quinta carta comunitaria
    communityCards.push(deck.pop());
    displayRiver();
    resetBettingRound(); // Reinicia el estado de las apuestas para esta fase
    handleBettingRound(); 
  } else if (currentStage === 3) {

    evaluateWinner();
    revealBotCards();
  }
}

// Muestra las cartas del Flop
function displayFlop() {
  const communityElement = document.getElementById('community-cards');
  communityElement.innerHTML = communityCards.slice(0, 3).map((card, index) => renderCard(card, index)).join('');
  
  // Animar cada carta del Flop desde diferentes puntos
  const cards = communityElement.querySelectorAll('.cards');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('show');
    }, index * 500); // Cada carta aparece con un retraso de 500ms
  });
}

// Muestra la carta del Turn
function displayTurn() {
  const communityElement = document.getElementById('community-cards');
  communityElement.innerHTML += renderCard(communityCards[3], 3); // Asigna un índice único (3)

  // Animar la carta del Turn
  const newCard = communityElement.querySelector('.cards:last-child');
  setTimeout(() => {
    newCard.classList.add('show');
  }, 100); // La carta del Turn se anima después de 100ms
}

// Muestra la carta del River
function displayRiver() {
  const communityElement = document.getElementById('community-cards');
  communityElement.innerHTML += renderCard(communityCards[4], 4); // Asigna un índice único (4)

  // Animar la carta del River
  const newCard = communityElement.querySelector('.cards:last-child');
  setTimeout(() => {
    newCard.classList.add('show');
  }, 100); // La carta del River se anima después de 100ms
}
// Función para generar el HTML de una carta con una clase única basada en el índice
function renderCard(card, index) {
  return `<div class="cards card-${index}">${card}</div>`;
}



// Lógica para manejar la ronda de apuestas
function handleBettingRound() {
  // Aquí gestionas las apuestas (esperar a que todos los jugadores apuesten)
  console.log("Esperando apuestas...");
  console.log(currentStage)
  // Después de que todos los jugadores apuesten, verificamos si la ronda terminó
  if (bettingRoundOver()) {
    currentStage++; // Solo avanzar si la ronda de apuestas ha terminado
    nextStage();
  }
}

// Verifica si la ronda de apuestas ha terminado
function bettingRoundOver() {
  // Verifica si todos los jugadores que no se han retirado (fold) ya apostaron
  return players.every(player => player.hasBet || player.isFolded);
}


// Función para jugar el turno de cada jugador
function playTurn() {
  const currentPlayer = players[currentPlayerIndex];

  // Si el jugador es el humano, esperar acción manual
  if (currentPlayer.name === 'user') {
      console.log(`Es tu turno. Pot: ${pot}, Apuesta actual: ${currentBet}`);
      // Las acciones de 'check', 'call', 'raise', y 'fold' son controladas por botones
  } else {
      // Simulación de lógica de bots
      botAction(currentPlayer);
  }
}


// Lógica del bot
function botAction(bot) {
  if (bot.chips >= currentBet) {
    bot.adjustChips(-currentBet);
    pot += currentBet;
    bot.hasBet = true; // Marca que el bot ya apostó
    console.log(`${bot.name} hizo call con ${currentBet} fichas. Pot total: ${pot}`);
  } else {
    bot.isFolded = true; // Marca que el bot se ha retirado si no tiene suficientes fichas
    console.log(`${bot.name} se retira.`);
  }
  nextTurn();
}

function resetGame() {
  communityCards.length = 0; // Limpiar las cartas comunitarias
  currentPlayerIndex = 0; // Reiniciar el índice del jugador
  players.forEach(player => player.cards = []); // Limpiar las cartas de cada jugador
  startGame() // Iniciar una nueva ronda
}

//FIN PARTE  MEJORABLE
















/// INICIO PARTE MEJORABLE 2
// Función para avanzar al siguiente turno
function nextTurn() {
  currentPlayerIndex++;

  // Si todos los jugadores han jugado su turno
  if (currentPlayerIndex >= players.length) {
    currentPlayerIndex = 0; // Reinicia el índice de jugadores

    // Si todos han apostado, avanzamos a la siguiente etapa
    if (bettingRoundOver()) {
      currentStage++; // Avanza a la siguiente etapa (Flop, Turn, River o Final)
      nextStage();
    } else {
      handleBettingRound(); // Inicia otra ronda de apuestas si no ha terminado
    }
  } else {
    playTurn(); // Continúa con el siguiente jugador
  }
}


function check() {
  console.log('Player checked');
  player.hasBet = true; // Marca que el jugador ya apostó
  nextTurn();
  removeCard()
}

function call() {
  if (player.chips >= currentBet) {
    player.adjustChips(-currentBet);
    pot += currentBet;
    player.hasBet = true; // Marca que el jugador ya apostó
    console.log(`Player called. Pot total: ${pot}`);
    nextTurn();
  } else {
    console.log('Not enough chips to call');
  }
  removeCard()
}

function raise() {
  const raiseAmount = 20; // Monto fijo de raise
  if (player.chips >= currentBet + raiseAmount) {
    currentBet += raiseAmount;
    player.adjustChips(-currentBet);
    pot += currentBet;
    player.hasBet = true; // Marca que el jugador ya apostó
    console.log(`Player raised to ${currentBet}. Pot total: ${pot}`);
    nextTurn();
  } else {
    console.log('Not enough chips to raise');
  }
  removeCard()
}

function fold() {
  console.log('Player folded');
  player.isFolded = true; // Marca que el jugador se ha retirado
  players.splice(players.indexOf(player), 1); // Elimina al jugador de la partida
  nextTurn();
  removeCard()
}

//FIN PARTE MEJORABLE







/////PARTE BUENA
// Función para evaluar el ganador



function botActions(amount = 0) {
  // Simple bot logic: call if possible, otherwise fold
  [bot1, bot2, bot3].forEach(bot => {
      if (bot.chips >= amount) {
          bot.adjustChips(-amount);
          console.log(`${bot.name} called with ${amount} chips`);
      } else {
          console.log(`${bot.name} folded`);
      }
  });
}

function revealBotCards() {
  // Actualizar las cartas solo si no han sido reveladas ya
  if (!document.getElementById('bot1-cards').classList.contains('show')) {
    document.getElementById('bot1-cards').innerHTML = bot1.cards.map(card => {
      return `<div class="cards">${card}</div>`;
    }).join(' ');

    document.getElementById('bot2-cards').innerHTML = bot2.cards.map(card => {
      return `<div class="cards">${card}</div>`;
    }).join(' ');

    document.getElementById('bot3-cards').innerHTML = bot3.cards.map(card => {
      return `<div class="cards">${card}</div>`;
    }).join(' ');

    // Aplicar la animación de revelado después de un breve retraso
    setTimeout(() => {
      document.querySelectorAll('#bot1-cards .card').forEach(card => card.classList.add('show'));
      document.querySelectorAll('#bot2-cards .card').forEach(card => card.classList.add('show'));
      document.querySelectorAll('#bot3-cards .card').forEach(card => card.classList.add('show'));
    }, 100); // Breve retraso para asegurarse de que las cartas han sido renderizadas
  }
}

function hideBotCards() {
  document.getElementById('bot1-cards').innerHTML = bot1.cards.map(() => {
      return `<div class="card back"></div>`;
  }).join(' ');
  document.getElementById('bot2-cards').innerHTML = bot2.cards.map(() => {
      return `<div class="card back"></div>`;
  }).join(' ');
  document.getElementById('bot3-cards').innerHTML = bot3.cards.map(() => {
      return `<div class="card back"></div>`;
  }).join(' ');

  document.getElementById('bot1-cards').classList.add('hidden');
  document.getElementById('bot2-cards').classList.add('hidden');
  document.getElementById('bot3-cards').classList.add('hidden');
}

function evaluateWinner() {
  const players = [player, bot1, bot2, bot3];

  // Combinaciones posibles de cartas de cada jugador más las comunitarias
  const hands = players.map(p => {
    return {
      name: p.name,
      bestHand: evaluateHand([...p.cards, ...communityCards]) // Evaluar mejor mano
    };
  });

  // Determinar la mejor mano
  hands.sort((a, b) => compareHands(a.bestHand, b.bestHand)); // Ordenamos por mejor mano

  const winner = hands[0]; // El primer elemento es la mejor mano
  console.log(`El ganador es: ${winner.name} con la mano: ${winner.bestHand.type}`);

  // Depuración: Verificar las cartas usadas en la mano ganadora
  console.log('Cartas utilizadas en la mano ganadora:', winner.bestHand.cardsUsed);

  // Mostrar las cartas ganadoras (asegurarse de que están en el formato correcto)
  const cartasGanadoras = winner.bestHand.cardsUsed.map(card => {
    if (typeof card === 'string') {
      return card; // Si es un string, devolverlo tal cual
    } else {
      return JSON.stringify(card); // Si no es un string, convertir a string para depuración
    }
  }).join(', ');

  console.log(`Cartas ganadoras: ${cartasGanadoras}`);
  const potAmount = pot;
  players.forEach(p => {
    if (p.name === winner.name) {
        p.adjustChips(pot); // Añadir el pot al ganador
        setTimeout(() => {
          alert(`El ganador es: ${winner.name} con la mano: ${winner.bestHand.type}.\n
          Cartas ganadoras: ${winner.bestHand.cardsUsed.map(card => card).join(', ')}.\n
          ${winner.name} ganó ${potAmount} fichas. Total de fichas: ${p.chips}`);
        }, 1000);
        
    }
});
pot = 0;

}



function evaluateHand(cards) {
  const handRanks = {
    'high_card': 1,
    'one_pair': 2,
    'two_pair': 3,
    'three_of_a_kind': 4,
    'straight': 5,
    'flush': 6,
    'full_house': 7,
    'four_of_a_kind': 8,
    'straight_flush': 9,
    'royal_flush': 10
  };

  const isFlush = (cards) => {
    const suits = cards.map(card => card.slice(-1));
    return suits.every(suit => suit === suits[0]);
  };

  const isStraight = (ranks) => {
    ranks = [...new Set(ranks)]; // Eliminar duplicados
    const sortedRanks = ranks.sort((a, b) => a - b);
    return sortedRanks.every((rank, i) => i === 0 || rank === sortedRanks[i - 1] + 1);
  };

  const countRanks = (ranks) => {
    const rankCount = {};
    ranks.forEach(rank => rankCount[rank] = (rankCount[rank] || 0) + 1);
    return rankCount;
  };

  const rankToValue = rank => {
    if (rank === 'A') return 14;
    if (rank === 'K') return 13;
    if (rank === 'Q') return 12;
    if (rank === 'J') return 11;
    return parseInt(rank);
  };

  const ranks = cards.map(card => rankToValue(card.slice(0, -1)));
  const rankCount = countRanks(ranks);

  // Identificar si es color
  if (isFlush(cards)) {
    if (isStraight(ranks)) {
      return {
        type: 'straight_flush',
        rank: Math.max(...ranks),
        cardsUsed: cards // Todas las cartas forman el straight flush
      };
    }
    return {
      type: 'flush',
      rank: Math.max(...ranks),
      cardsUsed: cards // Todas las cartas forman el flush
    };
  }

  // Identificar si es escalera
  if (isStraight(ranks)) {
    return {
      type: 'straight',
      rank: Math.max(...ranks),
      cardsUsed: cards // Todas las cartas forman la escalera
    };
  }

  // Identificar manos con combinaciones repetidas (póker, full house, trío, pareja, etc.)
  const rankCounts = Object.values(rankCount).sort((a, b) => b - a);
  if (rankCounts[0] === 4) {
    const fourOfAKindCard = Object.keys(rankCount).find(rank => rankCount[rank] === 4);
    return {
      type: 'four_of_a_kind',
      rank: parseInt(fourOfAKindCard),
      cardsUsed: cards.filter(card => rankToValue(card.slice(0, -1)) === parseInt(fourOfAKindCard))
    };
  }

  if (rankCounts[0] === 3 && rankCounts[1] === 2) {
    const threeOfAKindCard = Object.keys(rankCount).find(rank => rankCount[rank] === 3);
    return {
      type: 'full_house',
      rank: parseInt(threeOfAKindCard),
      cardsUsed: cards.filter(card => rankToValue(card.slice(0, -1)) === parseInt(threeOfAKindCard))
    };
  }

  if (rankCounts[0] === 3) {
    const threeOfAKindCard = Object.keys(rankCount).find(rank => rankCount[rank] === 3);
    return {
      type: 'three_of_a_kind',
      rank: parseInt(threeOfAKindCard),
      cardsUsed: cards.filter(card => rankToValue(card.slice(0, -1)) === parseInt(threeOfAKindCard))
    };
  }

  if (rankCounts[0] === 2 && rankCounts[1] === 2) {
    const pairRanks = Object.keys(rankCount).filter(rank => rankCount[rank] === 2).map(rank => parseInt(rank));
    return {
      type: 'two_pair',
      rank: Math.max(...pairRanks),
      cardsUsed: cards.filter(card => pairRanks.includes(rankToValue(card.slice(0, -1))))
    };
  }

  if (rankCounts[0] === 2) {
    const pairCard = Object.keys(rankCount).find(rank => rankCount[rank] === 2);
    return {
      type: 'one_pair',
      rank: parseInt(pairCard),
      cardsUsed: cards.filter(card => rankToValue(card.slice(0, -1)) === parseInt(pairCard))
    };
  }

  // Caso de carta alta
  return {
    type: 'high_card',
    rank: Math.max(...ranks),
    cardsUsed: [cards.find(card => rankToValue(card.slice(0, -1)) === Math.max(...ranks))]
  };
}

// Comparar manos de los jugadores
function compareHands(handA, handB) {
  const handRanks = {
      'high_card': 1,
      'one_pair': 2,
      'two_pair': 3,
      'three_of_a_kind': 4,
      'straight': 5,
      'flush': 6,
      'full_house': 7,
      'four_of_a_kind': 8,
      'straight_flush': 9,
      'royal_flush': 10
  };

  if (handRanks[handA.type] > handRanks[handB.type]) return -1;
  if (handRanks[handA.type] < handRanks[handB.type]) return 1;

  // Si son del mismo tipo de mano, desempatar por el valor de la mejor carta
  if (handA.rank > handB.rank) return -1;
  if (handA.rank < handB.rank) return 1;

  return 0;
}

