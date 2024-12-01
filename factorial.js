function factorial(num) {
    console.log(num);
    if (num === 0) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}

let num = 5;
console.log("Factorial of " + num + " is " + factorial(num));

