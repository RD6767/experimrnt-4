
const apiKey = "YOUR_API_KEY";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const result = document.getElementById("weatherResult");

    if (city === "") {
        result.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
        result.innerHTML = "<p>Loading weather data...</p>";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found!");
        }

        const data = await response.json();

        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        result.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>

            <img src="https://openweathermap.org/img/wn/${icon}@2x.png"
                 alt="${description}">

            <h3>${temperature}°C</h3>

            <p><b>Weather:</b> ${description}</p>
            <p><b>Humidity:</b> ${humidity}%</p>
            <p><b>Wind Speed:</b> ${windSpeed} m/s</p>
        `;

    } catch (error) {
        result.innerHTML = `<p>${error.message}</p>`;
    }
}
