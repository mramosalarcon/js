var canSortArray = function(nums) {
    let n = nums.length;
    let prevMax = 0;
    let currMin = Infinity;
    let currMax = 0;
    let prevBitCount = -1;

    for (let i = 0; i < n; i++) {
        let num = nums[i];
        let bitCount = countSetBits(num);

        if (bitCount !== prevBitCount) {
            if (currMin < prevMax) {
                return false;
            }
            prevMax = Math.max(prevMax, currMax);
            currMin = num;
            currMax = num;
            prevBitCount = bitCount;
        } else {
            currMin = Math.min(currMin, num);
            currMax = Math.max(currMax, num);
        }
    }

    return currMin >= prevMax;
};

function countSetBits(num) {
    let count = 0;
    while (num) {
        num &= (num - 1);
        count++;
    }
    return count;
}
