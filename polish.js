/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function (tokens) {
    let stack = [];
    let val = 0;
    tokens.forEach(token => {
        if (token != '+' && token != '-' && token != '*' && token != '/') {
            stack.push(token);
        }
        else {
            let operand2 = parseInt(stack.pop());
            let operand1 = parseInt(stack.pop());
            switch (token) {
                case '+': val = operand1 + operand2; break;
                case '-': val = operand1 - operand2; break;
                case '*': val = operand1 * operand2; break;
                case '/': val = operand1 / operand2; break;
                default: val = 0;
            };
            stack.push(val);
        }
    });    
    return parseInt(stack.pop());
}