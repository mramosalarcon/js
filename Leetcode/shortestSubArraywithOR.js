var minimumSubarrayLength = function(nums, k) {
    if (k === 0) return 1;
    const n = nums.length;
    
    // Check single elements
    for (let num of nums) {
        if (num >= k) return 1;
    }
    
    // Check pairs
    for (let i = 0; i < n - 1; i++) {
        if ((nums[i] | nums[i + 1]) >= k) return 2;
    }
    
    // Check if any solution exists by calculating total OR
    let totalOR = 0;
    for (let num of nums) {
        totalOR |= num;
    }
    if (totalOR < k) return -1;
    
    // Check length 3 windows
    for (let i = 0; i < n - 2; i++) {
        if ((nums[i] | nums[i + 1] | nums[i + 2]) >= k) return 3;
    }
    
    // If we haven't found a solution by now, try length 4
    for (let i = 0; i < n - 3; i++) {
        if ((nums[i] | nums[i + 1] | nums[i + 2] | nums[i + 3]) >= k) return 4;
    }
    
    // Return minimum of 5 and array length
    return Math.min(5, n);
};
