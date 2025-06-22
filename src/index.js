import "./style.css";

const searchInput = document.getElementById("search");
const searchBtn = document.querySelector(".search-btn");
const unitsBtn = document.querySelector(".units-btn");
const weatherCards = document.querySelectorAll(".weather-card");
let days = [];
let degreeUnits = "F";

async function getWeather(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=Y3BAL4LE6TF6V5CK4NMEJSJVD&contentType=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        storeData(json);
        displayWeather();
    }
    catch (error) {
        console.error(error.message);
    }
}

function storeData(json) {
    days = [];
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
        if (i === 0) {
            card.children[0].textContent = `Current: ${day.currentTemp.toFixed(0)} ${degreeUnits}`;
            card.children[1].textContent = `High: ${day.maxTemp.toFixed(0)} ${degreeUnits}`;
            card.children[2].textContent = `Low: ${day.minTemp.toFixed(0)} ${degreeUnits}`;
            card.children[3].textContent = day.desc;
        }
        else {
            card.children[0].textContent = `High: ${day.maxTemp.toFixed(0)} ${degreeUnits}`;
            card.children[1].textContent = `Low: ${day.minTemp.toFixed(0)} ${degreeUnits}`;
            card.children[2].textContent = day.desc;
        }
    }
}

searchBtn.addEventListener("click", () => getWeather(searchInput.value));
unitsBtn.addEventListener("click", () => {
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
    displayWeather();
})