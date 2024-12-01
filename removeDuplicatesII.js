/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    let index = 0, counter = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] == nums[index]) counter++;
        else counter = 1;
        if (counter <= 2) index++;
        nums[index] = nums[i];
    }
    console.log(nums);
    return index+1;
};

let nums = [1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4]
//[1,2,2,2]
//
console.log(removeDuplicates(nums));