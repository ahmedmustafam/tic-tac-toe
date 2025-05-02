const gameBoard = (function () { // gameBoard object that will contain the board and token func
    const board = [];
    const rows = 3;
    const columns = 3;


    // Creating a 3x3 array for the gameboard, Cell() will be defined elsewhere
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    // filtering for available cells
    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() !== 0) {
            console.log("Already occupied!");
            return false;
        } else {
            board[row][column].addToken(player);
            return true;
        }
    };

    const printBoard = () => {
        const updatedBoard = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(updatedBoard);
    };

    return {
        getBoard,
        dropToken,
        printBoard,
    };
})();

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue,
    };
}

// this will control the flow of the game
const gameController = (function (playerOne = "Player One",
                                  playerTwo = "Player Two",) {

    const board = gameBoard;

    const players = [
        {
            name: "Player 1",
            token: "X"
        },
        {
            name: "Player 2",
            token: "O"
        }
    ]

    // logic to see active player and switch each round
    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`New round, ${getActivePlayer().name}'s turn`);
    }

    let winner = null;

    const playRound = (row, column) => {
        printNewRound();
        const moveSuccessful = board.dropToken(row, column, getActivePlayer().token);

        if (!moveSuccessful) {
            console.log("Invalid move, try again");
            return false;
        }

        const checkWinner = () => {
            const boardArray = gameBoard.getBoard();

            for (let i = 0; i < 3; i++) {
                if (boardArray[i][0].getValue() === boardArray[i][1].getValue() &&
                    boardArray[i][1].getValue() === boardArray[i][2].getValue() &&
                    boardArray[i][0].getValue() !== 0) {
                    return boardArray[i][1].getValue();
                }

                if (boardArray[0][i].getValue() === boardArray[1][i].getValue() &&
                    boardArray[1][i].getValue() === boardArray[2][i].getValue() &&
                    boardArray[0][i].getValue() !== 0) {
                    return boardArray[0][i].getValue();
                }
            }

            if (boardArray[0][0].getValue() === boardArray[1][1].getValue() &&
                boardArray[1][1].getValue() === boardArray[2][2].getValue() &&
                boardArray[0][0] !== 0) {
                return boardArray[0][0].getValue();
            }

            if (boardArray[0][2].getValue() === boardArray[1][1].getValue() &&
                boardArray[1][1].getValue() === boardArray[2][0].getValue() &&
                boardArray[0][2].getValue() !== 0) {
                return boardArray[0][2].getValue();
            }

            return null;
        }

        winner = checkWinner();
        if (winner) {
            console.log(`Game Over! The winner is ${winner === "x" ? "Player 1" : "Player 2"}!`);
            board.printBoard();
            resetGame();
            return true;
        }

        switchActivePlayer();
        printNewRound();
        return true;
    }

    const getWinner = () => winner;

    const resetGame = () => {
        const boardArray = gameBoard.getBoard();
        for(let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                boardArray[i][j].addToken(0)
            }
        }

        activePlayer = players[0];
        console.log('Game has been reset');
    }

    return {
        playRound,
        printNewRound,
        switchActivePlayer,
        getActivePlayer,
        getBoard: board.getBoard(),
        resetGame,
        getWinner
    }

})();


function ScreenController() {
    const game = gameController;
    const playerTurn = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Game';
    resetButton.classList.add('reset');
    document.body.appendChild(resetButton)

    const messageDiv =  document.createElement('div');
    messageDiv.classList.add('message');
    document.body.appendChild(messageDiv)

    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = game.getBoard;
        const activePlayerName = game.getActivePlayer();

        playerTurn.textContent = `${activePlayerName.name}'s turn`;
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })

    }

    function clickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (selectedRow === undefined || selectedColumn === undefined) return;

        const moveSuccessful = game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
        if (moveSuccessful) {
            const winner = game.getWinner();
            if (winner) {
                messageDiv.textContent = `Game Over! The winner is ${winner}!`
            }
            updateScreen()
        }

        // updateScreen()
    }

    resetButton.addEventListener('click', () => {
        game.resetGame();
        messageDiv.textContent = '';
        updateScreen()
    })

    boardDiv.addEventListener('click', clickHandler);

    updateScreen();

}

ScreenController();


