// Constants so that and changes to a fields name or its selector can be refactored in a single point
// i.e. not hardcoded into the functions
const NUM_ROWS = 3;
const NUM_COLS = 4;
const NUM_DECIMAL_PLACES = 2;
const BUDGET_INPUT_FIELD_IDENTIFIER = ".input-field-budget";
const BUDGET_BUFFER_FIELD_IDENTIFIER = ".input-field-buffer";
const BUDGET_SAVINGS_FIELD_IDENTIFIER = ".input-field-savings";
const TOTAL_FIELD_IDENTIFIER = ".total-field";
const NET_TOTAL_FIELD_IDENTIFIER = ".result-field";
const OUTSTANDING_FIELD_IDENTIFIER = ".outstanding-field";
const BUDGET_MAX_FIELD_IDENTIFIER = ".budget-max-field";
const RESULT_IMAGE_IDENTIFIER = ".result-image";
const RESULT_SUCCESS_IMAGE = "./images/green-tick.jpg"
const RESULT_FAIL_IMAGE = "./images/red-cross.png"

// Click event handler that is fired when the user clicks on the calculate button and performs 
// all subsequent calculations and renders the results
// returns void
const HandleClick = () => {
    let budgetInput = document.querySelector(BUDGET_INPUT_FIELD_IDENTIFIER);
    let budgetBuffer = document.querySelector(BUDGET_BUFFER_FIELD_IDENTIFIER);
    let budgetSavings = document.querySelector(BUDGET_SAVINGS_FIELD_IDENTIFIER);
    let totalField = document.querySelector(TOTAL_FIELD_IDENTIFIER);
    let netResultTotalField = document.querySelector(NET_TOTAL_FIELD_IDENTIFIER);
    let outstandingField = document.querySelector(OUTSTANDING_FIELD_IDENTIFIER);
    let budgetMaxField = document.querySelector(BUDGET_MAX_FIELD_IDENTIFIER);
    let resultImageField = document.querySelector(RESULT_IMAGE_IDENTIFIER);

    let budgetMax = CalculateBudgetMax(budgetInput.value, budgetBuffer.value);
    let total = CalculateResult(NUM_COLS, NUM_ROWS);
    let netTotal = CalculateNetTotal(total, budgetMax);
    let outstanding = CalculateOutstandingBalance(total, budgetSavings.value);

    budgetMaxField.value = `${budgetMax.toFixed(NUM_DECIMAL_PLACES)}`;
    netResultTotalField.value = `${netTotal.toFixed(NUM_DECIMAL_PLACES)}`;
    totalField.value = `${total.toFixed(NUM_DECIMAL_PLACES)}`

    if (outstanding > 0)
        outstandingField.value = `${outstanding.toFixed(NUM_DECIMAL_PLACES)}`;
    else
        outstandingField.value = 0;

    if (netTotal < 0) {
        netResultTotalField.style.color = "red";
        resultImageField.style.backgroundImage = `url(${RESULT_FAIL_IMAGE})`;
    }
    else if (netTotal >= 0) {
        netResultTotalField.style.color = "green";
        resultImageField.style.backgroundImage = `url(${RESULT_SUCCESS_IMAGE})`;
    }
};

// Helper method for getting each input field in the categorys base on column and row position
// returns the HTML element with the class name supplied to query selector
const GetInputFieldValue = (col, row) =>
    Number(document.querySelector(`.input-field-${col}-${row}`).value);

// Calculates the net total from the total and the budget max
// returns the net total
const CalculateNetTotal = (total, budget) => RoundToTwoDecimalPlaces(budget - total);

// Calculates the outstanding balance based on the total and the initial savings
// returns the outstanding balance
const CalculateOutstandingBalance = (total, savings) => RoundToTwoDecimalPlaces(total - savings);

// Rounds the number to the nearest 2 decimal places
// returns the rounded number to the nearest 2 decimal places
const RoundToTwoDecimalPlaces = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

// Calculates the total budget based on the budget and the buffer size in percent
// Returns the new budget max
const CalculateBudgetMax = (budget, buffer) => {
    let multiplier = buffer / 100 + 1;
    return RoundToTwoDecimalPlaces(budget * multiplier);
};


// Calculates the total amount of all expenses as well as the average and subtotal for each category
// Returns the total amount of all expenses
const CalculateResult = (cols, rows) => {
    let sum = 0;
    for (let c = 1; c <= cols; c++) {
        let subtotal = 0;
        for (let r = 1; r <= rows; r++) {
            subtotal += GetInputFieldValue(c, r);
        }
        let average = subtotal / NUM_ROWS;
        let averageField = document.querySelector(
            `.input-field-${c}-${NUM_ROWS + 1}`
        );
        averageField.value = RoundToTwoDecimalPlaces(average);
        let subtotalField = document.querySelector(
            `.input-field-${c}-${NUM_ROWS + 2}`
        );
        subtotalField.value = RoundToTwoDecimalPlaces(subtotal).toFixed(NUM_DECIMAL_PLACES);
        sum += subtotal;
    }
    return RoundToTwoDecimalPlaces(sum);
};
