"use strict";

var CellularAutomaton = {
  rule: function(state, neighbors) {
    if (neighbors.length >= 2) {
        return 1;
    } else {
        return 0;
    }

    // if (state === 1) {
    //   if (neighbors.length < 2 || neighbors.length > 3) {
    //     return 0;
    //   }
    //   return 1;
    // } else if (neighbors.length === 3) {
    //  return 1;
    // } 
    // return 0;
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
const MAX_SCORE_NEIGHBOR_COUNT = 1;
const MIN_SCORE_RATIO_FOR_LIFE = .4;
const MAX_SCORE_RATIO_FOR_LIFE = .8;

// const SCORE_INCREASE = 28;
// const SCORE_DECREASE = 5;

// const SCORE_INCREASE = 35;
// const SCORE_DECREASE = 2;

const SCORE_INCREASE = 90;
const SCORE_DECREASE = 1;
const RGB = '102, 130, 255, ';

// const SCORE_INCREASE = 3;
// const SCORE_DECREASE = 1;

// const SCORE_INCREASE = 10;
// const SCORE_DECREASE = 10;

/** I found these produce really interesting results **/
// const SCORE_INCREASE = 21;
// const SCORE_DECREASE = 2;

// const SCORE_INCREASE = 6;
// const SCORE_DECREASE = 5;

class Cell {
  constructor(x, y, state, score, increase, decrease, dying) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.dying = dying;

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

  update(rule, neighbors, scoredNeighbors) {
    if (this.shouldSetToAlive(this.score, scoredNeighbors)) {
        // console.log('Death rules overriden by score');
        this.state = 1;
        this.dying = 0;
        this.resetScore();
        return;
    } else {
        if (this.dying > 0) {
          this.dying = Math.max(0, this.dying - 1);
          this.state = 0;
          return;
        }
    }
    

    if (this.state) {
        this.dying = 6;
        this.state = 0;
        return;
    }

    // if (this.shouldSetToAlive(this.score, scoredNeighbors)) {
    //     console.log('Test');
    //     this.state = !rule(this.state, neighbors);
    //     // this.state = 0;
    //     this.dying = false;
    //     this.resetScore();
    // } else {
        this.state = rule(this.state, neighbors);
    // }
    // if (this.shouldSetToAlive(this.score, scoredNeighbors)) {
    //   this.state = 1;
    //   this.resetScore();
    // } else {
    //   let previousState = this.state;
    //   this.state = rule(this.state, neighbors);

    //   this.setDying(previousState, this.state);
    // }
  }

  setDying(previousState, currentState) {
    this.dying = !!previousState && !currentState;
  }

  shouldSetToAlive(score, neighbors) {
    // return score >= MAX_SCORE;

    return score >= MAX_SCORE && this._hasHighScoreNeighbors(neighbors);
  }

  _hasHighScoreNeighbors(neighbors) {
    let aboveMaxNeighbors = 0;
    neighbors.forEach(neighbor => {
      if (neighbor.score >= MAX_SCORE * MIN_SCORE_RATIO_FOR_LIFE
        &&  neighbor.score <= MAX_SCORE * MAX_SCORE_RATIO_FOR_LIFE) {
        aboveMaxNeighbors += 1;
      }
    });

    let result = aboveMaxNeighbors >= MAX_SCORE_NEIGHBOR_COUNT;
    return result;
  }

  resetScore() {

    this.score = 0;
  }

  toggleState() {
    if (this.state === 0 && !this.dying) {
      this.state = 1;
      return;
    }

    if (this.state === 1 ) {
      this.dying = true;
      this.state = 0;
      return
    }

    if (this.dying === true) {
      this.dying = false;
      return
    }

    // if (this.state === 0) {
    //   this.state = 1;
    // } else if (this.state === 1) {
    //   this.dying = true;
    //   this.state = 0;
    // } else if (this.dying )
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
        this.grid[i][j] = new Cell(i, j, 0, 0, false, 0);
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
          this.grid[i][j].scoreDecrease,
          this.grid[i][j].dying
        );
        tempGrid[i][j].update(rule, this.getLiveNeighbors(i, j), this.getScoredNeighbors(i, j));
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

  getScoredNeighbors(i, j) {
    var that = this;
    return this.getNeighbors(i, j).filter(function(cell) {
      if (cell.score > 0) {
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
