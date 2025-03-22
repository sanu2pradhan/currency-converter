const API_KEY = "c38f8c0ce2e5ff88eaa9f418"; // Replace with your actual API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// 🟢 Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {  // Using external countryList file
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }
  
    // Construct the API URL dynamically based on the selected currency
    const URL = `${BASE_URL}${fromCurr.value}`;
  
    try {
      let response = await fetch(URL);
      let data = await response.json();
  
      // Check if the API call was successful
      if (data.result !== "success") {
        throw new Error("API Error: " + data["error-type"]);
      }
  
      let rate = data.conversion_rates[toCurr.value]; // Get conversion rate
      let finalAmount = amtVal * rate;
  
      // Update the UI with the converted amount
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
      msg.innerText = "Error fetching exchange rate!";
      console.error("Error:", error);
    }
  };
  

// 🟢 Function to update currency flags
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; // Using external countryList file

  if (!countryCode) {
    console.warn(`Country code not found for: ${currCode}`);
    return;
  }

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) img.src = newSrc;
};

// 🟢 Attach event listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// 🟢 Load exchange rates on page load
window.addEventListener("load", updateExchangeRate);
