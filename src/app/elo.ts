export function getRatingDelta(myRating: number, opponentRating: number,
    myGameResult: number) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
        return null;
    }
    
    var myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.round(32 * (myGameResult - myChanceToWin));
}

export function getNewRating(myRating: number, opponentRating: number,
     myGameResult: number) {
    return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
}