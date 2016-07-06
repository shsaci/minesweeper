document.addEventListener('DOMContentLoaded', startGame)

/*defines the board object*/
var board = {cells: []};

/*Finds all the square minesweeper div elements, and attaches the listeners and adds a function that adds cells to the minesweeper board. It also calls functions that count and add the surrounding mines property to the cell object*/
function startGame () {
  var x = document.getElementsByClassName("hidden");
  for (var i = 0; i < x.length; i++) {
    addListeners(x[i]);
    addCellToBoard(x[i]);
  }

  for (var i = 0; i < board.cells.length; i++) {
    var x = countSurroundingMines(board.cells[i]);
    board.cells[i].surroundingMines = x;
  }
}

/*This function adds the listeners to the div elements. One of the listeners is for left-click, invoking the function showCell, and the other is right-click, invoking the markCell function*/
function addListeners(element) {
  element.addEventListener('click', showCell);
  element.addEventListener('contextmenu', markCell);
}

function playApplause() {
  var x = document.getElementById("myAudioA");
  x.play();
}

/*Checks to see is the player has won by finding out if all mines are marked, and making sure no cells are hidden*/
function checkForWin() {
  var x = document.getElementsByClassName("mine");
  var y = document.getElementsByClassName("hidden");
  var count = 0; var no_hidden = true;

  for (var i = 0; i < board.cells.length; i++) {
    if (board.cells[i].isMine && board.cells[i].isMarked) {
      count++;
    }
  }

  if (count >= x.length && y.length == 0) {
    playApplause();
    alert("Congratulations! You Win!")
    reset();
    return;
  }
  else {
    return;
  }
}

/*this function displays all mines. This function will be usually called if a player stumbles upon a mine*/
function showAllMines() {
  var x = document.getElementsByClassName("mine");
  for (i = 0; i < x.length; i++) {
    x[i].classList.remove("hidden");
  }
}

function playBomb() {
  var x = document.getElementById("myAudioB");
  x.play();
}

/*this function deletes the hidden class of a cell and hence makes it visible. It also invokes the showSurrounding function to makes surrounding cells visible when no mines are nearby, per rules of the game*/
function showCell (evt) {
  evt.target.className = evt.target.className.replace("hidden", "");
  if (evt.target.classList.contains("mine")) {
    showAllMines();
    playBomb();
    reset();
    return;
  }
  showSurrounding(evt.target);
  checkForWin();
}


/*the following function toggles classes marked and hidden on any cell that is right-clicked. It also finds out which cell was right-clicked upon, and adds a property to the cell object called isMarked, marking it as true*/
function markCell (evt) {
  evt.preventDefault();
  evt.target.classList.toggle("marked");
  evt.target.classList.toggle("hidden");
  var marked_cell_row = getRow(evt.target);
  var marked_cell_col = getCol(evt.target);
  for (var j = 0; j < board.cells.length; j++) {
    if (board.cells[j].row == marked_cell_row && board.cells[j].col == marked_cell_col) {
      board.cells[j].isMarked = true;
    }
  }
  checkForWin();
}

function reset() {
  var reply = prompt("Play again? Y/N");
  reply = reply.toUpperCase();

  if (reply == 'Y') {
      // console.log(reply);
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
        var str = "row-" + i;
        var x = document.getElementsByClassName(str);

        if (!x[j].classList.contains("hidden")) {
          x[j].classList.add("hidden");
        }

        if (x[j].classList.contains("marked")) {
            x[j].classList.toggle("marked");
        }

        if (x[j].innerHTML !== '') {
          x[j].innerHTML = '';
        }
      }
    }
    board.cells = [];
    startGame();
  }
  else {
    return;
  }
}



/*finds the row number of the element passed to the function*/
function getRow(element){
  var row_num = parseInt(element.classList[0][4]);
  return row_num;
}

/*finds the column number of the element passed to the function*/
function getCol(element){
  var col_num = parseInt(element.classList[1][4]);
  return col_num;
}

/*adds an object cell including row & col properties to the object board*/
function addCellToBoard(element){
  var newCell = {};
  newCell.row = getRow(element);
  newCell.col = getCol(element);
  if (element.classList.contains ("mine")) {
    newCell.isMine = true;
  }
  else {
    newCell.isMine = false;
  }
  board.cells.push(newCell);
}

/*this function, with the help if getSurroundingCells function counts how man mines there are in adjacent cells to the cell that is passed to this function*/
function countSurroundingMines(cell) {
  var a = getSurroundingCells (cell.row, cell.col);
  var count = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].isMine) {
      count++;
    }
  }
  return count;
}
