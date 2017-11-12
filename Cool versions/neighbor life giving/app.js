var initialize = function() {
  window.gol = CellularAutomaton;
  window.gol.init(100, 100);
  window.paused = true;
  if (window.tid) {
    window.clearInterval(window.tid);
  }
  printDivwise();
}

var update = function() {
  window.gol.update();
  printDivwise();
}

var updateGenerationDisplay = function() {
  document.querySelector("#generation_count").innerHTML = window.gol.generations;
}

var printDivwise = function() {
  var html = "";
  window.gol.space.grid.forEach(function(cellRow, y) {
    html += '<div class="cellrow">'
    cellRow.forEach(function(cell, x) {
      var statestring;
      var colorString;
      if (cell.state === 0) {
          statestring = "dead"; 
          colorString = 'style="background-color: ' + cell.getColorString() + ';"'
        } else {
          statestring = "alive";
        }

        html += '<div class="cell '+statestring+'" data-x="'+x+'" data-y="'+y+'" ' + 
          colorString + '></div>';
    });
    html += "</div>"
  });
  document.querySelector("#goldiv").innerHTML = html;
  updateGenerationDisplay();
}

var printToHtml = function() {
  var html = "";

  window.gol.space.grid.forEach(function(cellRow) {
    html += "<pre>"
    cellRow.forEach(function(cell) {
      if (cell.state === 0) {
        html += " ";
        } else {
        html += "☺";
        }
    });
    html += "</pre>"
  });
  document.querySelector("#goldiv").innerHTML = html;
  updateGenerationDisplay();
}

var start = function() {
  if (window.paused) {
    window.tid = window.setInterval(update, 1);
    window.paused = false;
  }
}

var stop = function() {
  if (!window.paused) {
    window.clearInterval(window.tid);
    window.paused = true;
  }
}

var randomize = function() {
  initialize();
  window.gol.randomize();
  window.printDivwise();
}

window.onload = function() {
  document.body.onclick = function(e) {
    if (window.event) {
      e = event.srcElement;
    } else {
      e = e.target;
    }
    if (e.className && e.className.indexOf('cell') != -1) {
      var x = Number(e.dataset.x);
      var y = Number(e.dataset.y);
      if (window.gol !== "undefined") {
        window.gol.toggleCellState(x, y);
      }
      window.printDivwise();
    }
  }
}
