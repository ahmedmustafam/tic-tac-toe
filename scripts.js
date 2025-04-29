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
            token: "x"
        },
        {
            name: "Player 2",
            token: "o"
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

    const playRound = () => {
        printNewRound();
        let row = parseInt(prompt("Please enter the desired row", ""));
        let column = parseInt(prompt("Please enter column", ""));
        const moveSuccessful = board.dropToken(row, column, getActivePlayer().token);

        if (!moveSuccessful) {
            console.log("Invalid move, try again");
            return;
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
        }

        const winner = checkWinner();
        if (winner) {
            console.log(`Game Over! The winner is ${winner === "x" ? "Player 1" : "Player 2"}!`);
            board.printBoard();
            return;
        }

        switchActivePlayer();
        printNewRound();
    }

    return {
        playRound,
        printNewRound,
        switchActivePlayer,
    }

})();
