class TicTacToeBoard
{
  constructor() {
    //intialize important variables..
    this.turn = "opponent"; //ai always starts first.
    this.memoryMap; //this variable holds the value that we use to update the ai brain or query the ai brain for matching arrays
    this.axes; //axes would store an array of two numbers which indicates a position in the ai brain
    this.positionOfRow; //check update_AI_Brain() for more info
    this.positionOfColumn; //check update_AI_Brain() for more info
    this.position_Of_Box_In_Row_Or_Column; //check update_AI_Brain()
    this.opponent_lastMove; //this get the opponent last move
    this.opponent_lastMoves = []; //this stores the moves of the opponent for that particular round
    //the player and ai moves are represented as  2 and 1 in the aibrain respectively
    //blank spaces are represented as 0...

    this.opponent_symbolValue = 1;
    this.ai_symbolValue = 2;

    //determine the symbol of the opponent
    this.opponent_symbol = document.getElementById('symbol').value;
    if (this.opponent_symbol == "<span id='x'>X</span>") {
      this.ai_symbol = "<span id='o'>O</span>";
    } else if (this.opponent_symbol == "<span id='o'>O</span>") {
      this.ai_symbol = "<span id='x'>X</span>";
    }

    //this array contains the id of the boxes...
    this.boxes = ["0.0",
      "0.1",
      "0.2",
      "1.0",
      "1.1",
      "1.2",
      "2.0",
      "2.1",
      "2.2"];

    //this array contains the id of diagonal boxes
    this.diagonalBoxes = ["0.0",
      "0.2",
      "1.1",
      "2.0",
      "2.2"];

    //this array contains ids of the boxes in a plus
    this.plusBoxes = ["0.1",
      "1.0",
      "1.2",
      "2.1"];

    //this array contains the ids of corner boxes(vital for ai_firstMove_if_Not_Starting_A_Round())
    this.corner_boxes = ["0.0",
      "0.2",
      "2.0",
      "2.2"];

    //this array contains the ids of the 2nd horizontal boxes
    this.horizontal_boxes_2 = ["1.0",
      "1.1",
      "1.2"];


    /*next is to initialize the ai brain,the first three child array
      signifies the 3 horizontal rows
     4th,5th,6th marks the next 3 horizontal rows
     the 7th and 8th marks the two diagonal rows.
    */

    this.brain = [
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0]];

