var board;
var score = 0;
var rows = 4;
var columns = 4;

document.addEventListener('DOMContentLoaded', function() {
    setGame();
});

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    // create 2 to begin the game
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "ArrowUp" || e.code == "ArrowDown") {
        moveTiles(e.code);
        setTwo();
        document.getElementById("score").innerText = score;
        endGame();
    }
});

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function moveTiles(direction) {
    switch (direction) {
        case "ArrowLeft":
            for (let r = 0; r < rows; r++) {
                let row = board[r];
                row = slide(row);
                board[r] = row;
                for (let c = 0; c < columns; c++) {
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    let num = board[r][c];
                    updateTile(tile, num);
                }
            }
            break;
        case "ArrowRight":
            for (let r = 0; r < rows; r++) {
                let row = board[r];
                row.reverse();
                row = slide(row);
                board[r] = row.reverse();
                for (let c = 0; c < columns; c++) {
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    let num = board[r][c];
                    updateTile(tile, num);
                }
            }
            break;
        case "ArrowUp":
            for (let c = 0; c < columns; c++) {
                let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
                row = slide(row);
                for (let r = 0; r < rows; r++) {
                    board[r][c] = row[r];
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    let num = board[r][c];
                    updateTile(tile, num);
                }
            }
            break;
        case "ArrowDown":
            for (let c = 0; c < columns; c++) {
                let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
                row.reverse();
                row = slide(row);
                row.reverse();
                for (let r = 0; r < rows; r++) {
                    board[r][c] = row[r];
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    let num = board[r][c];
                    updateTile(tile, num);
                }
            }
            break;
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function endGame() {
    if (!hasMoves() && !hasEmptyTile()) {
        document.getElementById("restartBtn").style.display = "block";
    }
}

function restartGame() {
    document.getElementById("restartBtn").style.display = "none";
    score = 0;
    document.getElementById("score").innerText = score;

    // Limpiar el tablero
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "";
            tile.classList.value = "tile";  // Restaurar la clase tile
        }
    }

    // Verificar si el juego ha terminado después de limpiar el tablero
    endGame();

    // Reiniciar el juego después de asegurarnos de que el tablero esté limpio
    setTimeout(setGame, 0);
}

document.getElementById("restartBtn").addEventListener("click", function() {
    location.reload();
});

function hasMoves() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (
                (c < columns - 1 && board[r][c] === board[r][c + 1]) ||
                (r < rows - 1 && board[r][c] === board[r + 1][c])
            ) {
                return true;
            }
        }
    }
    return false;
}
