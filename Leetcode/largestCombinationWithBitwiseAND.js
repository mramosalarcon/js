/**
 * @param {number[]} candidates
 * @return {number}
 */
var largestCombination = function(candidates) {
    let max = 0;
    for (let i = 0; i < 32; i++) {
        let count = 0;
        for (let j = 0; j < candidates.length; j++) {
            console.log(`Shift: ${candidates[j] >> i}`);
            console.log(`And: ${candidates[j] >> i & 1}`);
            if ((candidates[j] >> i) & 1) {
                count++;
                console.log(`Count: ${count}`);
            }
        }
        max = Math.max(max, count);
    }
    return max;
};

let candidates = [16, 17, 71, 62, 12, 24, 14];
let result = largestCombination(candidates);
console.log(result);
