
const form = document.getElementById("weather-form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = document.getElementById("city").value.trim();
    const message = document.getElementById("message");
    const result = document.getElementById("weather-result");

    message.textContent = "Loading weather...";
    result.hidden = true;

    try {
        // Step 1: Get city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Try another name.");
        }

        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Fetch current weather
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();
        const weather = weatherData.current;

        // Step 3: Convert weather code into a description
        const conditions = {
            0: "Clear sky ☀️",
            1: "Mainly clear 🌤️",
            2: "Partly cloudy ⛅",
            3: "Overcast ☁️",
            45: "Foggy 🌫️",
            48: "Foggy 🌫️",
            51: "Light drizzle 🌦️",
            61: "Rain 🌧️",
            63: "Moderate rain 🌧️",
            65: "Heavy rain 🌧️",
            71: "Snowfall ❄️",
            80: "Rain showers 🌦️",
            95: "Thunderstorm ⛈️"
        };

        // Step 4: Display the results
        document.getElementById("city-name").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `${weather.temperature_2m} °C`;

        document.getElementById("condition").textContent =
            conditions[weather.weather_code] || "Weather information available";

        document.getElementById("humidity").textContent =
            `Humidity: ${weather.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `Wind speed: ${weather.wind_speed_10m} km/h`;

        result.hidden = false;
        message.textContent = "";

    } catch (error) {
        message.textContent = error.message;
    }
});
