let roomCode = "";
let players = [];
let cellTypes = {};
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

  players = [{name: name,
  position: 0}]; //Se crea un jugador y se guarda su posición inicial (casilla start)

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
  let moved = 0;
  const interval = setInterval(()=>{
    if(player.position < 69){
      player.position++;
      updateBoard();}
    
    moved++;
  

    if(moved >= steps ||
      player.position >= 69){

      clearInterval(interval);

      setTimeout(()=>{
        if(player.position >= 69){victory(player);}
        else{checkCell(player);}
      }, 3000);}

      
  }, 350); //350ms es el tiempo que tarda en cada paso

}

// Tiramos el dado
function rollDice(){

  const dice =
    Math.floor(Math.random()*6)+1;

  const player =
    players[0];

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
  const type = cellTypes[player.position];

  if(!type){return;}

  if(type == "reto"){

    const challenge =
      getRandomChallenge();

    showChallenge(challenge);

    return;

  }

  
  alert("Has caído en una casilla " + type);

}

// Enseñamos el reto
function showChallenge(challenge){
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

  if(success){alert("😎 Reto completado");}
  else{alert("🍺 Penalización pendiente");}

}

