"use strict";

var CellularAutomaton = {
  rule: function(state, neighbors) {
    if (state === 1) {
      if (neighbors.length < 2 || neighbors.length > 3) {
        return 0;
      }
      return 1;
    } else if (neighbors.length === 3) {
     return 1;
    } 
    return 0;
  },
  space: {},
  init: function(sizeX, sizeY, attributeCallback) {
    this.space = new Space(sizeX, sizeY);
    this.attrfunc = attributeCallback;
    this.generations = 0;
  },
  update: function() {
    this.space.update(this.rule, this.attrfunc);
    this.generations++;
  },
  run: function(callback) {
    this.init();
    while(true) {
      this.history.push(this.space.clone());
      this.update();
      callback(this.space);
    }
  },
  toggleCellState: function(x, y) {
    this.space.toggleCellState(x, y);
  },
  randomize: function() {
    this.space.randomize();
  },
  generations: 0
}


const MAX_SCORE = 100;
const RGB = '102, 130, 255, ';

// const SCORE_INCREASE = 3;
// const SCORE_DECREASE = 1;

// const SCORE_INCREASE = 10;
// const SCORE_DECREASE = 10;

/** I found these produce really interesting results **/
const SCORE_INCREASE = 8;
const SCORE_DECREASE = 5;

// const SCORE_INCREASE = 6;
// const SCORE_DECREASE = 5;

class Cell {
  constructor(x, y, state, score, increase, decrease) {
    this.x = x;
    this.y = y;
    this.state = state;

    let newScore;
    if (!this.scoreIncrease) {
      this.scoreIncrease = SCORE_INCREASE;
    } else {
      this.scoreIncrease = increase + this.score;
    }

    if (!this.scoreDecrease) {
      this.scoreDecrease = SCORE_DECREASE;
    } else {
      this.scoreDecrease = decrease + this.score;
    }

    if (this.state === 1) {
      newScore = score + this.scoreIncrease;
    } else {
      newScore = score - this.scoreDecrease;
    }

    if (newScore < 0) {
      newScore = 0
    }

    this.score = newScore;
    
  }

  update(rule, neighbors) {
  //   const ruleState = rule(this.state, neighbors);
    if (this.shouldInvert(this.score)) {
      // console.log('Score reached');
      // this.toggleState();
      // if (this.stuck) {
      //   console.log()
      //   this.state = 0;
      //   this.stuck = false;
      // } else {
        // if (this.state === 1 && this.stuck) {
        //   this.state = 0;
        //   this.stuck = false;
        // } else {

        //   if (this.state === 0 && this.stuck) {
        //     this.state = 1;
        //     this.stuck = false;
        //   } else {
        //     this.state = 1;
        //     this.stuck = true;

        //   }
        // }


        // if (this.state === 1) {
        //   this.stuck = true;
        // } else {
        //   this.state = 1;
        //   this.stuck = false;
        // }

      // }
      this.state = 1;
      // if (ruleState === 1) {
      //   this.state = 0;
      // } else {
      //   this.state = 1;
      // }
      // this.state = ruleState
      this.resetScore();
    } else {
      this.state = rule(this.state, neighbors);
    }
  }

  shouldInvert(score) {
    return score >= MAX_SCORE;
  }

  resetScore() {

    this.score = 0;
  }

  toggleState() {
    if (this.state === 0) {
      this.state = 1;
    } else if (this.state === 1) {
      this.state = 0;
    }
  }


  setRandomState() {
     let probabilityFilledIn = .1;
     this.state = (Math.random() < probabilityFilledIn ? 1 : 0);
     // this.score = Math.random() * MAX_SCORE/2;
  }

  getColorString() {
    let opacity = this.score/MAX_SCORE;

    return 'rgba(' + RGB + opacity + ')';
  }
}

class Space {
  constructor(sizeX, sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.grid = new Array(sizeX);
    for (var i = 0; i < sizeX; i++) {
      this.grid[i] = new Array(sizeY);
      for (var j = 0; j < sizeY; j++) {
        this.grid[i][j] = new Cell(i, j, 0, 0, false);
      }
    }
  }

  randomize() {
    for (var i = 0; i < this.sizeX; i++) {
      for (var j = 0; j < this.sizeY; j++) {
        this.grid[i][j].setRandomState();
      }
    }
  }

  update(rule) {
    var tempGrid = new Array(this.sizeX);
    for (var i = 0; i < this.sizeX; i++) {
      tempGrid[i] = new Array(this.sizeY);
      for (var j = 0; j < this.sizeY; j++) {
        tempGrid[i][j] = new Cell(
          i, 
          j, 
          this.grid[i][j].state, 
          this.grid[i][j].score, 
          this.grid[i][j].scoreIncrease, 
          this.grid[i][j].scoreDecrease)
        tempGrid[i][j].update(rule, this.getLiveNeighbors(i, j));
      }
    }
    this.grid = tempGrid;
  }

  getNeighbors(i, j) {
    var neighbors = [];
    var that = this;
    [[i-1,j-1],[i,j-1],[i+1,j-1],
      [i-1, j],[i+1, j],
      [i-1, j+1],[i,j+1],[i+1,j+1]].forEach(function(coordinates) {
        coordinates[0] = (coordinates[0] + that.sizeX) % that.sizeX;
        coordinates[1] = (coordinates[1] + that.sizeY) % that.sizeY;
        if (coordinates[0] >= 0 && coordinates[0] < that.sizeX &&
          coordinates[1] >= 0 && coordinates[1] < that.sizeY) {
            neighbors.push(that.grid[coordinates[0]][coordinates[1]]);
          }
      });
    return neighbors;
  }

  getLiveNeighbors(i, j) {
    var that = this;
    return this.getNeighbors(i, j).filter(function(cell) {
      if (cell.state === 1) {
        return true;
      } else {
        return false;
      }
    });
  }

  toggleCellState(x, y) {
    if (this.grid !== "undefined") {
      this.grid[y][x].toggleState();
    }
  }
}
