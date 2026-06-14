let moving = false;
let roomCode = "";
let players = [];
let cellTypes = {};
let totalSkips = 0;


// Listas de retos
const instantChallenges = [
  "🍺 Bebe del vaso del jugador de tu izquierda",
  "📱 Enseña la última foto de tu galería",
  "📩 Enseña el último mensaje enviado",
  "🤥 Cuenta dos mentiras y una verdad",
  "🎤 Imita a un famoso hasta que alguien lo adivine",
  "🎵 Tararea una canción hasta que alguien la adivine",
  "👀 Mantén contacto visual con alguien durante 10 segundos",
  "📸 Sube un selfie de grupo a stories",
  "🧠 Di 5 países en menos de 5 segundos",
  "🍺Termina tu copa",
  "🥶 Habla con acento extranjero durante 30 segundos",
  "🎨 Dibuja con los ojos cerrados lo que diga el jugador de la izquierda: ¿lo han adivinado los demás?",
  "💪 Haz 10 sentadillas"
];

const lastingChallenges = [
  "🗣️ Habla como Siri hasta tu siguiente turno",
  "🚫 No puedes decir 'sí' hasta tu siguiente turno",
  "🚫 No puedes decir 'no' hasta tu siguiente turno",
  "👑 Llama 'capitán' al jugador de tu derecha hasta tu siguiente turno",
  "✋ Cada vez que hables debes levantar la mano",
  "🤖 Habla como un robot hasta tu siguiente turno",
  "👑 Termina todas tus frases con 'mi rey/reina' hasta tu siguiente turno",
  "🫵 No señales con el dedo durante una ronda",
  "🗣️ No hables durante una ronda",
  "🦆 Termina todas tus frases con 'Cuack' hasta tu siguiente turno"
];

//Lista de penalizaciones
const penalties = [
  {text:"🍺 Bebe 3 tragos", action:"drink3"},
  {text:"🍺 Bebe 2 tragos", action:"drink2"},
  {text:"🍺 Termina tu bebida", action:"drinkall"},  
  {text:"⬅️ Retrocede 2 casillas", action:"back3"},
  {text:"🚫 Pierdes tu próximo turno", action:"skip"},
];

const hardPenalties = [
  {text:"⬅️ Retrocede 5 casillas", action:"back5"},
  {text:"🚫 Pierdes 2 turnos", action:"skip2"},
  {text:"🔄 Vuelves a la casilla de salida", action:"backStart"}
];

function getRandomChallenge(){
  return instantChallenges[
    Math.floor(Math.random() * instantChallenges.length)
  ];
}

//fichas en el tablero disponibles
const availableTokens = ["😈","👻","💀","🤡","👽","🤖","🐸","🐧","🦆","🦈","🐙","🦀",
                         "🦊","🐺","🐼","🦝","🐢","🦖","🍺","🍷","🍕","🍔","🌮","🍩",
                         "🔥","⚡","💣","🎲","🎯","🏆"];

let selectedToken = null;
let currentChallenge = null;

let pendingEvent = null;
let currentPlayer = null;

let currentPenalty = null;

// Creamos el codigo de la sala
function randomCode() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"; //caracteres del codigo de sala
  let code = "";

  for(let i=0;i<4;i++){code += chars[Math.floor(Math.random()*chars.length)];}

  return code;
}

// Creamos la sala con todos los jugadores cada uno con su ficha sin repetir
function createRoom(){
  const name =
    document.getElementById("playerName").value; //Introducimos el nombre del jugador

  // No permitimos nombres vacios
  if(!name){alert("Pon tu nombre");
    return;
  }

  roomCode = randomCode(); // Se genera el código de sala

  players = [{
  name:name,
  position:0,
  skipTurns:0
}]; //Se crea un jugador y se guarda su posición inicial (casilla start)

  document.getElementById("menu").style.display =
    "none";

  document.getElementById("lobby").style.display =
    "block";

  document.getElementById("roomName").innerText =
    roomCode;

  updateLobby(); // se van añadiendo jugadores al lobby

// Actualizamos la lista de fichas
  renderTokens();
  
} // Sala creada

