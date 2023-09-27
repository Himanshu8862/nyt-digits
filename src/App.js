import './App.css';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid"

function App() {

    const [digit, setDigit] = useState(0)
    const [options, setOptions] = useState([])
    const operands = ["↺", "+", "-", "×", "÷"];

    // const [firstNum, setFirstNum] = useState(0);
    // const [secondNum, setSecondNum] = useState(0);
    // const [operation, setOperation] = useState("");

    const handleNumClick = (e, num) => {
        e.target.classList.add('selected-circle');

    }

    const handleOpClick = (e, op) => {
        e.target.classList.add('selected-operation');

    }



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

            while (theSum < 90 && numbers.length > 2) {
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

                const numbers = getXUniqueRandomSortedNumbersInRange(6, 1, 25)
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

            setDigit(theSum);
            setOptions(options);
        }

        main()
    }, [])


    return (
        <div className="App">
            <div className='container'>
                <img className='logo' src="logo.png" width={90} alt="logo" />
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
                        {options.slice(0, 3).map((num, idx) => (
                            <b
                                className='font-martin circle'
                                key={uuidv4()}
                                onClick={(e) => handleNumClick(e, num)}
                                value={num}
                            >
                                {num}
                            </b>
                        ))}
                    </div>
                    <div className='row'>
                        {options.slice(3, 6).map((num, idx) => (
                            <b
                                className='font-martin circle'
                                key={uuidv4()}
                                onClick={(e) => handleNumClick(e, num)}
                                value={num}
                            >
                                {num}
                            </b>
                        ))}
                    </div>
                </div>
                {/* <br /> */}
                <div className="operations">
                    {operands.map((op, idx) => (
                        <button
                            className={`font-martin operation ${idx === 0 ? "undo" : ""}`}
                            key={uuidv4()}
                            onClick={(e) => handleOpClick(e, op)}
                            value={op}
                        >
                            {op}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
