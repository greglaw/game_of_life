"use strict";

let maxDeathTime;
let maxLifeTime;


let MAX_SCORE_NEIGHBOR_COUNT;
let MIN_SCORE_RATIO_FOR_LIFE;
let MAX_SCORE_RATIO_FOR_LIFE;

var CellularAutomaton = {
  rule: function(state, neighbors, scoredNeighbors) {
    // if (state >= 1) {
    //   if (neighbors.length < 2 || neighbors.length > 3) {
    //     return 0;
    //   }
    //   return maxLifeTime;
    // } else if (neighbors.length === 3) {
    //  return maxLifeTime;
    // } 
    // return 0;

    // scoredNeighbors.forEach(neighbor => {
    //   sumNeighbors += neighbor.score;
    // });

    if (neighbors.length >= 2) {
        return maxLifeTime;
    } else {
        return 0;
    }
  },
  space: {},
  init: function(sizeX, sizeY) {
    this.getNewSettings();
    this.space = new Space(sizeX, sizeY, this.getScoreIncrease(), this.getScoreDecrease());
    this.generations = 0;
  },

  getNewSettings() {
    maxDeathTime = this.getMaxDeathTime();
    maxLifeTime = this.getMaxLifeTime();
    MAX_SCORE_NEIGHBOR_COUNT = this.getNeighborScoreCount();
    MIN_SCORE_RATIO_FOR_LIFE = this.getMinNeighborScoreRatio();
    MAX_SCORE_RATIO_FOR_LIFE = this.getMaxNeighborScoreRatio();
  },

  refreshSettings() {
    this.getNewSettings();

    this.space.refreshSettings(this.getScoreIncrease(), this.getScoreDecrease());
  },

  getScoreIncrease() {
    return +document.getElementById('_scoreIncrease').value;
  },

  getScoreDecrease() {
    return +document.getElementById('_scoreDecrease').value;
  },

  getMaxDeathTime() {
    return +document.getElementById('_deathTime').value;
  },

  getMaxLifeTime() {
    return +document.getElementById('_lifeTime').value;
  },

  getNeighborScoreCount() {
    return +document.getElementById('_neighborScoreCount').value;
  },
  getMinNeighborScoreRatio() {
    return +document.getElementById('_neighborMinScoreRatio').value;
  },
  getMaxNeighborScoreRatio() {
    return +document.getElementById('_neighborMaxScoreRatio').value;
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
  getValues: function() {
    SCORE_DECRE
  },

  generations: 0
}


const MAX_SCORE = 100;

// const SCORE_INCREASE = 28;
// const SCORE_DECREASE = 5;

// const SCORE_INCREASE = 35;
// const SCORE_DECREASE = 2;

// let score_increase = document.getElementById('_scoreIncrease').value;
// let score_decrease = document.getElementById('_scoreIncrease').value;


// let SCORE_INCREASE = score_increase;
// let SCORE_DECREASE = score_decrease;
const RGB = '102, 130, 255, ';
const RGBdying = '255, 0, 0, ';
const RGBliving = '0, 155, 0, ';

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
      this.scoreIncrease = increase;
    } else {
      this.scoreIncrease = increase + score;
    }

    if (!this.scoreDecrease) {
      this.scoreDecrease = decrease;
    } else {
      this.scoreDecrease = decrease + score;
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
    

    if (this.dying > 0) {
      this.dying = Math.max(this.dying - 1, 0);
      this.state = 0;
      return;
    }
        
    if (this.state == 1) {
        this.dying = maxDeathTime;
        this.state = 0;
        return;
    }

    if (this.state > 1 ) {
      this.state = Math.max(this.state - 1, 0);
      return;
    }
    
    if (this.shouldSetToAlive(this.score, scoredNeighbors)) {
      this.state = maxLifeTime;
      this.dying = 0;
      this.resetScore();
      return;
    }
    this.state = rule(this.state, neighbors, scoredNeighbors);
  }

  shouldSetToAlive(score, neighbors) {
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

    if (this.state > 0) {
      let opacity = this.state/maxLifeTime;

      return 'rgba(' + RGBliving + opacity + ')';
    }

    if (this.dying > 0) {
      let opacity = this.dying/maxDeathTime;

      return 'rgba(' + RGBdying + opacity + ')';
    }

    let opacity = this.score/MAX_SCORE;

    return 'rgba(' + RGB + opacity + ')';
  }
}

class Space {
  constructor(sizeX, sizeY, scoreIncrease, scoreDecrease) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.score_increase = scoreIncrease;
    this.score_decrease = scoreDecrease;
    this.grid = new Array(sizeX);
    for (var i = 0; i < sizeX; i++) {
      this.grid[i] = new Array(sizeY);
      for (var j = 0; j < sizeY; j++) {
        this.grid[i][j] = new Cell(i, j, 0, 0, this.score_increase, this.score_decrease, 0);
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
    if (this.refreshNextTick) {
      this.resetCellValues(rule);
    } else {
      this.updateCells(rule);
    }
  }

  updateCells(rule) {
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

  resetCellValues(rule) {
    var tempGrid = new Array(this.sizeX);
        for (var i = 0; i < this.sizeX; i++) {
          tempGrid[i] = new Array(this.sizeY);
          for (var j = 0; j < this.sizeY; j++) {
            tempGrid[i][j] = new Cell(
              i, 
              j, 
              this.grid[i][j].state, 
              this.grid[i][j].score, 
              this.scoreIncrease, 
              this.scoreDecrease,
              this.grid[i][j].dying
            );
            tempGrid[i][j].update(rule, this.getLiveNeighbors(i, j), this.getScoredNeighbors(i, j));
          }
        }
        this.grid = tempGrid;
        this.refreshNextTick = false;
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

  refreshSettings(increase, decrease) {
    this.scoreIncrease = increase;
    this.scoreDecrease = decrease;

    this.refreshNextTick = 1; 
  }
}
