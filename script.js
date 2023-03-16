const currentDate = document.querySelector(".date");
const grid = document.querySelector(".grid");
const currencyList1 = document.getElementById("search-currency1");
const inputCurrency = document.querySelector(".input-currency");
const input = document.querySelector(".input");
const output = document.querySelector(".output");
const outputCurrency = document.querySelector(".output-currency");
const turnBtn = document.querySelector(".turnBtn");
const resultBtn = document.querySelector(".resultBtn");

let chosenCurrency1;
let chosenCurrency2;

let data;

fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
  .then((resp) => resp.json())
  .then((json) => (data = json));

setTimeout(function () {
  data.forEach((element) => {
    currentDate.innerHTML = data[0].exchangedate;

    // exclusion RUB, XAU, XPT, XAG, XPD
    if (
      element.cc !== "RUB" &&
      element.cc !== "XAU" &&
      element.cc !== "XPT" &&
      element.cc !== "XAG" &&
      element.cc !== "XPD"
    ) {
      grid.insertAdjacentHTML(
        "beforeend",
        `<div class="grid_item">
            <div class="grid_cc">${element.cc}</div>
            <div class="grid_txt">${element.txt}</div>
            <div class="grid_rate">${element.rate}</div>
            </div>`
      );

      // create option of datalist searching
      let option = document.createElement("option");
      option.innerHTML = element.cc;
      currencyList1.appendChild(option);
    }
  });

  // clone option of datalist to currency2
  const currencyList2 = currencyList1.cloneNode(true);

  currencyList2.id = "currencyList2";
  outputCurrency.insertAdjacentElement("afterend", currencyList2);

  inputCurrency.addEventListener("change", () => {
    data.forEach((element) => {
      if (element.cc === inputCurrency.value) {
        chosenCurrency1 = element.rate;
      }
    });
  });

  outputCurrency.addEventListener("change", () => {
    data.forEach((element) => {
      if (element.cc === outputCurrency.value) {
        chosenCurrency2 = element.rate;
      }
    });
  });
}, 200);

let result = 0;
let currencyVar;
let chosenCurrencyVar;

input.addEventListener("input", () => {
  if (output.value !== "" && result) {
    output.value = "";
  }
});

turnBtn.addEventListener("click", toggleCurrency);
resultBtn.addEventListener("click", getResult);

// keydown 'Enter' event
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getResult();
  }
});

// calc result
function getResult() {
  if (input.value !== "" && chosenCurrency1 && chosenCurrency2) {
    result = (chosenCurrency1 / chosenCurrency2) * input.value;
    output.value = result.toFixed(2);
  }
}

// toggle currency
function toggleCurrency() {
  if (inputCurrency.value && outputCurrency.value) {
    currency = outputCurrency.value;
    chosenCurrencyVar = chosenCurrency2;
    outputCurrency.value = inputCurrency.value;
    inputCurrency.value = currency;
    chosenCurrency2 = chosenCurrency1;
    chosenCurrency1 = chosenCurrencyVar;
    output.value = "";
  }
}
