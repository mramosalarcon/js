/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    nums2.forEach((num) => {
     console.log(nums1);
     for (let index = 0; index < nums1.length; index++) {
         if (num < nums1[index] || (nums1[index] == 0 && index >= m)){
             nums1.splice(index, 0, num);
             m++; 
             nums1.pop();
             break;
         }
     }
 });
}