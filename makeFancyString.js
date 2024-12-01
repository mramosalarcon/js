/**
 * @param {string} s
 * @return {string}
 */
var makeFancyString = function(s) {
    let result = "";
    let count = 1;
    for (let i = 0; i < s.length; i++) {
        if (s[i] == s[i+1]) {
            count++;
        } else {
            if (count > 2) {
                result += s[i].repeat(2);
            } else {
                result += s[i].repeat(count);
            }
            count = 1;
        }
    }
   return result;  
};