/*
    *** TODO ***

    * Custom game (set width/height/bombs)
    * Bomb sound
*/

var gameDiv = document.getElementById('main');
var gameBoard = document.getElementById('board');

var game = {
    numberOfBombs: 20,
    width: 20,
    height: 10,
    hasLost: false,
    hasWon: false,
    hasBeenInitialized: false,
    bombs: [],
    tiles: [],
    timerHandle: undefined,
    type: 'easy',
    gameTypes: ['easy', 'medium', 'hard'],
    gameTypeConfig: {
        easy: {
            name: 'easy',
            width: 8,
            height: 8,
            numberOfBombs: 10,
        },
        medium: {
            name: 'medium',
            width: 16,
            height: 16,
            numberOfBombs: 40,
        },
        hard: {
            name: 'hard',
            width: 30,
            height: 16,
            numberOfBombs: 99,
        }
    },

    start: (gameType) => {
        var type = game.gameTypeConfig[gameType] || game.gameTypeConfig[game.type];
        if (type) {
            game.type = type.name;
            game.numberOfBombs = type.numberOfBombs;
            game.width = type.width;
            game.height = type.height;
        }

        // Clear out the board
        gameBoard.innerHTML = '';
        document.getElementById('restartButton').value = "😐";
        document.getElementById('bombCount').innerHTML = game.numberOfBombs;

        // Game default values
        game.hasLost = false;
        game.hasWon = false;
        game.hasBeenInitialized = false;

        initGameTimer();
        initTiles();
        setTileIds();

        renderTiles();
    }
};

var numberColors = {
    "1": "blue",
    "2": "green",
    "3": "red",
    "4": "pink",
    "5": "purple",
    "6": "orange",
    "7": "turquoise",
    "8": "black"
}

function initGameTimer() {
    if (game.timerHandle) {
        clearInterval(game.timerHandle);
    }

    var seconds = 0;
    game.timerHandle = setInterval(() => {
        if (!game.hasLost && !game.hasWon) {
            document.getElementById('timer').innerHTML = ++seconds;
        }
    }, 1000);
}

function initTiles() {
    var tiles = game.tiles = [];
    for (var i = 0; i < game.height; i++) {
        for (var j = 0; j < game.width; j++) {
            tiles[i] = tiles[i] ? tiles[i] : [];

            tiles[i][j] = {
                id: '',
                isBomb: false,
                isFlag: false,
                numberOfBombs: 0,
                isUncovered: false,
                neighbors: [],
                element: undefined
            }
        }
    }
}

function setTileIds() {
    var flatTiles = game.flatTiles = _.flatten(game.tiles);

    flatTiles.forEach((t, i) => t.id = i.toString());
}

function initBombs(firstClickedTile) {
    _.shuffle(game.flatTiles).forEach((t, i) => {
        if (i < game.numberOfBombs && t !== firstClickedTile) {
            t.isBomb = true;
            game.bombs.push(t);
        }
    });

    document.getElementById('bombCount').innerHTML = game.numberOfBombs;
}

function initNeighbors() {
    var tiles = game.tiles;
    for (var y = 0; y < tiles.length; y++) {
        for (var x = 0; x < tiles[y].length; x++) {
            var neighbors = [
                [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
                [x - 1, y], [x + 1, y],
                [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
            ]

            tiles[y][x].neighbors = neighbors.map((n) => {
                const [x, y] = n;

                if (tiles[y] && tiles[y][x]) {
                    return tiles[y][x];
                }
            }).filter(t => t);

            tiles[y][x].numberOfBombs = tiles[y][x].neighbors.filter(t => t.isBomb).length;
        }
    }
}
initNeighbors();

function tileClick(tile) {
    if (tile.isUncovered || tile.isFlag || game.hasLost || game.hasWon) return;

    if (!game.hasBeenInitialized) {
        initBombs(tile);
        initNeighbors();
        game.hasBeenInitialized = true;
    }

    tile.isUncovered = true;

    // Lose the game if you click a bomb
    if (tile.isBomb) {
        game.hasLost = true;
        game.bombs.forEach(b => {
            b.element.innerHTML = "☀";
            b.isUncovered = true;
            b.element.style.backgroundColor = '#CCC';
            b.element.style.color = 'red';
        });

        document.getElementById('restartButton').value = "😭";

        return;
    }

    // No non-bomb tiles left uncovered
    if (!game.flatTiles.some(t => !t.isUncovered && !t.isBomb)) {
        game.hasWon = true;
        document.getElementById('restartButton').value = "😎";
    }

    if (tile.numberOfBombs === 0) {
        tile.neighbors.forEach(tileClick);
    }

    tile.element.innerHTML = tile.isBomb ? '*' :
        (tile.numberOfBombs === 0 ? '\u00A0' : tile.numberOfBombs);
    tile.element.style.backgroundColor = '#CCC';
    tile.element.style.color = numberColors[tile.numberOfBombs];
}

function rightTileClick(tile) {
    if (tile.isUncovered) return;

    tile.isFlag = !tile.isFlag;
    if (tile.isFlag) {
        tile.element.innerHTML = "F";
        tile.element.style.color = 'white';
        game.numberOfBombs--;
    }
    else {
        tile.element.innerHTML = "\u00A0";
        game.numberOfBombs++;
    }

    document.getElementById('bombCount').innerHTML = game.numberOfBombs;

    return;
}

function renderTiles() {
    var tiles = game.tiles;
    tiles.forEach((r) => {
        var row = document.createElement("div");
        row.style = "display: flex; flex-direction: row; flex: 1";

        r.forEach((c) => {
            var column = document.createElement("div");
            c.element = column;
            column.style = "background-color: #555; padding: 8px; margin: 1px; font-family: monospace; font-size: 18pt"
            column.onclick = ((e) => tileClick(c, e))
            column.oncontextmenu = ((e) => { rightTileClick(c); e.preventDefault(); })
            column.innerHTML = c.isUncovered ? (c.isBomb ? '*' : c.numberOfBombs) : '\u00A0'

            row.append(column);
        })
        gameBoard.append(row);
    })
}

game.start();

function start(type) {
    game.start(type);
}