// Actualizamos la lista de fichas definiendo la función renderTokens()
function renderTokens(){
const container =
  document.getElementById("tokenSelector"); // guardamos la ficha del jugador

container.innerHTML = "";

// Actualizamos la lista de fichas disponibles
availableTokens.forEach(token=>{
  const div =
    document.createElement("div");

  div.className = "token";

  div.innerHTML = token;

  div.onclick = ()=>{
    selectedToken = token;

    document
      .getElementById("chosenToken")
      .innerText = token;

    document
      .querySelectorAll(".token")
      .forEach(t=>t.classList.remove("selected"));

    div.classList.add("selected");
  };

  container.appendChild(div);

});

} 

// Añadimos jugadores a la sala vía código (en desarrollo)
function joinRoom(){
  alert(
    "Todavía no funciona. Lo conectaremos con Firebase."
  );
}

// Actualizamos el lobby
function updateLobby(){
  let text = "";

  players.forEach(player=>{
    text += "🎮 " + player.name + "<br>";
});

  document.getElementById("playerList").innerHTML =
    text;
}

// Iniciamos el juego
function startGame(){
  document.getElementById("lobby").style.display =
    "none";

  document.getElementById("game").style.display =
    "block";

  generateBoardTypes(); // Asiganmos de forma random las casillas
  
  createBoard(); // Creamos el tablero

  updateBoard(); // Lo actualizamos

}

function createBoard(){
  const board =
    document.getElementById("board");

  board.innerHTML = "";

  for(let i=69;i>=0;i--){

    const cell =
      document.createElement("div");

    cell.className = "cell";
    
    const type = cellTypes[i];
    
    if(type){cell.classList.add(type);}
    
    cell.id = "cell-" + i;

    cell.innerHTML = i;

    board.appendChild(cell);

  }

}

function updateBoard(){

  document
    .querySelectorAll(".player")
    .forEach(x=>x.remove());

  players.forEach(player=>{

    const token =
      document.createElement("div");

    token.className = "player";

    token.innerHTML =
  selectedToken || "😈";

    document
      .getElementById("cell-" + player.position)
      .appendChild(token);

  });

}

// Generamos tipos de casillas
function generateBoardTypes(){
  cellTypes = {};
  let availableCells = [];

  // Casillas 1-69
  for(let i=1;i<=69;i++){
    availableCells.push(i);
  }

  function assign(type, amount){
    for(let i=0;i<amount;i++){
      const randomIndex =
        Math.floor(Math.random()*availableCells.length);

      const cell =
        availableCells[randomIndex];

      cellTypes[cell] = type;
      availableCells.splice(randomIndex,1);
    }
  }
  assign("reto",25);
  assign("especial",18);
  assign("tablero",10);
}

// Movimiento animado de las fichas
function animateMove(player, steps){
  console.log("ANIMATE", steps);
  let moved = 0;
  const interval = setInterval(()=>{
    if(player.position < 69){
      player.position++;
      updateBoard();}
    
    moved++;
  

    if(moved >= steps ||
      player.position >= 69){

      clearInterval(interval);

      flashCell(player.position);
    
      setTimeout(()=>{
    
        if(player.position >= 69){victory(player);}
        else{checkCell(player);}
    
        moving = false;
    
      },800);


      return;
    } 
  }, 350); //350ms es el tiempo que tarda en cada paso

}

// Tiramos el dado
function rollDice(){
  console.log("ROLL");
  if(moving){
    return;
  }

  moving = true;
  
  const dice =
    Math.floor(Math.random()*6)+1;

  const player = players[0];

  if(player.skipTurns > 0){player.skipTurns--;

    showEvent("🚫 TURNO PERDIDO 🚫",
      "Pierdes este turno");

    return;}


  if(player.position > 69){player.position = 69;} // Evitamos que el jugador se salga del tablero
  // Este comando implica que no hace falta sacar el número justo para entrar, solo el valor igual
  // o mayor a las casillas que faltan (no se rebota)
  
  document
    .getElementById("diceResult")
    .innerText =
      "Has sacado un " + dice;

  animateMove(player, dice);
  
  return;
}

// Popup de victoria
function victory(player){

  document
    .getElementById("winnerText")
    .innerText =
      player.name + " ha ganado";

  document
    .getElementById("victoryPopup")
    .style.display =
      "flex";
  // Explosiones de confetti al ganador
  for(let i=0;i<5;i++){
  setTimeout(()=>{
    confetti({
      particleCount:100,
      spread:120,
      origin:{x:Math.random(), y:Math.random()*0.5}, zIndex:99999});},
      i*300);}
      
}

