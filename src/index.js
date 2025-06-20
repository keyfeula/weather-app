import "./style.css";

const searchInput = document.getElementById("search");
const searchBtn = document.querySelector(".search-btn");
const weatherCards = document.querySelectorAll(".weather-card");
let days = [];

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
    for (let i = 0; i < json.days.length; i++) {
        let currentDay = json.days[i];
        console.log("current" + currentDay.tempmax);
        const day = {
            currentTemp: currentDay.temp,
            maxTemp: currentDay.tempmax,
            minTemp: currentDay.tempmin,
            desc: currentDay.description,
            date: currentDay.datetime
        };
        days.push(day);
    }
}

function displayWeather() {
    for (let i = 0; i < weatherCards.length; i++) {
        if (i === 0) {
            weatherCards[i].children[0].textContent = days[i].currentTemp;
            weatherCards[i].children[1].textContent = days[i].maxTemp;
            weatherCards[i].children[2].textContent = days[i].minTemp;
            weatherCards[i].children[3].textContent = days[i].desc;
        }
        else {
            weatherCards[i].children[0].textContent = days[i].maxTemp;
            weatherCards[i].children[1].textContent = days[i].minTemp;
            weatherCards[i].children[2].textContent = days[i].desc;
        }
    }
}

searchBtn.addEventListener("click", () => getWeather(searchInput.value));