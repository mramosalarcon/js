var isCircularSentence = function(sentence) {
    let arr = sentence.split(" ");
    if(arr[0][0] !== arr[arr.length-1][arr[arr.length-1].length-1]) return false;
    for(let i = 0; i < arr.length-1; i++){
        if(arr[i][arr[i].length-1] !== arr[i+1][0]) return false;
    }
    return true;  
};