import "core-js/stable";
import "regenerator-runtime/runtime";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsHTML = document.getElementById("flags-left");
  const icon = document.querySelector(".restart-btn");
  let width = 10;
  let bombAmount = 20;
  let squares = [];
  let isGameOver = false;
  let flags = 0;
  let left = bombAmount;
  let total = "";
  let matches = 0;
  flagsHTML.innerHTML = left;

  //create Board
  function createBoard() {
    //get shuffled array with class of 'bomb' or 'valid'
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = [...emptyArray, ...bombsArray];
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    // create div-squares in the grid
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      square.classList.add("sq");
      grid.appendChild(square);
      squares.push(square);

      //normal click - "opening" square
      square.addEventListener("click", function (e) {
        click(square);
      });
      // right click - flagging square
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    // add numbers inside the div-squares depending on how many bombs sourround it
    for (let i = 0; i < squares.length; i++) {
      let bombsAround = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains("valid")) {
        // check if a bomb exists in the square on the:
        // LEFT
        if (!isLeftEdge && squares[i - 1].classList.contains("bomb"))
          bombsAround++;
        // TOP RIGHT
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          bombsAround++;
        // TOP
        if (i > 9 && squares[i - width].classList.contains("bomb"))
          bombsAround++;
        // TOP LEFT
        if (
          i > 9 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          bombsAround++;
        // RIGHT
        if (!isRightEdge && squares[i + 1].classList.contains("bomb"))
          bombsAround++;
        // BOTTOM LEFT
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          bombsAround++;
        // BOTTOM RIGHT
        if (
          i < 90 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          bombsAround++;
        // BOTTOM
        if (i < 90 && squares[i + width].classList.contains("bomb"))
          bombsAround++;
        squares[i].setAttribute("data", bombsAround);
      }
    }
  }

  // STARTING THE GAME
  createBoard();

  // GAME ACTION functions
  // click on square action - "open" square
  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }
  // check neighbouring squares once square is "opened"
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;
    setTimeout(() => {
      //        LEFT
      if (!isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // TOP RIGHT
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // TOP
      if (currentId > 9) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // TOP LEFT
      if (currentId > 9 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // RIGHT
      if (!isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // BOTTOM LEFT
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // BOTTOM RIGHT
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // BOTTOM
      if (currentId < 90) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }
  // add Flag with right click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flags++;
        left--;
        flagsHTML.innerHTML = left;

        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
        left++;
        flagsHTML.innerHTML = left;
      }
    }
    console.log(`mathces R: ${matches}`);
  }

  // GAME RESOLUTION FUNCTIONALITY
  // game over functionality
  function gameOver(square) {
    const icon = document.querySelector(".restart-btn");
    icon.innerHTML = "😵";
    console.log("Game Over");
    isGameOver = true;
    // show ALL the bombs
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      }
    });
  }
  // check for win
  function checkForWin() {
    matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        console.log("WIN!");
        isGameOver = true;
        icon.innerHTML = "🤩";
        flagsHTML.innerHTML = "YOU WIN !!!";
        squares.forEach((sq) => {
          lastTotal = sq.getAttribute("data");
          if (sq.classList.contains("valid")) {
            sq.classList.add("checked");
            if (lastTotal != 0) {
              sq.innerHTML = lastTotal;
            }
          }
        });
      }
    }
  }

  function restartGame() {
    squares = [];
    isGameOver = false;
    flags = 0;
    matches = 0;
    left = bombAmount;
    flagsHTML.innerHTML = left;
    grid.innerHTML = "";
    icon.innerHTML = "🙂";
    createBoard();
  }

  document.querySelector(".restart-btn").addEventListener("click", restartGame);
  console.log("Welcome!");
});

// if (module.hot) {
//   module.hot.accept();
// }
