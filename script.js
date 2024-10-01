//INICIO DEL JUEGO
let isAdmin = false;
function admin() {
  const username = prompt("Enter username:");
  const password = prompt("Enter password:");

  if (username === 'admin' && password === 'prueba') {
    alert("Admin login successful!");
    isAdmin = true; // Set admin to true on successful login
  } else {
    alert("Incorrect username or password.");
    isAdmin = false; // Set admin to false if login fails
  }
}


class Player {
  constructor(name, chips) {
    this.name = name;
    this.chips = chips;
    this.cards = [];
    this.currentBet = 0;
    this.hasBet = false;
    this.isFolded = false;
    this.hasPlayed = false; // Nueva propiedad para verificar si ya ha jugado en la ronda
  }

  deal(cards) {
    this.cards = cards;
  }

  adjustChips(amount) {
    this.chips += amount;
    document.getElementById(`${this.name}-chips`).innerText = this.chips;
  }
}

// Inicializar jugadores
const player = new Player('user', 10000);
const bot1 = new Player('bot1', 10000);
const bot2 = new Player('bot2', 10000);
const bot3 = new Player('bot3', 10000);
const players = [player, bot1, bot2, bot3];

let communityCards = []; 
let currentPlayerIndex = 0;
let pot = 0;
let currentBet = 0;
let currentStage = 0;

function updatePot() {
  const potDiv = document.querySelector('.pot'); // Selecciona el div con la clase 'pot'
  potDiv.textContent = pot; // Actualiza el contenido del div con el valor de 'pot'
}

let deck = [
  '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥',
  '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦',
  '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣',
  '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠'
];

function removeCard() {
  if (deck.length === 0) {
    const potCards = document.getElementsByClassName("cards-pot");
    if (potCards.length > 0) {
      potCards[0].style.display = "none"; // Ocultar el contenedor cuando deck esté vacío
    }
  }
}
function addCard() {
  if (deck.length > 0) {
    const potCards = document.getElementsByClassName("cards-pot");
    if (potCards.length > 0) {
      potCards[0].style.display = "flex"; // Mostrar el contenedor cuando el deck tiene cartas
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
  }, 100);
}

//FINPARTE BUENA


function startGame() {
  communityCards.length = 0;
  players.forEach(player => {
    player.cards = [];
    player.hasPlayed = false; // Reiniciar la propiedad en cada nueva ronda
    player.hasBet = false; // Asegurarse de que también reinicie hasBet
  });
  resetDeck();
  shuffleDeck();
 
  dealCards(); // Repartir cartas
  currentStage = 0;
  resetBettingRound();
  hideBotCards();
}



// Reseteo de la ronda de apuestas
function resetBettingRound() {
  players.forEach(player => {
    player.hasBet = false;
    player.isFolded = false;
    player.currentBet = 0;
  });
}








// Verificar si todos los jugadores han apostado
function bettingRoundOver() {
  return players.every(player => player.isFolded || player.hasBet);
}







function nextRound() {
  communityCards.length = 0; 
  currentPlayerIndex = 0; 
  players.forEach(player => player.cards = []); 
  shuffleDeck();
  dealCards(); 
  currentStage = 0; 
  resetBettingRound(); 
  nextStage(); 
  hideBotCards()
  addCard()
  console.log(deck.length)
}

function nextStage() {
  if (currentStage === 1) {
    communityCards.push(deck.pop(), deck.pop(), deck.pop());
    displayFlop();
  } else if (currentStage === 2) {
    communityCards.push(deck.pop());
    displayTurn();
  } else if (currentStage === 3) {
    communityCards.push(deck.pop());
    displayRiver();
  } else if (currentStage === 4) {
    evaluateWinner();
    revealBotCards();
  }
}












// INICIO MOSTRAR CARTAS Y MENSAJES
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
function updateGameMessages(message) {
  const messageElement = document.getElementById('game-messages');
  
  // Crea un nuevo párrafo para cada mensaje
  const newMessage = document.createElement('p');
  newMessage.innerText = message; 
  
  // Agrega el nuevo mensaje al contenedor
  messageElement.appendChild(newMessage);
  
 
  messageElement.scrollTop = messageElement.scrollHeight;
}
// FIN MOSTRAR CARTAS Y MENSAJES














