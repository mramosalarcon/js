/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
    let k = 1;
    const numsLen = nums.length;

    for (let i = 1; i < numsLen; i++) {
        if(nums[i] != nums[i-1]){
            nums[k] = nums[i];
            k++;
        }
    }
    //nums = nums.slice(0, k);
    return k;
};

let nums = [0, 0]
console.log(removeDuplicates(nums));