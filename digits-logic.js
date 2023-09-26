function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getXUniqueRandomSortedNumbersInRange(X, min, max) {
    let numbers = []
    while (numbers.length < X) {
        const rndInt = randomIntFromInterval(min, max)
        if (!numbers.includes(rndInt))
            numbers.push(rndInt)
    }
    return numbers.sort(function (a, b) { return a - b })
}


// the result should not be NaN or non-positive
function isOperationPossible(a, b, op) {
    // b >= a ;always
    console.log("a:", a, "b:", b, "op:", op);

    if (op === "+") {
        return a + b;
    }
    if (op === "-") {
        // return a-b > 0 ? a-b : (b-a > 0 ? b-a : false)
        return b - a > 0 ? b - a : false
    }
    if (op === "*") { // should not multiply with 1
        return a === 1 ? false : a * b;
    }
    if (op === "/") {
        let res = b / a;
        if (res % 1 === 0 && res !== 0 && a !== 1) { // res in a whole number and is not divided by 1
            return res;
        }
    }
    return false;
}


function calculateTheSum(numbers, operands) {

    let theSum = 0;

    while (theSum < 90 && numbers.length>2) {
        console.log("------------------------------------");

        let op = operands[randomIntFromInterval(0, 3)]
        let indices = getXUniqueRandomSortedNumbersInRange(2, 0, numbers.length - 1)
        console.log("indices: ", indices);

        let a = numbers[indices[0]];
        let b = numbers[indices[1]];

        const result = isOperationPossible(a, b, op)
        console.log("result: ", result);

        if (result) {
            
            numbers.push(result);
            console.log(`numbers with ${result} added: `, numbers);
            
            numbers.splice(numbers.indexOf(a), 1)
            console.log(`numbers with ${a} removed: `, numbers);
            numbers.splice(numbers.indexOf(b), 1)
            console.log(`numbers with ${b} removed: `, numbers);
            
            numbers.sort(function (a, b) { return a - b })
            console.log(`new numbers: `, numbers);
            

            theSum = Math.max(...numbers)
            // if (theSum >= 90) {
            //     console.log("theSum: ", theSum);
            //     console.log("the final numbers :", numbers);
            //     return theSum;
            // }
        }
    }
    theSum = Math.max(...numbers)
    console.log("theSum: ", theSum);
    console.log("the final numbers :", numbers);
    return theSum;
}


function main() {
    let theSum = 0;
    let options = []
    while (theSum < 90) {
        console.log("====================================");
        console.log("theSum: ", theSum);

        numbers = getXUniqueRandomSortedNumbersInRange(6, 1, 25)
        options = [...numbers]
        // numbers = numbers.concat(getXUniqueRandomSortedNumbersInRange(3, 10, 25))

        let operands = ["+", "-", "*", "/"];
        console.log("numbers: ", numbers)
        console.log("operands:", operands)
        theSum = calculateTheSum(numbers, operands);
    }
    console.log("\n\n====================================");
    console.log("Digit greater than 90: ", theSum);
    console.log("Your options: ", options);
}

main()