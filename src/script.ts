const convertButton = document.getElementById("convertor-button") as HTMLButtonElement;
const amountEntered = document.getElementById("amount") as HTMLInputElement;
const firstCurrEntered = document.getElementById("first-curr") as HTMLSelectElement;
const secondCurrEntered = document.getElementById("second-curr") as HTMLSelectElement;
const resultConvertedAmount = document.getElementById("result-clear") as HTMLParagraphElement;
const resultError = document.getElementById("result-error") as HTMLParagraphElement;

interface CurrencyData {
    "name":{
        common: string;
    };
    "currencies":object[];
    "flag":string;
}

const fillSelectSection = async (): Promise<void> => {
    try{
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies,flag");
        if(!response.ok){
            throw new Error("Something went wrong");
        }
        const data: CurrencyData[] = await response.json();
        data.forEach((country):void=>{
            const countryName = country.name.common;
            const countryFlag = country.flag;
            if(country.currencies){
                Object.keys(country.currencies).forEach((currency):void=>{
                    const currencyCode = currency;
                    const currencyName = country.currencies[currency].name;
                    const option = document.createElement("option");
                    option.value = currencyCode;
                    option.textContent = `${country.flag} ${currencyCode} - ${currencyName}`;
                    firstCurrEntered?.appendChild(option);
                    secondCurrEntered?.appendChild(option.cloneNode(true));
                })
            }
        });
    } catch(error){
        console.error(error);
    }
}
fillSelectSection();

convertButton.addEventListener("click", async (): Promise<void> => {
    try{
        if(!resultConvertedAmount.classList.contains("hidden")){
            resultConvertedAmount.classList.add("hidden");
        }
        if(!resultError.classList.contains("hidden")){
            resultError.classList.add("hidden");
        }
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${firstCurrEntered.value}`);
        if(!response.ok){
            throw new Error("Something went wrong");
        }
        const data = await response.json();
        const conversionRate = data.rates[secondCurrEntered.value];
        const amount:number = parseFloat(amountEntered.value);
        if(amount<0 || isNaN(amount)){
            resultError.textContent = "Please enter a valid amount";
            resultConvertedAmount.textContent = "";
            resultError.classList.remove("hidden");
        } else {
            resultConvertedAmount.textContent = `${amount} ${firstCurrEntered.value} = ${(amount*conversionRate).toFixed(2)} ${secondCurrEntered.value}`;
            resultConvertedAmount.classList.remove("hidden");
        }
    } catch(error){
        console.error(error);
    }
});