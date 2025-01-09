// Classe Player
class Player {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
  }
}

// Classe GameUI
class GameUI {
  constructor() {
    this.board = document.getElementById("board");
    this.cells = document.querySelectorAll(".cell");
    this.currentPlayerDisplay = document.getElementById("current-player");
    this.xCountDisplay = document.getElementById("x-count");
    this.oCountDisplay = document.getElementById("o-count");
    this.winnerDisplay = document.getElementById("winner");
    this.resetButton = document.getElementById("reset-button");
  }

  updateCell(cell, symbol) {
    const element = document.createElement("span");
    element.className = symbol === "X" ? "cross" : "circle";
    cell.appendChild(element);
  }

  updateCurrentPlayer(player) {
    this.currentPlayerDisplay.textContent = `Au tour de ${player.name} de jouer`;
  }

  updateCounts(xCount, oCount) {
    this.xCountDisplay.textContent = `Nombre de X : ${xCount}`;
    this.oCountDisplay.textContent = `Nombre de O : ${oCount}`;
  }

  updateWinner(winner) {
    this.winnerDisplay.textContent = winner
      ? `Vainqueur de la partie : ${winner.name}`
      : "";
  }

  clearBoard() {
    this.cells.forEach((cell) => (cell.innerHTML = ""));
  }
}

// Classe Game
class Game {
  constructor(player1, player2, gameUI) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameUI = gameUI;
    this.currentPlayer = player1;
    this.boardState = Array(9).fill(null);
    this.xCount = 0;
    this.oCount = 0;
    this.isGameActive = true;

    this.initGame();
  }

  initGame() {
    this.gameUI.cells.forEach((cell, index) => {
      cell.addEventListener("click", () => this.handleCellClick(cell, index));
    });

    this.gameUI.resetButton.addEventListener("click", () => this.resetGame());
    this.gameUI.updateCurrentPlayer(this.currentPlayer);
    this.gameUI.updateCounts(this.xCount, this.oCount);
  }

  handleCellClick(cell, index) {
    if (!this.isGameActive || this.boardState[index] !== null) return;

    this.boardState[index] = this.currentPlayer.symbol;
    this.gameUI.updateCell(cell, this.currentPlayer.symbol);

    if (this.currentPlayer.symbol === "X") {
      this.xCount++;
    } else {
      this.oCount++;
    }

    if (this.checkWin()) {
      this.isGameActive = false;
      this.gameUI.updateWinner(this.currentPlayer);
    } else if (this.boardState.every((cell) => cell !== null)) {
      this.isGameActive = false;
      this.gameUI.updateWinner({ name: "Match nul" });
    } else {
      this.switchPlayer();
    }

    this.gameUI.updateCounts(this.xCount, this.oCount);
  }

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
    this.gameUI.updateCurrentPlayer(this.currentPlayer);
  }

  checkWin() {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return (
        this.boardState[a] &&
        this.boardState[a] === this.boardState[b] &&
        this.boardState[a] === this.boardState[c]
      );
    });
  }

  resetGame() {
    this.boardState.fill(null);
    this.xCount = 0;
    this.oCount = 0;
    this.isGameActive = true;
    this.currentPlayer = this.player1;
    this.gameUI.clearBoard();
    this.gameUI.updateWinner(null);
    this.gameUI.updateCurrentPlayer(this.currentPlayer);
    this.gameUI.updateCounts(this.xCount, this.oCount);
  }
}

// Initialisation
const player1 = new Player("Goku", "X");
const player2 = new Player("Saitama", "O");
const gameUI = new GameUI();
const game = new Game(player1, player2, gameUI);
