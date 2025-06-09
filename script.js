const startBtn = document.querySelector(".start");
const search = document.querySelector("#inputfield");
const searchIcon = document.querySelector("#searchIcon");
const desc = document.querySelector("#desc");
const temp = document.querySelector("#temp");
const cityName = document.querySelector("#city");
const wind = document.querySelector("#windSpeed");
const humidity = document.querySelector("#humidityper");
const goHome = document.querySelector(".homeBtn");
const icon = document.querySelector("#icon");
const mainBox1 = document.querySelector(".mainBox1");
const mainBox2 = document.querySelector(".mainBox2");
const mainBox3 = document.querySelector(".mainBox3");

startBtn.addEventListener("click", () => {
  mainBox1.classList.add("inactive");
  mainBox2.classList.remove("inactive");
});

function changeIcon(weatherMain) {
  const icons = {
    Clouds: "assets/clouds.png",
    Rain: "assets/rain.png",
    Mist: "assets/mist.png",
    Haze: "assets/haze.png",
    Snow: "assets/snow.png",
    Clear: "assets/clear.png",
  };
  icon.src = icons[weatherMain] || "assets/clear.png";
}

const currentUrl = "https://api.openweathermap.org/data/2.5/weather?";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?";
const apiKey = "55401b62229dc14b1c967f58a7892245";

async function getWeatherData(city) {
  let finalUrl = `${currentUrl}q=${city}&appid=${apiKey}`;
  let weatherData = await fetch(finalUrl).then((res) => res.json());

  if (weatherData.cod == 404) {
    mainBox2.classList.add("inactive");
    mainBox3.classList.remove("inactive");
    desc.innerHTML = "description";
    temp.innerHTML = "0°c";
    cityName.innerHTML = "New York";
    wind.innerHTML = "0km/h";
    humidity.innerHTML = "0%";
    search.value = "";
    icon.src = "assets/clear.png";
    return;
  }

  desc.innerHTML = weatherData.weather[0].description;
  temp.innerHTML = Math.round(weatherData.main.temp - 273.15) + "°c";
  cityName.innerHTML = weatherData.name;
  wind.innerHTML = weatherData.wind.speed + "km/h";
  humidity.innerHTML = weatherData.main.humidity + "%";

  changeIcon(weatherData.weather[0].main);
  getForecastData(city);
}

async function getForecastData(city) {
  let res = await fetch(`${forecastUrl}q=${city}&appid=${apiKey}`);
  let data = await res.json();
  const forecastBox = document.getElementById("forecastBox");
  forecastBox.innerHTML = "";

  if (data.cod !== "200") return;

  const dailyMap = new Map();

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        temp: Math.round(item.main.temp - 273.15),
        desc: item.weather[0].main,
        icon: item.weather[0].icon,
      });
    }
  });

  let count = 0;
  for (let [date, info] of dailyMap) {
    if (count++ >= 7) break;
    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    forecastBox.innerHTML += `
      <div class="forecastDay">
        <span>${day}</span>
        <img src="https://openweathermap.org/img/wn/${info.icon}@2x.png" />
        <span>${info.temp}°C</span>
      </div>
    `;
  }
}

searchIcon.addEventListener("click", () => {
  getWeatherData(search.value);
});
search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeatherData(search.value);
  }
});
goHome.addEventListener("click", () => {
  mainBox3.classList.add("inactive");
  mainBox1.classList.remove("inactive");
});

// Forecast scroll buttons
const scrollLeft = document.getElementById("scrollLeft");
const scrollRight = document.getElementById("scrollRight");
const forecastRow = document.getElementById("forecastBox");

scrollLeft.addEventListener("click", () => {
  forecastRow.scrollBy({ left: -100, behavior: "smooth" });
});
scrollRight.addEventListener("click", () => {
  forecastRow.scrollBy({ left: 100, behavior: "smooth" });
});
