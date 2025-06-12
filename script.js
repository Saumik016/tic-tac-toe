const board = document.getElementById('board');
const statusText = document.getElementById('status');
const toggleTheme = document.getElementById('toggleTheme');

let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'local';
let player1 = 'Player 1';
let player2 = 'Player 2';

const WINNING_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function startGame() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', handleClick, { once: true });
    board.appendChild(cell);
  }

  currentPlayer = 'X';
  gameActive = true;
  gameMode = document.getElementById('mode').value;
  player1 = document.getElementById('player1').value || 'Player 1';
  player2 = document.getElementById('player2').value || (gameMode === 'ai' ? 'Computer' : 'Player 2');
  statusText.textContent = `${player1}'s (X) turn`;
}

function handleClick(e) {
  if (!gameActive) return;
  const cell = e.target;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);

  if (checkWin(currentPlayer)) {
    statusText.textContent = `${currentPlayer === 'X' ? player1 : player2} wins!`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = `It's a draw!`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${currentPlayer === 'X' ? player1 : player2}'s (${currentPlayer}) turn`;

  if (gameMode === 'ai' && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}


function computerMove() {
  const bestMove = getBestMove();
  if (bestMove !== null) {
    board.children[bestMove].click();
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let move = null;
  const cells = [...board.children];

  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].textContent) {
      cells[i].textContent = 'O';
      let score = minimax(cells, 0, false);
      cells[i].textContent = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(cells, depth, isMaximizing) {
  if (checkWinForMinimax(cells, 'O')) return 10 - depth;
  if (checkWinForMinimax(cells, 'X')) return depth - 10;
  if (cells.every(cell => cell.textContent)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].textContent) {
        cells[i].textContent = 'O';
        let score = minimax(cells, depth + 1, false);
        cells[i].textContent = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].textContent) {
        cells[i].textContent = 'X';
        let score = minimax(cells, depth + 1, true);
        cells[i].textContent = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinForMinimax(cells, player) {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => cells[index].textContent === player)
  );
}

function checkWin(player) {
  const cells = [...board.children];
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => cells[index].textContent === player)
  );
}

function isDraw() {
  return [...board.children].every(cell => cell.textContent);
}

function restartGame() {
  startGame();
}

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Auto-start the game on page load
startGame();
