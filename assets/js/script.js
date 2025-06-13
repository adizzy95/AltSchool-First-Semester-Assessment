// Get elements from the page (called DOM elements)
const prevDisplay = document.querySelector(".preview-operations");
const currDisplay = document.querySelector(".current-operations");
const historyDisplay = document.querySelector(".history-display");
const historyBtn = document.querySelector(".history-btn");

//define the variables to hold the operations
let firstValue = "";
let secondValue = "";
let currentOperator = "";
let history = [];

// Variable to determine if the display should be cleared for the next input
let shouldClearDisplay = false;

// Function to update the display
function updateDisplay() {
  currDisplay.textContent = secondValue || "0"; // previews the current value being entered
  prevDisplay.textContent = firstValue; // previews the first value and the operator
}

// Function to handle number button clicks
function clickNumber(number) {
  if (shouldClearDisplay) {
    secondValue = "";
    shouldClearDisplay = false;
  }

  if (number === "." && secondValue.includes(".")) return;

  secondValue += number;
  updateDisplay();
}

// Function to handle operator button clicks
function clickOperator(operator) {
  if (!secondValue) return;

  if (firstValue) {
    calculate();
  }

  switch (operator) {
    case "x":
      currentOperator = "*";
      break;
    case "÷":
      currentOperator = "/";
      break;
    case "^":
      currentOperator = "**";
      break;
    default:
      currentOperator = operator;
  }

  firstValue = `${secondValue} ${operator}`;
  secondValue = "";
  updateDisplay();
}

// Function to calculate the result
function calculate() {
  let number1 = parseFloat(firstValue);
  let number2 = parseFloat(secondValue);
  let result;

  // Check if the numbers and operator are valid
  if (!number1 || !number2 || !currentOperator) {
    return;
  }

  // to change the operators to the correct format that the Javascript can understand
  switch (currentOperator) {
    case "+":
      result = number1 + number2;
      break;
    case "-":
      result = number1 - number2;
      break;
    case "*":
      result = number1 * number2;
      break;
    case "/":
      result = number1 / number2;
      break;
    case "%":
      result = number1 % number2;
      break;
    case "**":
      result = number1 ** number2;
      break;
    default:
      return;
  }

  const equation = `${firstValue} ${secondValue} = ${result}`;
  history.push(equation);
  updateHistoryDisplay();

  secondValue = result.toString();
  firstValue = "";
  shouldClearDisplay = true;
  updateDisplay();
  prevDisplay.textContent = `${number1} ${currentOperator} ${number2} =`;
}

// show operations history
//First, to check if the history button and history display exist
if (historyBtn && historyDisplay) {
  // When the history button is clicked
  historyBtn.addEventListener("click", function () {
    // If the history button is clicked, to show the history display and hide the preview and current displays
    if (
      historyDisplay.style.display === "none" ||
      historyDisplay.style.display === ""
    ) {
      historyDisplay.style.display = "block";
      prevDisplay.style.display = "none"; // to hide the preview display when showing history
      currDisplay.style.display = "none"; // to hide the current display when showing history
    }
    // If the history is showing, hide it
    else {
      historyDisplay.style.display = "none";
      prevDisplay.style.display = "block"; // to show the preview display when hiding history
      currDisplay.style.display = "block"; // to show the current display when hiding history
    }
  });
}

// Function to update the history display
function updateHistoryDisplay() {
  historyDisplay.innerHTML = history
    .map((item) => `<div>${item}</div>`)
    .reverse()
    .join("");
}

// Function to clear the calculator
function clearCalculator() {
  firstValue = "";
  secondValue = "";
  currentOperator = "";
  updateDisplay();
}

// Function to remove the last digit from the current input
function removeLastDigit() {
  secondValue = secondValue.slice(0, -1);
  updateDisplay();
}

// to add event listeners to buttons
const allNumberButtons = document.querySelectorAll(
  ".buttons button:not(.operators):not(.equals-button):not(.backspace)"
);
const operatorButtons = document.querySelectorAll(".operators");
const equalsBtn = document.querySelector(".equals-button");
const clearBtn = document.querySelector(".clear-button");
const backspaceBtn = document.querySelector(".backspace");

allNumberButtons.forEach((btn) => {
  btn.addEventListener("click", () => clickNumber(btn.textContent));
});

operatorButtons.forEach((btn) => {
  btn.addEventListener("click", () => clickOperator(btn.textContent));
});

equalsBtn.addEventListener("click", calculate);
clearBtn.addEventListener("click", clearCalculator);
backspaceBtn.addEventListener("click", removeLastDigit);

updateDisplay();

// to make the calculator responsive when the keyboard is clicked
document.addEventListener("keydown", function (event) {
  const key = event.key;

  // for numbers and dots
  if ((key >= "0" && key <= "9") || key === ".") clickNumber(key);

  // for the operators
  if (
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/" ||
    key === "%" ||
    key === "^"
  ) {
    clickOperator(key);
  }

  // for the equals button
  if (key === "=" || key === "Enter") {
    calculate();
  }

  // for backspace
  if (key === "Backspace") {
    removeLastDigit();
  }

  //to clear the calculator
  if (key === "Escape") {
    clearCalculator();
  }
});