// Función para la acción del bot
function botAction(bot, roundNumber) {
  const botHand = evaluateHand([...bot.cards, ...communityCards]);

  const handStrength = botHand.rank;

  console.log(`Bot: ${bot.name}, Mano: ${botHand.type}, Fuerza: ${handStrength}, CurrentBet (mesa): ${currentBet}, Apuesta del Bot: ${bot.currentBet}, Fichas: ${bot.chips}`);
  
  const betToCall = currentBet - bot.currentBet;
  
  // Límite de apuesta basado en la ronda (puedes ajustar los valores)
  let maxRaise = bot.chips * 0.3; // Máximo que puede apostar basado en su stack
  if (roundNumber <= 3) { // Limitar apuestas altas en las primeras 3 rondas
    maxRaise = Math.min(200, maxRaise); // Límite máximo de 200
  }

  // Lógica del bot
  if (handStrength <= 3) {
    if (betToCall > bot.chips * 0.3) {
      bot.isFolded = true;
      if (isAdmin){
      updateGameMessages(`${bot.name} se retira con una mano débil (${botHand.type}).`);
    }else{
      updateGameMessages(`${bot.name} se retira.`)
    }
      setTimeout(nextTurn, 1800);
      return;
    }
  } else if (handStrength <= 6) {
    if (betToCall <= bot.chips) {
      bot.adjustChips(-betToCall);
      pot += betToCall;
      bot.currentBet += betToCall;
      bot.hasBet = true;
      if (isAdmin){
      updateGameMessages(`${bot.name} hace call con una mano promedio (${botHand.type}). Pot: ${pot}`);
      }else{
        updateGameMessages(`${bot.name} hace call`);
      }
    } else {
      bot.adjustChips(-bot.chips);
      pot += bot.chips;
      bot.currentBet += bot.chips;
      bot.hasBet = true;
      if(isAdmin){

      
      updateGameMessages(`${bot.name} hace all-in con una mano promedio (${botHand.type}). Pot: ${pot}`);
    }else{
      updateGameMessages(`${bot.name} hace all-in`);
    }
    }
  } else {
    if (betToCall <= bot.chips) {
      const raiseAmount = Math.min(currentBet * 2, bot.chips, maxRaise);
      const roundedRaise = Math.ceil(raiseAmount / 50) * 50;
      
      bot.adjustChips(-roundedRaise);
      pot += roundedRaise;
      currentBet = bot.currentBet + roundedRaise;
      bot.currentBet += roundedRaise;
      bot.hasBet = true;
      if(isAdmin){

      
      updateGameMessages(`${bot.name} sube la apuesta a ${currentBet} con una mano fuerte (${botHand.type}). Pot: ${pot}`);
    }else{
      updateGameMessages(`${bot.name} sube la apuesta a ${currentBet}`);
    }
    } else {
      bot.adjustChips(-bot.chips);
      pot += bot.chips;
      bot.currentBet += bot.chips;
      bot.hasBet = true;
      if(isAdmin){

      
      updateGameMessages(`${bot.name} hace all-in con una mano fuerte (${botHand.type}). Pot: ${pot}`);
    }else{
      updateGameMessages(`${bot.name} hace all-in `);
    }
    }
  }

  updatePot()
  setTimeout(nextTurn, 1800);
}

function playTurn() {
  const currentPlayer = players[currentPlayerIndex];
  currentPlayer.hasPlayed = true; // Marcar que el jugador ha jugado

  if (currentPlayer.name === 'user') {
  } else {
    setTimeout(() => {
      botAction(currentPlayer);
    }, 1000);
  }
  updatePot()
} 

function nextTurn() {
  currentPlayerIndex++;

  // Si todos los jugadores han jugado su turno
  if (currentPlayerIndex >= players.length) {
    currentPlayerIndex = 0; // Reinicia el índice de jugadores

    // Si todos han apostado, avanzamos a la siguiente etapa
    if (bettingRoundOver()) { // Asegúrate de que todos han igualado
      currentStage++; // Avanza a la siguiente etapa (Flop, Turn, River o Final)
      nextStage(); // Llama a la siguiente etapa sin demora
    } else {
      handleBettingRound(); // Inicia otra ronda de apuestas si no ha terminado
    }
  } else {
    playTurn(); // Llama al siguiente turno sin demora
  }
}

//JUGADAS
function check() {

  player.hasBet = true; // Marca que el jugador ya apostó
  nextTurn();
  removeCard()
}
function call() {
  if (player.currentBet === undefined) {
    player.currentBet = 0; // Inicializa la apuesta si no lo está
  }

  const betDifference = currentBet - player.currentBet; // Diferencia entre la apuesta más alta y la del jugador

  if (isNaN(betDifference) || betDifference <= 0) {
    player.hasPlayed = true; // Marca que el jugador ha jugado
    player.hasBet = true; // Marca que el jugador ha apostado
    nextTurn();
    return;
  }

  if (player.chips >= betDifference) {
    // El jugador puede cubrir la diferencia
    player.adjustChips(-betDifference); // Restar la diferencia de las fichas del jugador
    player.currentBet += betDifference; // Actualizamos la apuesta del jugador
    pot += betDifference;
    player.hasBet = true; // Marca que el jugador ya apostó
    player.hasPlayed = true; // Marca que el jugador ha jugado
    console.log(`Player called. Pot total: ${pot}`);
  } else {
    // El jugador hace "all-in"
    console.log(`Player is forced to go all-in. Remaining chips: ${player.chips}`);
    pot += player.chips;
    player.currentBet += player.chips; // Apuesta todas sus fichas restantes
    player.chips = 0; // El jugador se queda sin fichas
    player.hasBet = true;
    player.hasPlayed = true; // Marca que el jugador ha jugado
    console.log(`Player goes all-in. Pot total: ${pot}`);
  }

  nextTurn();  // Mover al siguiente turno después de la apuesta
}


