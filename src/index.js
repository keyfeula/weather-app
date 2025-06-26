import "./style.css";

const searchInput = document.getElementById("search");
const searchLabel = document.querySelector(".search-container label");
const searchBtn = document.querySelector(".search-btn");
const unitsBtn = document.querySelector(".units-btn");
const weatherCards = document.querySelectorAll(".card");
const locationHeading = document.querySelector("h2.location");
const currentDateHeading = document.querySelector("h2.current-date");

let days = [];
let location;
let degreeUnits = "F";
let firstQuery = true;

searchLabel.focus();
getWeather("Los Angeles");

async function getWeather(location) {
    searchInput.setCustomValidity("");
    if (firstQuery) {
        firstQuery = false;
    }
    else if (!searchInput.validity.valid) {
        searchInput.setCustomValidity("Please enter a location");
        searchInput.reportValidity();
        return;
    }

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=Y3BAL4LE6TF6V5CK4NMEJSJVD&contentType=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        storeData(json);
        displayWeather();
    }
    catch (error) {
        console.error(error.message);
    }
}

function storeData(json) {
    days = [];
    degreeUnits = "F";
    location = json.resolvedAddress;
    for (let i = 0; i < json.days.length; i++) {
        let currentDay = json.days[i];
        const day = {
            currentTemp: currentDay.temp,
            maxTemp: currentDay.tempmax,
            minTemp: currentDay.tempmin,
            desc: currentDay.description.split(".")[0],
            date: currentDay.datetime
        };
        days.push(day);
    }
}

function displayWeather() {  
    for (let i = 0; i < weatherCards.length; i++) {
        let card = weatherCards[i];
        let day = days[i];
        let date;

        if (i === 0) {
            date = new Date(days[0].date + "T00:00");
            date = date.toString().split(" ");
            date = `${date[0]} ${date[1]} ${date[2]}`;
            currentDateHeading.textContent = date;
            locationHeading.textContent = location;

            card.children[0].textContent = `Current: ${day.currentTemp.toFixed(0)} °${degreeUnits}`;
            card.children[1].textContent = `High: ${day.maxTemp.toFixed(0)} °${degreeUnits}`;
            card.children[2].textContent = `Low: ${day.minTemp.toFixed(0)} °${degreeUnits}`;
            card.children[3].textContent = day.desc;
        }
        else {
            date = new Date(day.date + "T00:00");
            date = date.toString().split(" ");

            card.children[0].textContent = `${date[0]} ${date[1]} ${date[2]}`;
            card.children[1].textContent = `High: ${day.maxTemp.toFixed(0)} °${degreeUnits}`;
            card.children[2].textContent = `Low: ${day.minTemp.toFixed(0)} °${degreeUnits}`;
            card.children[3].textContent = day.desc;
        }
    }
}

function convertDegreeUnits() {
    if (degreeUnits === "F") {
        degreeUnits = "C";
        for (let day of days) {
            day.maxTemp = (day.maxTemp - 32) / 1.8;
            day.minTemp = (day.minTemp - 32) / 1.8;
            day.currentTemp = (day.currentTemp - 32) / 1.8;
        }
    }
    else {
        degreeUnits = "F";
        for (let day of days) {
            day.maxTemp = day.maxTemp * 1.8 + 32;
            day.minTemp = day.minTemp * 1.8 + 32;
            day.currentTemp = day.currentTemp * 1.8 + 32;
        }
    }
}

searchBtn.addEventListener("click", () => getWeather(searchInput.value));
unitsBtn.addEventListener("click", () => {
    convertDegreeUnits();
    displayWeather();
})