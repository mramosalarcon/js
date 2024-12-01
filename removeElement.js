/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    let k = 0;
    for (let i = 0; i < nums.length; i++){
        console.log(nums[i]);
        if (nums[i] == val){
            nums.splice(i, 1);
            i--;
            console.log(nums);
        }
        else{
            k++;
        }
    }
    
    return k;
};