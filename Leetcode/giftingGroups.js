/*
 * Complete the 'countGroups' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts STRING_ARRAY related as parameter.
 */

function countGroups(related) {
    for (let i = 0; i < related.length; i++) {
        for (let j = 0; j < related[i].length; j++) {
            if (i != j){
                if (related[i][j] === '1') {
                    related[i][j] = i + 1;
                }
            }
        }
    }
}