import './App.css';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid"

function App() {

    const [digit, setDigit] = useState(0)
    const [options, setOptions] = useState([])
    const operators = ["↺", "+", "-", "×", "÷"];

    const [firstNum, setFirstNum] = useState(null);
    const [secondNum, setSecondNum] = useState(null);
    const [selectedOperator, setSelectedOperand] = useState(null);
    const [history, setHistory] = useState([]); // Store past operations

    // The digit and options generation logic
    useEffect(() => {
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
            // console.log("a:", a, "b:", b, "op:", op);

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


        function calculateTheSum(numbers, operators) {

            let theSum = 0;

            while (theSum < 90 && numbers.length > 2) {
                // console.log("------------------------------------");

                let op = operators[randomIntFromInterval(0, 3)]
                let indices = getXUniqueRandomSortedNumbersInRange(2, 0, numbers.length - 1)
                // console.log("indices: ", indices);

                let a = numbers[indices[0]];
                let b = numbers[indices[1]];

                const result = isOperationPossible(a, b, op)
                // console.log("result: ", result);

                if (result) {

                    numbers.push(result);
                    // console.log(`numbers with ${result} added: `, numbers);

                    numbers.splice(numbers.indexOf(a), 1)
                    // console.log(`numbers with ${a} removed: `, numbers);
                    numbers.splice(numbers.indexOf(b), 1)
                    // console.log(`numbers with ${b} removed: `, numbers);

                    numbers.sort(function (a, b) { return a - b })
                    // console.log(`new numbers: `, numbers);


                    theSum = Math.max(...numbers)
                    // if (theSum >= 90) {
                    //     console.log("theSum: ", theSum);
                    //     console.log("the final numbers :", numbers);
                    //     return theSum;
                    // }
                }
            }
            theSum = Math.max(...numbers)
            // console.log("theSum: ", theSum);
            // console.log("the final numbers :", numbers);
            return theSum;
        }


        function main() {
            let theSum = 0;
            let options = []
            while (theSum < 90) {
                // console.log("====================================");
                // console.log("theSum: ", theSum);

                const numbers = getXUniqueRandomSortedNumbersInRange(6, 1, 25)
                options = [...numbers]
                // numbers = numbers.concat(getXUniqueRandomSortedNumbersInRange(3, 10, 25))

                let operators = ["+", "-", "*", "/"];
                // console.log("numbers: ", numbers)
                // console.log("operators:", operators)
                theSum = calculateTheSum(numbers, operators);
            }
            // console.log("\n\n====================================");
            // console.log("Digit greater than 90: ", theSum);
            // console.log("Your options: ", options);

            setDigit(theSum);
            setOptions(options);
        }

        main()
    }, [])

    // To make sure operation is perfomed after the states are set
    useEffect(() => {
        if (firstNum !== null && secondNum !== null && selectedOperator !== null) {
            performOperation();
        }
    }, [firstNum, secondNum, selectedOperator]);

    const handleNumClick = (num) => {
        if (!selectedOperator) {
            // If no operand is selected, set the first number
            setFirstNum(num);
        } else if (firstNum !== num) {
            // If an operand is selected and the number is not the same as the first number, set it as the second number
            setSecondNum(num);
        }
    };

    const handleOpClick = (op) => {
        // Select operand only if the first number is selected
        if (firstNum !== null) {
            setSelectedOperand(op);
        }
    };

    // Perform the operation on selected numbers
    const performOperation = () => {
        if (firstNum !== null && secondNum !== null && selectedOperator !== null) {
            let result = 0;

            switch (selectedOperator) {
                case "+":
                    result = firstNum + secondNum;
                    break;
                case "-":
                    if (firstNum <= secondNum) {
                        console.log("Invalid subtraction operation")
                        setFirstNum(null);
                        setSecondNum(null);
                        setSelectedOperand(null);
                        return;
                    }
                    result = firstNum - secondNum;
                    break;
                case "×":
                    result = firstNum * secondNum;
                    break;
                case "÷":
                    if (secondNum !== 0 && firstNum % secondNum === 0) {
                        result = firstNum / secondNum;
                    } else {
                        console.log("Invalid division operation");
                        setFirstNum(null);
                        setSecondNum(null);
                        setSelectedOperand(null);
                        return;
                    }
                    break;
                default:
                    break;
            }

            if (result === 0) {
                setFirstNum(null);
                setSecondNum(null);
                setSelectedOperand(null);
                return;
            }

            // Store the operation details in history
            setHistory([...history, { firstNum, secondNum, selectedOperator, result }]);

            // Remove the selected numbers from options
            const newOptions = options.filter((num) => num !== firstNum && num !== secondNum);

            // Add the result to the new options
            newOptions.push(result);

            // Update the options state
            setOptions(newOptions);

            console.log(`Result of ${firstNum} ${selectedOperator} ${secondNum} = ${result}`);

            // Reset selected numbers and operand
            setFirstNum(null);
            setSecondNum(null);
            setSelectedOperand(null);
        } else {
            console.log("Please select all three inputs to perform an operation.");
        }
    };

    return (
        <div className="App">
            <div className='container'>
                <img className='logo' src="logo-bg.png" width={90} alt="logo" />
                <div className='text-container'>
                    <h1 className='font-martin title-name'>
                        Digits
                    </h1>
                    <span className='font-poppins'>
                        *Inspired by <a className='real-nyt' target='blank' href='https://www.nytimes.com/games/digits'>NYT Digits</a>
                    </span>
                </div>
            </div>

            <hr />
            <p className='font-poppins'>Use any combination of numbers to reach the target</p>
            <h2 className='font-martin the-digit'>{digit}</h2>
            <div className='interactives'>
                <div className='numbers'>
                    <div className='row'>
                        {options.map((num) => (
                            <b
                                className={`font-martin circle ${firstNum === num || secondNum === num
                                    ? "selected-circle"
                                    : ""
                                    }`}
                                key={uuidv4()}
                                onClick={() => handleNumClick(num)}
                            >
                                {num}
                            </b>
                        ))}
                    </div>
                </div>
                <div className="operations">
                    {operators.map((op, idx) => (
                        <button
                            className={`font-martin operation ${idx === 0 ? "undo" : ""} ${selectedOperator === op ? "selected-operation" : ""
                                }`}
                            key={uuidv4()}
                            onClick={() => handleOpClick(op)}
                        >
                            {op}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className='font-poppins'>Completed operations appear here:</h3>
                {history.map(equation => (
                    <p>{equation.firstNum} {equation.selectedOperator} {equation.secondNum} = {equation.result}</p>
                ))}
            </div>
        </div>
    );
}

export default App;