// Checkeamos en que casilla hemos caido
function checkCell(player){

  console.log("CHECK", player.position);

  const type = cellTypes[player.position];

  if(!type){
    return;
  }

  if(type == "reto"){
    const challenge = getRandomChallenge();
    showChallenge(challenge);
    return;
  }

  if(type == "especial"){
    showEvent(
      "⭐ CASILLA ESPECIAL ⭐",
      "Has robado una carta"
    );
    return;
  }

  if(type == "tablero"){
    currentPlayer = player;
    const events = [
      {text:"⬅️ Retrocede 2 casillas",
        action:"back2"},

      {text:"➡️ Avanza 3 casillas",
        action:"forward3"}
    ];

    const event =
      events[Math.floor(Math.random()*events.length)];
  
    pendingEvent = event.action;
  
    showEvent("♟️ CASILLA DE EVENTO ♟️",
      event.text
    );
  
    return;
  }
}
      
// Enseñamos el reto
function showChallenge(challenge){
  console.log("SHOW CHALLENGE");
  currentChallenge = challenge;
  
  document
    .getElementById("challengeText")
    .innerText =
      challenge;

  document
    .getElementById("challengePopup")
    .style.display =
      "flex";

}

//cerramos la ventana
function closeChallenge(success){

  document
    .getElementById("challengePopup")
    .style.display =
      "none";

  if(!success){

    totalSkips++;

    showPenalty();
  }

}


function showEvent(title,text){
  document
    .getElementById("eventTitle")
    .innerText = title;

  document
    .getElementById("eventText")
    .innerText = text;

  document
    .getElementById("eventPopup")
    .style.display = "flex";

}

function closeEvent(){
  document
    .getElementById("eventPopup")
    .style.display =
      "none";

  if(pendingEvent == "forward3"){animateMove(currentPlayer, 3);}

  if(pendingEvent == "back2"){animateMoveBack(currentPlayer, 2);}

  pendingEvent = null;

}


// Funcion de retroceso
function animateMoveBack(player, steps){

  let moved = 0;

  const interval = setInterval(()=>{

    if(player.position > 0){

      player.position--;

      updateBoard();

    }

    moved++;

    if(moved >= steps){

        clearInterval(interval);

        setTimeout(()=>{
      
          flashCell(player.position);
      
          setTimeout(()=>{
            checkCell(player);
          },600);

  },300);

}

  },350);

}


// Enseñamos las penalizaciones
function showPenalty(){

  let availablePenalties;

  if(totalSkips < 5){availablePenalties = penalties;}
  else{availablePenalties = hardPenalties;}
  
  const penalty =
    availablePenalties[Math.floor(Math.random()*availablePenalties.length)];

  currentPenalty =
    penalty.action;

  document
    .getElementById("penaltyText")
    .innerText =
      penalty.text;

  document
    .getElementById("penaltyPopup")
    .style.display =
      "flex";

}
function closePenalty(){

  document
    .getElementById("penaltyPopup")
    .style.display =
      "none";

  const player =
    players[0];

  if(currentPenalty == "back3"){

    animateMoveBack(player,3);

  }

  if(currentPenalty == "skip"){

    if(!player.skipTurns){
      player.skipTurns = 0;
    }

    player.skipTurns++;

  }

  currentPenalty = null;

}

if(currentPenalty == "backStart"){

  player.position = 0;

  updateBoard();

  flashCell(0);

}

// Destello casillas
function flashCell(position){

  const cell =
    document.getElementById(
      "cell-" + position
    );

  if(!cell){
    return;
  }

  let effect = "flash-normal";

  if(position >= 69){
    effect = "flash-meta";
  }
  else{

    const type =
      cellTypes[position];

    if(type == "reto"){
      effect = "flash-reto";
    }

    if(type == "especial"){
      effect = "flash-especial";
    }

    if(type == "tablero"){
      effect = "flash-tablero";
    }

  }

  if(effect){

    cell.classList.add(effect);

    setTimeout(()=>{
      cell.classList.remove(effect);
    },1200);

  }

}
