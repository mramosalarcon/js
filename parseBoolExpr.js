var parseBoolExpr = function(expression) {
    const stack = [];
    for (const char of expression) {
        if (char === ')') {
            const seen = new Set();
            while (stack[stack.length - 1] !== '(') {
                seen.add(stack.pop());
            }
            stack.pop();
            const operator = stack.pop();
            if (operator === '&') {
                stack.push(seen.has('f') ? 'f' : 't');
            } else if (operator === '|') {
                stack.push(seen.has('t') ? 't' : 'f');
            } else {
                stack.push(seen.has('t') ? 'f' : 't');
            }
        } else if (char !== ',') {
            stack.push(char);
        }
    }
    return stack.pop() === 't';  
};