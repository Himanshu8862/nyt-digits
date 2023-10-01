import './App.css';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid"
import Modal from './Modal';

function App() {

    const [digit, setDigit] = useState(0)
    const [options, setOptions] = useState([0, 0, 0, 0, 0, 0])
    const [gameWon, setGameWon] = useState(false)
    // const [isModalOpen, setIsModalOpen] = useState(false);
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

    // Game over check
    useEffect(() => {
        const won = options.includes(digit)
        setGameWon(won)
        // setIsModalOpen(won);
    }, [options, digit, firstNum, secondNum, selectedOperator])


    const handleNumClick = (numIdx) => {
        if (!selectedOperator) {
            // If no operand is selected, set the first number
            setFirstNum(numIdx);
        } else if (firstNum !== numIdx) {
            // If an operand is selected and the number is not the same as the first number, set it as the second number
            setSecondNum(numIdx);
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
                    result = options[firstNum] + options[secondNum];
                    break;
                case "-":
                    if (options[firstNum] <= options[secondNum]) {
                        console.log("Invalid subtraction operation")
                        setFirstNum(null);
                        setSecondNum(null);
                        setSelectedOperand(null);
                        return;
                    }
                    result = options[firstNum] - options[secondNum];
                    break;
                case "×":
                    result = options[firstNum] * options[secondNum];
                    break;
                case "÷":
                    if (options[secondNum] !== 0 && options[firstNum] % options[secondNum] === 0) {
                        result = options[firstNum] / options[secondNum];
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
            setHistory([...history, { idx1: firstNum, idx2: secondNum, num1: options[firstNum], num2: options[secondNum], selectedOperator, result }]);


            console.log(`Result of ${options[firstNum]} ${selectedOperator} ${options[secondNum]} = ${result}`);

            // result should take place of second number, first number should be invisible
            options[firstNum] = null;
            options[secondNum] = result;

            // // Remove the selected numbers from options
            // const newOptions = options.filter((num) => num !== firstNum && num !== secondNum);
            // // Add the result to the new options
            // newOptions.push(result);
            // // Update the options state
            // setOptions(newOptions);



            // Reset selected numbers and operand
            setFirstNum(null);
            setSecondNum(null);
            setSelectedOperand(null);
        } else {
            console.log("Please select all three inputs to perform an operation.");
        }
    };

    return (
        <>
            <div className="App">
                {/* <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    Hi
                </Modal> */}
                <div className='header-container'>
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
                            <b
                                className={`font-martin circle ${firstNum === 0 || secondNum === 0 ? "selected-circle" : ""}
                                ${digit === options[0] ? "win-circle" : ""}`}
                                key={uuidv4()}
                                onClick={() => handleNumClick(0)}
                                style={{ visibility: options[0] === undefined || options[0] === null ? 'hidden' : 'visible' }}
                            >
                                {options[0]}
                            </b>
                            <b
                                className={`font-martin circle ${firstNum === 1 || secondNum === 1 ? "selected-circle" : ""}
                                ${digit === options[1] ? "win-circle" : ""}`}
                                key={uuidv4()}
                                onClick={() => handleNumClick(1)}
                                style={{ visibility: options[1] === undefined || options[1] === null ? 'hidden' : 'visible' }}
                            >
                                {options[1]}
                            </b>
                            <b
                                className={`font-martin circle ${firstNum === 2 || secondNum === 2 ? "selected-circle" : ""}
                                ${digit === options[2] ? "win-circle" : ""}`}
                                key={uuidv4()}
                                onClick={() => handleNumClick(2)}
                                style={{ visibility: options[2] === undefined || options[2] === null ? 'hidden' : 'visible' }}
                            >
                                {options[2]}
                            </b>
                        </div>
                        <div className='row'>
                            <b
                                className={`font-martin circle ${firstNum === 3 || secondNum === 3 ? "selected-circle" : ""}
                                ${digit === options[3] ? "win-circle" : ""}`}
                                key={uuidv4()}
                                onClick={() => handleNumClick(3)}
                                style={{ visibility: options[3] === undefined || options[3] === null ? 'hidden' : 'visible' }}
                            >
                                {options[3]}
                            </b>
                            <b
                                className={`font-martin circle ${firstNum === 4 || secondNum === 4 ? "selected-circle" : ""}
                                ${digit === options[4] ? "win-circle" : ""}`}
                                key={uuidv4()}
                                onClick={() => handleNumClick(4)}
                                style={{ visibility: options[4] === undefined || options[4] === null ? 'hidden' : 'visible' }}
                            >
                                {options[4]}
                            </b>
                            {<b
                                className={`font-martin circle ${firstNum === 5 || secondNum === 5 ? "selected-circle" : ""}
                                ${digit === options[5] ? "win-circle" : ""}`}
                                key={uuidv4()}
                                onClick={() => handleNumClick(5)}
                                style={{ visibility: options[5] === undefined || options[5] === null ? 'hidden' : 'visible' }}
                            >
                                {options[5]}
                            </b>}
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

                {gameWon && (
                    <h2 className='font-poppins done'>Well Done!</h2>
                )}

                <div>
                    <h3 className='font-poppins'>Completed operations appear here:</h3>
                    {history.map(equation => (
                        <p className='font-poppins'><strong>{equation.num1} {equation.selectedOperator} {equation.num2} = {equation.result}</strong></p>
                    ))}
                </div>
            </div >
        </>
    );
}

export default App;