    //start game and then start ai with aiMove() method.
    this.game();

  }

  //this function rebuilds the tictactoe board.
  async game() {
    await this.buildBoard();
  }



  //create the tictactoe board;
  async buildBoard() {
    document.getElementById("tictactoe").innerHTML = `
    <div id="0.0" class="boxes" onclick="game.playersMove(id)"></div>
    <div id="0.1" class="boxes" onclick="game.playersMove(id)"></div>
    <div id="0.2" class="boxes" onclick="game.playersMove(id)"></div>
    <div id="1.0" class="boxes" onclick="game.playersMove(id)"></div>
    <div id="1.1" class="boxes" onclick="game.playersMove(id)"></div>
    <div id="1.2" class="boxes" onclick="game.playersMove(id)"></div>
    <div id="2.0" class="boxes" onclick="game.playersMove(id)"></div>
    <div id="2.1" class="boxes" onclick="game.playersMove(id)"></div>
    <div id="2.2" class="boxes" onclick="game.playersMove(id)"></div>
    `;

  }


  //this function ensures that ai already made a move so prevent the opponent from playing twice
  checkOnAI() {
    if (this.turn == "opponent") {
      return true;
    } else {
      alert('AI is yet to make a move \n Please wait....');
      return false;
    }
  }

  //this method recieves the 9 ids of the boxes and shuffles them everytime
  shuffle(unshuffled) {
    //this snippet is gotten from stack overflow...
    let shuffled = unshuffled.map(value => ({
      value, sort: Math.random()
    })).sort((a, b) => a.sort - b.sort).map(({
      value
    }) => value);
    return shuffled;
  }




  //intiate AI move....
  async aiMove() {
    //we want to pause this block a few seconds since it executes too fast
    await this.sleep(2000)
    //first we check that it's the ai turn to play.....
    if (this.turn != "AI") {
      alert("Not AI turn")//this should not come up
      return false;
    }
    let count = 0;
    //if count is equals to 9,it means it is means that the opponent hasnt played
    //and the ai is starting the round first....

    const boxes = document.querySelectorAll(".boxes");
    boxes.forEach((box)=> {
      if (box.innerHTML == "") {
        count++;
      }
    })
    //this succeding if block runs IF ai plays first only
    if (count == 9) {
      //we shuffle the array,so that AI plays in a random position since it is the first making the first move in that round....
      let position = this.shuffle(this.boxes);
      //next we pick the last element in this array since it has been shuffled.
      document.getElementById(position[8]).innerHTML = this.ai_symbol;
      this.update_AI_Brain(position[8], "AI");
      //this else if block runs if the opponent plays first and in one of the corner boxes
      //then it leaves just 8 boxes available
      //if the opponent first move is either in of the diagonal boxes(except the center box) or one of the plus boxes(except the center box)
      //this forces the ai to play in the middle
    } else if (count < 9 && count != 0) {
      //this block logically tries to check which box to play in by passing some values to AIperformsMemoryCheck method

      let aiGuess; //we initialize a local property that stores the return value from AIperformsMemoryCheck functiom

      aiGuess = await this.AIperformsMemoryCheck(2, 2); //passing 2,2 into this method allows us to check if the ai can make a move that wins the game
      if (aiGuess != undefined) {
        //if no move is found..the function returns undefined
        return this.update_AI_Brain(aiGuess, "AI"); //if it doesn't...we skio this function block and the ai goes to make tht move
      }
      aiGuess = await this.AIperformsMemoryCheck(1); //passing 1 into this method allows the ai to check if the opponent can play a move after the ai and win the game
      if (aiGuess != undefined) {
        //if the function returns undefined,it means that the opponent cannot win yet
        return this.update_AI_Brain(aiGuess, "AI"); //if the move exits..the ai tries to block it by playing there instead.Pleas note that there may be two moves(if the opponent sucessfully execute a two ways trick but the ai can only block one)
      }

      aiGuess = await this.predictUser(this.opponent_lastMoves);
      if (aiGuess != false) {
        document.getElementById(aiGuess).innerHTML = this.ai_symbol;
        return this.update_AI_Brain(aiGuess, "AI");
      }

      aiGuess = await this.AIperformsMemoryCheck(2, 1); //passing 2,1 allows to ai to play in any row that only itself has plaed once and the opponent has not played there before
      if (aiGuess != undefined) {
        //if the statement gets to this point...it means there is a possibility for that move and goes ahead to skio this function block to register that move
        return this.update_AI_Brain(aiGuess, "AI");
      } else {
        //at this point...it means that round is coming to an end and there may not be any winner so thr ai just plays in a spot that is empty with playRandom function
        return this.playRandom();
      }
    } else if (count == 0) {//this block runs if there is a stale mate
      this.turn = "AI"; //AI is going to start the next round because a stale mate prevented it from making a move
      alert("Stalemate");
      this.opponent_lastMoves = [];//reset the array that stores the opponent last moves
      await this.sleep(2000);
      await this.updateScores("draw");
      this.brain = this.refreshBrain();
      this.buildBoard(); //rebuilds the board
      if (confirm("Down for a round more?") == true) {
        return this.aiMove(); //cause ai to play again
      } else {
        alert("Please refresh page to start again")
      }
    }
  }


  //this method checks if there is a winner after updating the ai brain ,if there isnt,it moves on to the next player...
  async update_AI_Brain(Axes, player) {
    if (player == "AI") {
      this.memoryMap = this.ai_symbolValue;
    } else if (player == "opponent") {
      this.memoryMap = this.opponent_symbolValue;
      this.opponent_lastMove = Axes; //tells the ai about the opponent last move(vital to check if the opponent is setting up two ways)
    }
    //we also need to update the brain of the ai,to remember that it made a move and the opponent did too
    //the id of these divs are consists of two numbers seperated by a delimiter(.)
    //the first number represents the position of the row/column where the box his found..
    //the second number represents the position(ordering) the box in that row/column

    //we split the id..of the div where the AI played.
    this.axes = Axes.split(".");
    this.positionOfRow = parseInt(this.axes[0]);
    this.position_Of_Box_In_Row = parseInt(this.axes[1]);

    //deriving the vertical component of the box will be a bit tricky
    this.positionOfColumn = parseInt(this.axes[1]) + 3; //in the brain,we have the update the vertical component of that box
    this.position_Of_Box_In_Column = this.positionOfRow;

    //we update the brain here
    this.brain[this.positionOfRow][this.position_Of_Box_In_Row] = this.memoryMap; //update the horizontal component of the box
    this.brain[this.positionOfColumn][this.position_Of_Box_In_Column] = this.memoryMap; //update the vertical component

    //next we check if the where the AI or opponent played is on 0.0,0.2,1.1,2.0,2.2 because those boxes have diagonal component
    if (this.diagonalBoxes.includes(Axes)) {
      //if the id of the box where the ai played or the opponent played is also part of the diagonal box..
      //we would need to update it too,because a box can have a duagonal component too
      if (Axes == "0.0") {
        this.brain[7][0] = this.memoryMap;
      } else if (Axes == "2.2") {
        this.brain[7][2] = this.memoryMap;
      } else if (Axes == "1.1") {
        this.brain[6][1] = this.memoryMap;
        this.brain[7][1] = this.memoryMap;
      } else if (Axes == "2.0") {
        this.brain[6][0] = this.memoryMap;
      } else if (Axes == "0.2") {
        this.brain[6][2] = this.memoryMap;
      }
    }

    let checkForWinnerReturnValue = await this.checkForWinner(player);
    if (checkForWinnerReturnValue != true) {
      if (player == "AI") {
        this.turn = "opponent";
        document.getElementById("yourTurn").style.display = "block"
        document.getElementById("aiTurn").style.display = "none"
        await this.manualStalemateCheck();
      } else if (player == "opponent") {
        this.turn = "AI";
        document.getElementById("yourTurn").style.display = "none"
        document.getElementById("aiTurn").style.display = "block"
        this.aiMove();
      }
    }

  }



  //this function is called when the player makes a move(not the ai).
  async playersMove(id) {
    //ensures ai has already played and player isnt making a double move...
    if (this.checkOnAI() == false) {
      return false;
    }
    //check if where player wants to play is empty..
    if (document.getElementById(id).innerHTML != "") {
      alert('Can\'t play there.... ');
      return false;
    } else {
      this.opponent_lastMove = id;
      this.opponent_lastMoves.push(id);
      this.turn = "AI"; //this tells the game that opponent has just had it turn after confirming that opponent play somewhere empty ...
      document.getElementById(id).innerHTML = this.opponent_symbol; //update the GUI and show that opponenr has played

      this.update_AI_Brain(id, "opponent"); //tells and updates the ai brain that opponent has made a move
    }
  }

  //player here can be "AI" or "opponent"...
  async checkForWinner(player) {
    //player == ai then we check if an array in the ai brain is completely filled with only 2's
    if (player == "AI") {
      for (let eachArray of this.brain) {
        //we get each array in the ai brain and check if one of them is comoletely filled with 2s,if found it means the ai has won
        if (eachArray.every(this.checkForRepeating2s)) {
          alert("AI WINS");
          this.opponent_lastMoves = []; //reset the array that temporarily stores the opponent moves
          await this.sleep(2000); //delay the AI to allow the opponent see the winner

          await this.updateScores("lose");
          this.brain = this.refreshBrain();
          this.buildBoard(); //rebuilds the board
          this.turn = "opponent";
          document.getElementById("yourTurn").style.display = "block"
          document.getElementById("aiTurn").style.display = "none"
          return true;
          // alert("Your move")
        }
      }
    } else if (player == "opponent") {
      for (let eachArray of this.brain) {
        //we get each array in the ai brain
        if (eachArray.every(this.checkForRepeating1s)) {
          alert("YOU WIN!!!");
          await this.storeUserMoves(this.opponent_lastMoves); //if the opponent wins,the AI permanently stores the winning move here
          this.opponent_lastMoves = [];
          await this.sleep(2000)//delay the AI to allow the opponent see the winner

          await this.updateScores("win")
          this.brain = this.refreshBrain();
          this.buildBoard(); //rebuilds the board
          this.turn = "AI";
          document.getElementById("yourTurn").style.display = "none"
          document.getElementById("aiTurn").style.display = "block"
        }
      }
    }
  }

  //this method only runs if the ai is not starting the round
  //this method becomez the firstMove of the ai IF  opponent plays in certain places (this.corner_boxes)
  async ai_firstMove_if_Not_Starting_A_Round() {
    this.lucky_pick = this.shuffle(this.horizontal_boxes_2);
    document.getElementById(this.lucky_pick[1]).innerHTML = this.ai_symbol;
    this.update_AI_Brain(this.lucky_pick[1], "AI");

  }


  //makeshift sleep() function,works only in an async function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  //update the scores using cookies
  async updateScores(result) {

    if (result == "draw") {
      let drawResult = getCookie("TicTacDraw");
      if (drawResult != "") {
        drawResult = parseInt(drawResult);
      } else {
        drawResult = 0;
      }
      document.getElementById('drawTimes').innerHTML = parseInt(document.getElementById('drawTimes').innerHTML) +1;
      setCookie("TicTacDraw", drawResult+1, 30);
    } else if (result == "win") {
      let winResult = getCookie("TicTacWin");
      if (winResult != "") {
        winResult = parseInt(winResult);
      } else {
        winResult = 0;
      }
      document.getElementById('winTimes').innerHTML = parseInt(document.getElementById('winTimes').innerHTML) +1;
      setCookie("TicTacWin", winResult+1, 30);
    } else if (result == "lose") {
      let loseResult = getCookie("TicTacLose");
      if (loseResult != "") {
        loseResult = parseInt(loseResult);
      } else {
        loseResult = 0;
      }
      document.getElementById('loseTimes').innerHTML = parseInt(document.getElementById('loseTimes').innerHTML) +1;
      setCookie("TicTacLose", loseResult+1, 30);
    }
  }

  async AIperformsMemoryCheck(val, lvl = 0) {
    let sumOfArray; //the sum the array must be
    let exclude; //the exeception that the array must bot contains
    let currentChildArray = -1; //gets the index of the current array,since arrays are zero index we still need to subtract 1 from the value of this
    let currentElemInChildArray = -1; //gets the index of the current child array element(an array is zero indexed so starting from -1 ensures that )
    let condition1,
    condition2; //variables that stores the condition return value

    /*
    NOTE:THE NUMBERS ARE JUST FOR DIFFERENTING BETWEEM THE FUNCTIONALITY !
    This method works differently based on the parameters provided
    If val is 1,and lvl remains 0?
    This method does a search on the arrays in this.brain  such that only the opponent has two occuring figures two 1s in one child array and the ai has not played there(no 2s)
    If we express this in maths,then an array must have the sum of 2 and no elements in that child array must have a 2
    Remember that when the ai plays,the 0s in the array corresponding to the box occupied are changed to 2s
    While if the opponent plays,they're change to 1s...
    If val is 2 and lvl is 2?
    It basically looks for where it has placed twice but the opponent hasn't also played in that row....
    So in maths,that array can be said to have a sum of 4 but excludes "1" since 1 is denoted as a spot occupied by the opponent
    if val is 2 and lvl is 1?
    It looks for a child array that contains only one 2 and no 1....this translated that in a row
    The ai has played in that row but the opponent has not
    aiMove() calls these methods in the order
    2,2
    1,0
    2,1
    */

    if (val == 2 && lvl == 1) {
      sumOfArray = 2;
      exclude = 1;
    } else if (val == 2 && lvl == 2) {
      sumOfArray = 4;
      exclude = 1;
    } else if (val == 1) {
      sumOfArray = 2;
      exclude = 2;
    }


    for (let eachArray of this.brain) {
      //accesses each child array in the ai brain...
      currentChildArray++; //increment the index on succeeding iterations ..
      currentElemInChildArray=-1; //we need to reset the pointer(index) of the child array elements if a child array is completely iterated over
      condition1 = this.sumArray(eachArray); //checks the sum of the array
      condition2 = eachArray.includes(exclude); //ensures the array excludes a digit

      if (condition1 == sumOfArray && !condition2) {
        //if a row like that exists...,we have to find the array element left that has a zero(in the gui..this zero will identify as an empty box)

        for (let eachValue of eachArray) {
          //access each child element in each child array
          currentElemInChildArray++;
          if (eachValue == 0) {
            //this if block sends
            if (currentChildArray <= 2) {
              var Axes = currentChildArray+'.'+currentElemInChildArray; //this forms an Axes e.g 1.0,2.0 etc
              document.getElementById(Axes).innerHTML = this.ai_symbol;
              return Axes;
            } else if (currentChildArray > 2 && currentChildArray <= 5) {
              //this if block will only run when the iteration gets to the vertical rows and because
              //update_AI_Brain() takes the horizontal component we need to convert the vertical component to that
              let positionInColumn = parseInt(currentChildArray) - 3;
              let Axes = currentElemInChildArray+'.'+positionInColumn;
              document.getElementById(Axes).innerHTML = this.ai_symbol;
              return Axes;
            } else if (currentChildArray > 5) {
              //diagonal rows..
              let Axes = currentChildArray+'.'+currentElemInChildArray;
              if (Axes == "6.0") {
                Axes = "2.0"; //6.0 diagonally is same as 2.0 ...direct relationship(no way to really create a mathematical relationship)
                document.getElementById(Axes).innerHTML = this.ai_symbol;
                return Axes;
              } else if (Axes == "6.2") {
                Axes = "0.2"
                document.getElementById(Axes).innerHTML = this.ai_symbol;
                return Axes;
              } else if (Axes == "7.0") {
                Axes = "0.0"
                document.getElementById(Axes).innerHTML = this.ai_symbol;
                return Axes;
              } else if (Axes == "7.2") {
                Axes = "2.2"
                document.getElementById(Axes).innerHTML = this.ai_symbol;
                return Axes;
              } else if (Axes == "6.1" || Axes == "7.1") {
                Axes = "1.1"
                document.getElementById(Axes).innerHTML = this.ai_symbol;
                return Axes;
              }
            }

          }
        }
      }
    }
  }
  //this method fires if it's the opponent turn but all boxes are filled..the ai already has it own automatic method to do this
  async manualStalemateCheck() {
    let count = 0;
    for (let eachBoxes of this.boxes) {
      if (document.getElementById(eachBoxes).innerHTML != "") {
        count++;
      }
    }
    if (count == 9) {
      alert("Stalemate");
      this.opponent_lastMoves = [];
      await this.sleep(2000)
      await this.updateScores("draw");
      this.turn = "opponent";
      this.brain = this.refreshBrain();
      this.buildBoard();
    }
  }




  //works with array.every() to
  checkForRepeating1s(value) {
    return value == 1;
  }

  //works with array.every()
  checkForRepeating2s(value) {
    return value == 2;
  }

  //refreshes the brain of the ai after a round
  refreshBrain() {
    return [
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0],
      [0,
        0,
        0]];
  }

  //this method just sums a array
  sumArray(arr) {
    //initialize local variables to store input and output
    let total = 0;
    for (var i in arr) {
      total += arr[i];
    }
    return total;
  }

  //this methods allows the ai play at random...
  playRandom() {
    //the ai simply loops through the ids of the whole boxes stored in this.boxes variable
    //checks which is empty
    //the plays in any one..
    //this method is only ever call after ai has logically analyzed that there's no evident winner in a round...

    for (let eachValue of this.shuffle(this.boxes)) {
      if (document.getElementById(eachValue).innerHTML == "") {
        document.getElementById(eachValue).innerHTML = this.ai_symbol;
        return this.update_AI_Brain(eachValue, "AI"); //using a return statent to exit the play random function after getting a suitable empty box
      }
    }
  }

  //next is to create functions that check for two ways
  async storeUserMoves(opponentWinningMoves) {
    if (!localStorage.getItem("storeOpponentMoves")) {
      let opponentMoves = [];
      opponentMoves.push(opponentWinningMoves);
      localStorage.setItem("storeOpponentMoves", JSON.stringify(opponentMoves));
    } else if (localStorage.getItem("storeOpponentMoves")) {
      let opponentMoves = localStorage.getItem("storeOpponentMoves");
      opponentMoves = JSON.parse(opponentMoves);
      opponentMoves.push(opponentWinningMoves);
      localStorage.setItem("storeOpponentMoves", JSON.stringify(opponentMoves));
    }
  }

  async predictUser(currentMoveSet) {
    if (!localStorage.getItem("storeOpponentMoves")) {
      alert("no moves stored yet")
      return false;
    }

    let setLength = currentMoveSet.length;
    let identicalMoves = [];
    let opponentMoves = JSON.parse(localStorage.getItem("storeOpponentMoves"));
    if (opponentMoves.length == 0) {
      alert("no moves found in move unit")
      return false;
    } else {

      for (let eachStoredMove of opponentMoves) {
        if (JSON.stringify(currentMoveSet) === JSON.stringify(eachStoredMove.slice(0, setLength))) {
          if (document.getElementById(eachStoredMove[setLength]).innerHTML == "") {
            identicalMoves.push(eachStoredMove);
          }
        }
      }
    }

    let identicalMovesShuffled = shuffle(identicalMoves);
    if (identicalMovesShuffled.length != 0) {
      return String(identicalMovesShuffled[0][setLength]);
    } else {
      return false;
    }
  }


}//end of class

 //since the user starts first...
document.getElementById('aiTurn').style.display = "none";


function startGame() {
  let winResult,
  drawResult,
  loseResult;
  //Since human always start first

  //we load the previous results from here
  winResult = getCookie("TicTacWin");
  loseResult = getCookie("TicTacLose");
  drawResult = getCookie("TicTacDraw");

  if (winResult == "") {
    document.getElementById('winTimes').innerHTML = 0;
  } else {
    document.getElementById('winTimes').innerHTML = winResult;
  }

  if (loseResult == "") {
    document.getElementById('loseTimes').innerHTML = 0;
  } else {
    document.getElementById('loseTimes').innerHTML = loseResult;
  }

  if (drawResult == "") {
    document.getElementById('drawTimes').innerHTML = 0;
  } else {
    document.getElementById('drawTimes').innerHTML = drawResult;
  }
}

//initialize a game when page is opened
startGame();

function hideMe() {
  alert("Game started! \n You first")
  game = new TicTacToeBoard();
  document.getElementById('symbol').style.display = "none"
}

//load results

function hideAboutUs() {
  let status = document.getElementById('aboutUs').style.display;
  if (status != "none") {
    document.getElementById("aboutUs").style.display = "none";
  } else {
    document.getElementById("aboutUs").style.display = "block";
  }
}