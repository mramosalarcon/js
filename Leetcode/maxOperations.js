/**
 * @param {number[]} nums
 * @return {number}
 */
var maxOperations = function(nums) {
    let sum = nums[0] + nums[1];
    let count = 1;
    for (let i = 2; i < nums.length - 1; i += 2) {
        if (nums[i] + nums[i + 1] === sum) {
            count++;
        }
        else {
            break;
        }
    }
    return count;  
};