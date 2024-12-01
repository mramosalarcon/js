function firstLast(arr) {
    let result = [];
    for (i=1; i < arr.length; i++){
        result.push(arr[i-1].charAt(0) + arr[i].charAt(arr[i].length-1));
        if (i==arr.length-1){
            result.push(arr[i].charAt(0) + arr[0].charAt(arr[0].length-1));
        }
    }
    return result;
}

var arr = ["cat", "dog", "fish", "mouse"];
console.log(firstLast(arr));

