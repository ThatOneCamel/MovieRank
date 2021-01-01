var fs = require('fs');

var list = fs.readFileSync('list.txt').toString().split("\n");
list.pop();

//Shuffles given array
export function shuffle(arr) {
    var currentIndex = list.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = list[currentIndex];
        list[currentIndex] = list[randomIndex];
        list[randomIndex] = temporaryValue;
    }
    return arr;
}

//arr = source list
//n = columns or number of elements per row
export function generateGrid(arr, n){
    var initialLen = arr.length;
    grid = [];

    //Default to 5, if no valid value is given
    if(n < 1){
        n = 5;
    } else if (n >= initialLen){
        return arr;
    }

    for(i = 0; i < (initialLen / n); i++){
        grid.push( [] );
        for(j = 0; j < n; j++){
            if(!(arr === undefined || arr.length == 0)){
                grid[i].push(arr.pop());
                ////console.log("Pushed to [" + i + "][" + j +"]")
            }
        }
    }//End For Loop

    return grid;
}

export function versus(list, movie, opponent, r){
    let msg = movie + " vs " + opponent;
    var answer = "";

    //Get user input
    //console.log(msg);
    prompt('1 or 2?', function (input) {
        answer = input;
        //console.log(input);
        switch(answer){
            case 1:
                r--;
                //console.log("Winner is: " + movie);
                return versus(list, movie, list[r][0], r);
                break;
            case 2:
                //console.log("Winner is: " + opponent);
                return opponent;
                break;
            default:
                return "Empty";
                break;
        }
        process.exit();
    });

    
}

export function rank(arr){
    //Assuming input is 2D array
    let rows = arr.length;
    let cols = arr[0].length;
    //console.log("Rows = " + arr.length);
    //console.log("Cols = " + arr[0].length);

    posRow = (rows - 1);
    posCol = (cols - 1);
    let movie = arr[posRow][posCol]
    ////console.log(movie);
    
    //Movie = movie we are currently ranking against the system
    var winner = "";
    var r = posRow;
    
    winner = versus(arr, movie, arr[r][0], r);

}

//shuffle(list);
var myGrid = generateGrid(list, 5);
//console.log(myGrid);
rank(myGrid);
