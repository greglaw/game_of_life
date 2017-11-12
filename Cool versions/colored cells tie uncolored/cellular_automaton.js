"use strict";

/** To do:
  Make an interface to adjust key values
  Make chart showing population over time
  Use canvas display rather than HTML
  Make chart showing "scored to life" count over time
  Set up way to load interesting patterns
  Set up measure of entropy of board?
**/

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
// const RGB = '102, 130, 255, ';
const RGB = '200, 200, 200, ';

// const RGB = '255, 255, 255, ';

// const SCORE_INCREASE = 3;
// const SCORE_DECREASE = 1;

// const SCORE_INCREASE = 10;
// const SCORE_DECREASE = 10;

// const SCORE_INCREASE = 8;

/** Super cool - needs bigger grid **/
const SCORE_INCREASE = 0;
const SCORE_DECREASE = 30;
const NEIGHBOR_INCREASE = 8

// const SCORE_INCREASE = 0;
// const SCORE_DECREASE = 31;
// const NEIGHBOR_INCREASE = 8

/** Produces complex patterns without overfill! **/
// const SCORE_INCREASE = 0;
// const SCORE_DECREASE = 99;
// const NEIGHBOR_INCREASE = 5

// /** Really cool expansionist pattern **/
// const SCORE_INCREASE = 1;
// const SCORE_DECREASE = 30;
// const NEIGHBOR_INCREASE = 8


// const SCORE_INCREASE = 8;
// const SCORE_DECREASE = 5;
// const NEIGHBOR_INCREASE = 0;

// const SCORE_INCREASE = 8;
// const SCORE_DECREASE = 5;

// const SCORE_INCREASE = 6;
// const SCORE_DECREASE = 5;


const RED = 'red';
const GREEN = 'green';
const RED_INCREASE = 10;
const GREEN_NEIGHBOR_INCREASE = 90;

class Cell {
  constructor(x, y, state, score, increase, decrease, color) {
    this.x = x;
    this.y = y;
    this.state = state;

    this.rawIncrease = increase;
    this.rawDecrease = decrease;
    this.color = color; 
    this.score = score;
    this.neighbor_increase = NEIGHBOR_INCREASE;
    // let newScore;
    // if (!this.scoreIncrease) {
    //   this.scoreIncrease = SCORE_INCREASE;
    // } else {
    //   this.scoreIncrease = increase + this.score;
    // }

    // if (!this.scoreDecrease) {
    //   this.scoreDecrease = SCORE_DECREASE;
    // } else {
    //   this.scoreDecrease = decrease + this.score;
    // }

    // if (this.state === 1) {
    //   newScore = score + this.scoreIncrease;
    // } else {
    //   newScore = score - this.scoreDecrease;
    // }

    // if (newScore < 0) {
    //   newScore = 0
    // }

    // this.score = newScore;
    
  }

  getScoreIncrease(){
    if (!this.scoreIncrease) {
      this.scoreIncrease = SCORE_INCREASE;
    } else {
      this.scoreIncrease = this.rawIncrease + this.score;
    }
  }

  getScoreDecrease(){
    if (!this.scoreDecrease) {
      this.scoreDecrease = SCORE_DECREASE;
    } else {
      this.scoreDecrease = this.rawDecrease + this.score;
    }
  }

  updateScore() {
    let newScore;
    if (!this.scoreIncrease) {
      this.scoreIncrease = SCORE_INCREASE;
    } else {
      this.scoreIncrease = this.rawIncrease + this.score;
    }

    // if(this.color == RED) {
    //   this.scoreIncrease = RED_INCREASE;
    // }

    // if(this.color == GREEN) {
    //   this.neighbor_increase = GREEN_NEIGHBOR_INCREASE;
    // }


    // if(this.color == RED) {

    //   // this.scoreIncrease = this.getScoreIncrease();
    // }

    if (!this.scoreDecrease) {
      this.scoreDecrease = SCORE_DECREASE;
    } else {
      this.scoreDecrease = this.rawDecrease + this.score;
    }

    if (this.state === 1) {
      newScore = this.score + this.scoreIncrease;
    } else {
      newScore = this.score - this.scoreDecrease;
    }

    if (newScore < 0) {
      newScore = 0
    }

    this.score = newScore;
  }
  update(rule, neighbors) {
    this.updateScore();
    this.updateScoreByNeighbors(neighbors);
    if (this.hasReachedScoreThreshold(this.score)) {
      this.state = 1;
      this.resetScore();
    } else {
      this.state = rule(this.state, neighbors);
    }

    this.color = this.updateColor(neighbors);
  }

  updateColor(neighbors) {
    // if (!this.state) {
    //   return
    // }

    let redTally = 0;
    let greenTally = 0;
    neighbors.forEach(neighbor => {
      if(neighbor.state && neighbor.color === RED) {
        redTally += 1;
      }

      if(neighbor.state && neighbor.color === GREEN) {
        greenTally += 1;
      }
    });

    if (redTally == greenTally) {
      // return this.color || Math.random()  >= .5 ? RED : GREEN;
      return;
    }

    return redTally > greenTally ? RED : GREEN;
  }

  updateScoreByNeighbors(neighbors) {
    this.score += NEIGHBOR_INCREASE * neighbors.length;
    this._penalizeForFourNeighbors(neighbors);
    this._addNeighborsScore(neighbors);
  }

  _addNeighborsScore(neighbors) {
    if (neighbors.length == 2) {
      let neighborsScoreTotal = 0;

      neighbors.forEach((neighbor)=> {
        neighborsScoreTotal += neighbor.score;
      });

      this.score -= neighborsScoreTotal/2

    }
  }

  /** Can create complex repeating structures ! for rule 0, 30, 8 **/
  _penalizeForFourNeighbors(neighbors) {
    if(neighbors.length == 4) {
      this.score = 0;
    }
  }

  _updateScoreByNeighborsWithNoMin(neighbors) {
    this.score += this.neighbor_increase * neighbors.length;
  }

  _updateScoreByMultipleOfNeighbors(neighbors) {
    if (neighbors.length > 1) {
      this.score += this.neighbor_increase * neighbors.length;
    }
  }

  _updateScoreByInverseNeighborLength(neighbors) {
      this.score += this.neighbor_increase/neighbors.length;
  }

  hasReachedScoreThreshold(score) {
    return score >= MAX_SCORE;
  }

  resetScore() {
    this.score = 0;
  }

  toggleState() {
    if (this.state === 0) {
      this.state = 1;
      this.color = GREEN;
    } else if (this.state === 1) {
      if (this.color === GREEN) {
        this.color = RED;
      } else {
        this.state = 0;
        this.color = undefined;
      }
    }
  }

  setRandomState() {
     let probabilityFilledIn = .1;
     this.state = (Math.random() < probabilityFilledIn ? 1 : 0);
  }

  setRandomColor() {
     let probabilityRed = .5;
     this.color = (Math.random() < probabilityRed ? RED : GREEN);
  }

  setRandomScore(ratio) {
    this.score = Math.random() * MAX_SCORE/ratio;
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
        this.grid[i][j] = new Cell(i, j, 0, 0, 0, 0);
      }
    }
  }

  randomize() {
    for (var i = 0; i < this.sizeX; i++) {
      for (var j = 0; j < this.sizeY; j++) {
        this.grid[i][j].setRandomState();
        if (this.grid[i][j].state) {
          this.grid[i][j].setRandomColor();
        }
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
          this.grid[i][j].color)
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
