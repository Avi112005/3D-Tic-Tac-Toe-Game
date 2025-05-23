document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    const twoPlayerBtn = document.getElementById('two-player-btn');
    const vsComputerBtn = document.getElementById('vs-computer-btn');
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const modeDisplay = document.getElementById('mode-display');
    const resetBtn = document.getElementById('reset-btn');
    const homeBtn = document.getElementById('home-btn');
    const xScore = document.getElementById('x-score');
    const oScore = document.getElementById('o-score');

    // Game state
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0 };
    let isComputerMode = false;
    let isComputerTurn = false;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Mode selection handlers
    twoPlayerBtn.addEventListener('click', () => {
        isComputerMode = false;
        startGame('2 Players Mode');
    });

    vsComputerBtn.addEventListener('click', () => {
        isComputerMode = true;
        startGame('VS Computer Mode');
    });

    function startGame(mode) {
        homeScreen.classList.remove('active');
        gameScreen.classList.add('active');
        modeDisplay.textContent = mode;
        resetGame();
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.dataset.index;

        if (gameBoard[index] !== '' || !gameActive || (isComputerMode && isComputerTurn)) return;

        makeMove(cell, index);

        if (isComputerMode && gameActive) {
            isComputerTurn = true;
            setTimeout(computerMove, 700);
        }
    }

    function makeMove(cell, index) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        cell.style.transform = 'translateZ(20px)';
        setTimeout(() => {
            cell.style.transform = 'translateZ(0)';
        }, 300);

        checkResult();
    }

    function computerMove() {
        if (!gameActive) return;

        let index = findBestMove();
        const cell = cells[index];
        makeMove(cell, index);
        isComputerTurn = false;
    }

    function findBestMove() {
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'O';
                if (checkWinner('O')) {
                    gameBoard[i] = '';
                    return i;
                }
                gameBoard[i] = '';
            }
        }

        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'X';
                if (checkWinner('X')) {
                    gameBoard[i] = '';
                    return i;
                }
                gameBoard[i] = '';
            }
        }

        if (gameBoard[4] === '') return 4;

        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => gameBoard[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        const availableMoves = gameBoard.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    function checkWinner(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => gameBoard[index] === player);
        });
    }

    function checkResult() {
        let roundWon = false;

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                roundWon = true;
                highlightWinningCells([a, b, c]);
                break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            scores[currentPlayer]++;
            updateScores();
            return;
        }

        if (!gameBoard.includes('')) {
            status.textContent = 'Game ended in a draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    function highlightWinningCells(combination) {
        combination.forEach(index => {
            cells[index].classList.add('win');
        });
    }

    function updateScores() {
        xScore.textContent = scores.X;
        oScore.textContent = scores.O;
    }

    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        isComputerTurn = false;
        status.textContent = `Player ${currentPlayer}'s turn`;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
            cell.style.transform = 'translateZ(0)';
        });

        board.style.transform = 'rotateX(180deg)';
        setTimeout(() => {
            board.style.transform = 'rotateX(10deg)';
        }, 300);
    }

    function returnToHome() {
        gameScreen.classList.remove('active');
        homeScreen.classList.add('active');
        scores = { X: 0, O: 0 };
        updateScores();
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);
    homeBtn.addEventListener('click', returnToHome);

    // Hover effects
    cells.forEach(cell => {
        cell.addEventListener('mouseover', () => {
            if (cell.textContent === '' && gameActive) {
                cell.classList.add('hover');
            }
        });
        cell.addEventListener('mouseout', () => {
            cell.classList.remove('hover');
        });
    });
});
