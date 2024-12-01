/**
 * @param {string} s
 * @return {number}
 */
var minLength = function(s) {
    let stack = [];
    let val = 0;
    for(let i = 0; i < s.length; i++) {
        if(s[i] == '(') {
            stack.push(i);
        }
        else if(s[i] == ')') {
            if(stack.length) {
                let start = stack.pop();
                s = s.slice(0, start) + s.slice(start + 1, i) + s.slice(i + 1);
                i -= 2;
            }
        }
    }
    return s.length
};