function raise() {
  const raiseAmount = parseInt(prompt("¿Cuánto quieres subir?"), 10);
  if (isNaN(raiseAmount) || raiseAmount <= 0) {
    console.log("El monto ingresado no es válido");
    return;
  }

  const totalRaise = currentBet + raiseAmount; // Nueva apuesta total
  const raiseDifference = totalRaise - player.currentBet; // La diferencia que el jugador debe cubrir

  if (player.chips >= raiseDifference) {
    player.adjustChips(-raiseDifference); // Ajusta las fichas del jugador por la diferencia
    pot += raiseDifference; // Agrega la diferencia al pot
    currentBet = totalRaise; // **Asegurarse de que currentBet se actualice aquí**
    player.currentBet = totalRaise; // Actualiza la apuesta del jugador
    player.hasBet = true;
    console.log(`Player raised to ${currentBet}. Pot total: ${pot}`);
  } else {
    console.log('Not enough chips to raise');
  }

  nextTurn(); // Mover al siguiente turno después de la subida
}
function fold() {
  console.log('Player folded');
  player.isFolded = true; // Marca que el jugador se ha retirado
  players.splice(players.indexOf(player), 1); // Elimina al jugador de la partida
  nextTurn();
  removeCard()
}

//FIN DE JUGADAS










































/////INICIO PARTE BUENA

// Función para evaluar el ganador
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

// Función para evaluar al ganador y eliminar jugadores sin fichas
function evaluateWinner() {
  const players = [player, bot1, bot2, bot3].filter(p => !p.isFolded); // Filtramos jugadores retirados

  if (players.length === 1) {
    console.log(`El único jugador restante es: ${players[0].name}. Gana por default.`);
    return;
  }

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
  const secondPlace = hands[1]; // El segundo mejor
  const thirdPlace = hands[2]; // El tercer mejor (si hay al menos 3 jugadores)

  console.log(`El ganador es: ${winner.name} con la mano: ${winner.bestHand.type}`);
  console.log(`Segundo lugar: ${secondPlace.name} con la mano: ${secondPlace.bestHand.type}`);
  if (thirdPlace) {
    console.log(`Tercer lugar: ${thirdPlace.name} con la mano: ${thirdPlace.bestHand.type}`);
  }

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
  
  // Añadir el pot al ganador
  players.forEach(p => {
    if (p.name === winner.name) {
      p.adjustChips(pot); 
      setTimeout(() => {
        alert(`El ganador es: ${winner.name} con la mano: ${winner.bestHand.type}.\n
        Cartas ganadoras: ${winner.bestHand.cardsUsed.map(card => card).join(', ')}.\n
        ${winner.name} ganó ${potAmount} fichas. Total de fichas: ${p.chips}`);
      }, 1000);
    }
  });

  // Calcular diferencia entre el ganador y el segundo lugar
  const comparison = compareHands(winner.bestHand, secondPlace.bestHand);
  let message = `El segundo lugar es ${secondPlace.name} con la mano: ${secondPlace.bestHand.type}.`;

  if (comparison === 0) {
    message += " Fue un empate técnico, pero ganó el que tenía la mejor carta secundaria.";
  } else if (comparison === -1) {
    message += " El segundo lugar estuvo cerca de ganar, pero perdió por una ligera diferencia.";
  } else {
    message += " La diferencia entre el ganador y el segundo lugar fue significativa.";
  }

  // Mostrar el mensaje al usuario
  setTimeout(() => {
    alert(message);
    if (thirdPlace) {
      alert(`El tercer lugar fue ${thirdPlace.name} con la mano: ${thirdPlace.bestHand.type}.`);
    }
  }, 1500);

  pot = 0;

  // Eliminar jugadores sin fichas
  players.forEach(p => {
    if (p.chips <= 0) {
      eliminatePlayer(p); // Elimina al jugador si se quedó sin fichas
    }
  });
}


// Función para eliminar un jugador sin fichas
function eliminatePlayer(player) {
  // Remover visualmente al jugador del DOM
  const playerElement = document.getElementById(player.name);
  if (playerElement) {
    playerElement.remove();
  }

  // Eliminar al jugador del array de jugadores activos
  const playerIndex = players.findIndex(p => p.name === player.name);
  if (playerIndex !== -1) {
    players.splice(playerIndex, 1); // Elimina el jugador del array
  }

  console.log(`${player.name} ha sido eliminado del juego por quedarse sin fichas.`);
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

