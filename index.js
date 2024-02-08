const screen = document.getElementById("game");
const difficultyContainer = document.getElementById("game-difficulty");

const start = document.getElementById("start");

let difficulty;

let xBomb = [], yBomb = [];
let xFlag = [], yFlag = [];



start.addEventListener("click", function () {
    difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    difficultyContainer.style.display = "none";
    createBombs(difficulty/2);
    createTable(difficulty/2);
    modeSwitch();
});

function modeSwitch(){
    const modeContainer = document.createElement("div");

    const bLabel = document.createElement("label");
    const bomb = document.createElement("input");
    const bombImg = document.createElement("img");
    const span = document.createElement("span");

    modeContainer.id = "mode-container";
    
    bomb.type = "radio";
    bomb.name = "mode";
    bomb.id = "bomb";
    bomb.value = 0;
    bomb.checked = "checked";
    bombImg.src = "images/mine2.svg";
    bLabel.id = "lBomb";

    bLabel.appendChild(bombImg);
    modeContainer.appendChild(bomb);
    
    const fLabel = document.createElement("label");
    const flag = document.createElement("input");
    const flagImg = document.createElement("img");
    
    flag.type = "radio";
    flag.name = "mode";
    flag.id = "flag";
    flag.value = 1;
    flagImg.src = "images/flag.svg";
    fLabel.id = "lFlag";
    
    fLabel.appendChild(flagImg);
    modeContainer.appendChild(flag);

    modeContainer.appendChild(bLabel);
    modeContainer.appendChild(fLabel);
    
    modeContainer.appendChild(span);
    
    screen.appendChild(modeContainer)
    bLabel.setAttribute("for", "bomb");
    fLabel.setAttribute("for", "flag");
}

function createTable(gridSize){
    const container = document.createElement("div");
    container.id = "game-container";
    screen.appendChild(container);

    const gameGrid = document.getElementById("game-container");
    gameGrid.style.display = "grid";
    gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for(let i=0; i<gridSize; i++){
        const row = document.createElement("div");
        row.className = 'row';
        for(let j=0; j<gridSize; j++){
            const cell = document.createElement("div");
            cell.className = 'cell';
            cell.id = `${i}_${j}`;
            cell.addEventListener("click", function(event){
                input(event.target.id, gridSize);
            });
            row.appendChild(cell);
        }
        gameGrid.appendChild(row);
        row.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    }

    let corner = ["0_0", `0_${gridSize-1}`, `${gridSize-1}_${gridSize-1}`, `${gridSize-1}_0`];
    const border = ["23px 0 0 0", "0 23px 0 0", "0 0 23px 0", "0 0 0 23px"]
    for(const i in corner){
        document.getElementById(corner[i]).style.borderRadius = `${border[i]}`;   
    }
}

function randBomb(gridSize){
    return Math.floor(Math.random() * gridSize);
}


function createBombs(gridSize){
    let i=0;
    let x,y;
    while (i<gridSize) {
        let count=0;
        x = randBomb(gridSize);
        y = randBomb(gridSize);
        for (let j=0; j<i; j++){
            if(xBomb[j] != x && yBomb[j] != y){
                count++;
            }
        }
        if (count === i) {
            xBomb[i] = x;
            yBomb[i] = y;
            i++;
        }
    } 
}

function cellValidation(row, col, gridSize){
    return (row >= 0) && (row < gridSize) && (col >= 0) && (col < gridSize) && (bombValidation(row, col, gridSize));
}

function bombValidation(row, col, gridSize){
    for(let i=0; i<gridSize; i++){
        if (xBomb[i] === col && yBomb[i] === row) {
            return true;
        }
    }
    return false;
}

function numBombAround(row, col, gridSize){
    let count=0;
    let n =[row-1, col], ne=[row-1, col+1], e=[row, col+1], se=[row+1, col+1], s=[row+1, col], sw=[row+1, col-1], w=[row, col-1], nw=[row-1, col-1];
    // N
    if (cellValidation(n[0], n[1], gridSize)==true) {
        if (bombValidation(n[0], n[1], gridSize)) {
            count++;
        }
    }
    // NE
    if (cellValidation(ne[0], ne[1], gridSize)) {
        if (bombValidation(ne[0], ne[1], gridSize)) {
            count++;
        }
    }
    // E
    if (cellValidation(e[0], e[1], gridSize)) {
        if (bombValidation(e[0], e[1], gridSize)) {
            count++;
        }
    }
    // SE
    if (cellValidation(se[0], se[1], gridSize)) {
        if (bombValidation(se[0], se[1], gridSize)) {
            count++;
        }
    }
    // S
    if (cellValidation(s[0], s[1], gridSize)) {
        if (bombValidation(s[0], s[1], gridSize)) {
            count++;
        }
    }
    // SW
    if (cellValidation(sw[0], sw[1], gridSize)) {
        if (bombValidation(sw[0], sw[1], gridSize)) {
            count++;
        }
    }
    // W
    if (cellValidation(w[0], w[1], gridSize)) {
        if (bombValidation(w[0], w[1], gridSize)) {
            count++;
        }
    }
    // NW
    if (cellValidation(nw[0], nw[1], gridSize)) {
        if (bombValidation(nw[0], nw[1], gridSize)) {
            count++;
        }
    }
    return count;
}

function displayNumBomb(cellName, gridSize){
    let coordenate = cellName.split("_");
    coordenate = [Number(coordenate[0]), Number(coordenate[1])];
    let cell = document.getElementById(cellName);
    let numBomb = numBombAround(coordenate[0], coordenate[1], gridSize);
    
    if(numBomb != 0){
        cell.textContent = `${numBomb}`;
    }
}


function input(cellName, gridSize){
    let cell = document.getElementById(cellName);
    let cellImg = document.createElement("img");
    let coordenate = cellName.split("_");
    let mode = Number(document.querySelector('input[name="mode"]:checked').value);
    coordenate = [Number(coordenate[0]), Number(coordenate[1])];
    
    if (mode) {
        cellImg.className = "flag";
        cellImg.src = "images/flag.svg";
        cell.appendChild(cellImg);
    } else {
        if(bombValidation(coordenate[0], coordenate[1], gridSize)){
            gameOver(gridSize);
        } else {
            displayNumBomb(cellName, gridSize);
            cell.style.backgroundColor = "transparent";
        }
    }
}

function gameOver(gridSize){
    showBomb(gridSize);
    restart();
}


function showBomb(gridSize){
    for(let i=0; i<gridSize; i++){
        for(let j=0; j<gridSize; j++){
            let cell = document.getElementById(`${i}_${j}`);
            if (!bombValidation(i, j, gridSize)) {
                displayNumBomb(`${i}_${j}`, gridSize);
            } else {
                const bombImg = document.createElement("img");
                bombImg.src = "images/mine2.svg";
                cell.appendChild(bombImg);
            }
            cell.style.backgroundColor = "transparent";
        }
    }
}


function restart(){
    const button = document.createElement("input");
    button.id = "restart";
    button.type = "button";
    button.value = "Restart";

    const modeContainer = document.getElementById("mode-container");
    modeContainer.remove();
    button.addEventListener("click", function(){
        const gameGrid = document.getElementById("game-container");
        const restartButton = document.getElementById("restart");
        difficultyContainer.style.display = "block";
        gameGrid.remove();
        restartButton.remove();
    })
    screen.appendChild(button);
}