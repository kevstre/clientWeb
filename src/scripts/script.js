"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bubble_1 = require("./bubble");
var d3 = require("./modules/d3.js");
window.onload = function () {
    document.getElementById("button").addEventListener("click", getRandomBubble, false);
    document.getElementById("tableValues").addEventListener("mouseover", onMouseOver, false);
    document.getElementById("tableValues").addEventListener("mouseout", onMouseOut, false);
};
var maxRadius = 40;
var plainBlueColor = "#7b9eb4";
var highlightedBlueColor = "#323c4b";
var rowCounter = 1;
var bubbleList = [];
function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}
function findBubble(id) {
    var bubble = undefined;
    bubbleList.forEach(function (element) {
        if (element.id == id) {
            bubble = element;
        }
    });
    return bubble;
}
function onMouseOver() {
    var target = getEventTarget(event);
    if (target && target.tagName == "TD") {
        var row = target.parentElement;
        highlightRow(undefined, row);
        var bubble = findBubble(Number(row.cells[0].innerHTML));
        highlightBubble(bubble);
    }
}
function onMouseOut() {
    resetRowColor();
    resetBubbleColor();
}
function getRandomBubble() {
    var boundaries = document.getElementById("graph").getBoundingClientRect();
    var bubble = new bubble_1.Bubble(rowCounter, boundaries.width, boundaries.height, maxRadius);
    bubbleList.push(bubble);
    insertRow(bubble);
    appendBubbles();
    defineBubbleMovement();
    rowCounter++;
}
function insertRow(bubble) {
    var table = document.getElementById("tableValues");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = rowCounter.toString();
    cell2.innerHTML = bubble.x.toString();
    cell3.innerHTML = bubble.y.toString();
    cell1.setAttribute("id", "id");
    cell2.setAttribute("id", "xValue");
    cell3.setAttribute("id", "yValue");
}
function resetRowColor() {
    var table = document.getElementById("tableValues");
    for (var r = 0, n = table.rows.length; r < n; r++) {
        table.rows[r].style.backgroundColor = plainBlueColor; // reset
    }
}
function highlightRow(bubble, row) {
    if (row != undefined) {
        row.style.backgroundColor = highlightedBlueColor;
    }
    else {
        var table = document.getElementById("tableValues");
        for (var r = 0, n = table.rows.length; r < n; r++) {
            table.rows[r].style.backgroundColor = plainBlueColor; // reset
            for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
                if (bubble != undefined) {
                    if (Number(table.rows[r].cells[c].innerHTML) == bubble.id) {
                        table.rows[r].style.backgroundColor = highlightedBlueColor;
                        break;
                    }
                }
            }
        }
    }
}
function resetBubbleColor() {
    d3.select('#graph').selectAll("circle")
        .style("fill", plainBlueColor)
        .attr("r", function (d) {
        return d.radius;
    });
}
function highlightBubble(bubble) {
    resetBubbleColor();
    d3.select('#graph').selectAll("circle")
        .filter(function (element) {
        if (Number(element.id) == bubble.id) {
            return element;
        }
    })
        .style("fill", highlightedBlueColor)
        .attr("r", function (d) {
        return d.radius + 5;
    });
}
function appendBubbles() {
    d3.select('#graph').selectAll("circle")
        .data(bubbleList)
        .enter().append("circle")
        .attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    })
        .attr("r", function (d) {
        return d.radius;
    })
        .attr("id", function (d) {
        return d.id;
    })
        .style("fill", plainBlueColor)
        .on('mouseover', function (d) {
        d3.select(this)
            .style("fill", highlightedBlueColor)
            .attr("r", function (d) {
            return d.radius + 5;
        });
        highlightRow(d);
    })
        .on("mouseout", function (d) {
        d3.select(this)
            .style("fill", plainBlueColor)
            .attr("r", function (d) {
            return d.radius;
        });
        highlightRow();
    });
}
function defineBubbleMovement() {
    var bubbles = d3.select('#graph').selectAll("circle");
    generateNewPositions();
    updateTableEntries();
    repeat();
    function repeat() {
        bubbles
            .data(bubbleList)
            .transition()
            .ease(d3.easeLinear)
            .attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
            return d.y;
        })
            .duration(2000)
            .on("end", function () {
            generateNewPositions();
            updateTableEntries();
            repeat();
        });
    }
}
function generateNewPositions() {
    var boundaries = document.getElementById("graph").getBoundingClientRect();
    bubbleList.forEach(function (element) {
        element.x = element.generateRandomNumber(boundaries.width);
        element.y = element.generateRandomNumber(boundaries.height);
    });
}
function updateTableEntries() {
    var table = document.getElementById("tableValues");
    bubbleList.forEach(function (element) {
        for (var r = 0, n = table.rows.length; r < n; r++) {
            if (Number(table.rows[r].cells[0].innerHTML) == element.id) {
                for (var c = 1, m = table.rows[r].cells.length; c < m; c++) {
                    switch (table.rows[r].cells[c].id) {
                        case "xValue": {
                            table.rows[r].cells[c].innerHTML = element.x.toString();
                            break;
                        }
                        case "yValue": {
                            table.rows[r].cells[c].innerHTML = element.y.toString();
                            break;
                        }
                        default: {
                            // do nothing
                            break;
                        }
                    }
                }
            }
        }
    });
}
