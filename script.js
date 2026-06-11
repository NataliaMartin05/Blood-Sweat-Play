let roomCode = "";
let players = [];

const availableTokens = [

  "😈","👻","💀","🤡","👽","🤖",

  "🐸","🐧","🦆","🦈","🐙","🦀",
  "🦊","🐺","🐼","🦝","🐢","🦖",

  "🍺","🍷","🍕","🍔","🌮","🍩",

  "🔥","⚡","💣","🎲","🎯","🏆"

];

let selectedToken = null;

function randomCode() {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

  let code = "";

  for(let i=0;i<4;i++){
    code += chars[Math.floor(Math.random()*chars.length)];
  }

  return code;
}

function createRoom(){

  const name =
    document.getElementById("playerName").value;

  if(!name){
    alert("Pon tu nombre");
    return;
  }

  roomCode = randomCode();

  players = [name];

  document.getElementById("menu").style.display =
    "none";

  document.getElementById("lobby").style.display =
    "block";

  document.getElementById("roomName").innerText =
    roomCode;

  updateLobby();
  function renderTokens(){

  const container =
    document.getElementById("tokenSelector");

  container.innerHTML = "";

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
  renderTokens();
}

function joinRoom(){

  alert(
    "Todavía no funciona. Lo conectaremos con Firebase."
  );

}

function updateLobby(){

  let text = "";

  players.forEach(player=>{
    text += "🎮 " + player + "<br>";
  });

  document.getElementById("playerList").innerHTML =
    text;
}


function startGame(){

  document.getElementById("lobby").style.display =
    "none";

  document.getElementById("game").style.display =
    "block";

  createBoard();

  updateBoard();

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
      .getElementById("cell-0")
      .appendChild(token);

  });

}

function rollDice(){

  const dice =
    Math.floor(Math.random()*6)+1;

  document
    .getElementById("diceResult")
    .innerText =
      "Has sacado un " + dice;

}
