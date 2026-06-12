let roomCode = "";
let players = [];
//fichas en el tablero disponibles
const availableTokens = ["😈","👻","💀","🤡","👽","🤖","🐸","🐧","🦆","🦈","🐙","🦀",
                         "🦊","🐺","🐼","🦝","🐢","🦖","🍺","🍷","🍕","🍔","🌮","🍩",
                         "🔥","⚡","💣","🎲","🎯","🏆"];

let selectedToken = null;

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
    text += "🎮 " + player + "<br>";
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

// Tiramos el dado
function rollDice(){

  const dice =
    Math.floor(Math.random()*6)+1;

  const player =
    players[0];

  player.position += dice;

  if(player.position > 69){player.position = 69;} // Evitamos que el jugador se salga del tablero
  // Este comando implica que no hace falta sacar el número justo para entrar, solo el valor igual
  // o mayor a las casillas que faltan (no se rebota)

  document
    .getElementById("diceResult")
    .innerText =
      "Has sacado un " + dice;

  updateBoard();
}
