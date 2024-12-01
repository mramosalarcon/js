var findMedianSortedArrays = function(nums1, nums2) {
    let mergedArray = nums1.concat(nums2).sort((a, b) => a - b);
    console.log(mergedArray);
    let length = mergedArray.length;
    if (length % 2 === 0) {
        return (mergedArray[length / 2 - 1] + mergedArray[length / 2]) / 2;
    } else {
        return mergedArray[Math.floor(length / 2)];
    }  
}

let nums1 = [1, 3];
let nums2 = [2];
console.log(findMedianSortedArrays(nums1, nums2));
let nums3 = [1, 2];
let nums4 = [3, 4];
console.log(findMedianSortedArrays(nums3, nums4));
let nums5 = [0, 0];
let nums6 = [0, 0];
console.log(findMedianSortedArrays(nums5, nums6));
let nums7 = [];
let nums8 = [1];
console.log(findMedianSortedArrays(nums7, nums8));
let nums9 = [2];
let nums10 = [];
console.log(findMedianSortedArrays(nums9, nums10));
