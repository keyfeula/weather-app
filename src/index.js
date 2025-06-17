import "./style.css";

const searchInput = document.getElementById("search");
const searchBtn = document.querySelector(".search-btn");

async function getWeather(location) {
    console.log("location: " + location);
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=Y3BAL4LE6TF6V5CK4NMEJSJVD&contentType=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
    }
    catch (error) {
        console.error(error.message);
    }
}

searchBtn.addEventListener("click", () => getWeather(searchInput.value));