var evalRPN = function(tokens) {
    const stack = [];
    
    for (const token of tokens) {
        if (token === '+') {
            stack.push(stack.pop() + stack.pop());
        }
        else if (token === '-') {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(a - b);
        }
        else if (token === '*') {
            stack.push(stack.pop() * stack.pop());
        }
        else if (token === '/') {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(Math.trunc(a / b));
        }
        else {
            stack.push(Number(token));
        }
    }
    
    return stack[0];
};
