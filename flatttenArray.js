function flattenNestedArray(arr) {
    let flat = [];
    for (let i = 0; i < arr.length; i++){
        for (let j = 0; j < arr[i].length; j++){
            flat.push(arr[i][j]);
        }
    }
    return flat;
};

let arr = [[1,2,3], [4,5,6], [7,8,9]];

console.log(flattenNestedArray(arr));