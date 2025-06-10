const startBtn=document.querySelector(".start");
const search=document.querySelector("#inputfield");
const searchIcon=document.querySelector("#searchIcon");
const desc=document.querySelector("#desc");
const temp=document.querySelector("#temp");
const cityName=document.querySelector("#city");
const wind=document.querySelector("#windSpeed");
const humidity=document.querySelector("#humidityper");
const goHome=document.querySelector(".homeBtn");
const icon=document.querySelector("#icon");
const mainBox1=document.querySelector(".mainBox1");
const mainBox2=document.querySelector(".mainBox2");
const mainBox3=document.querySelector(".mainBox3");


startBtn.addEventListener("click",()=>{
    mainBox1.classList.add("inactive");
    mainBox2.classList.remove("inactive");
});

function changeIcon(weatherMain){
    let icons={
        Clouds: "assets/clouds.png",
        Rain: "assets/rain.png",
        Mist: "assets/mist.png",
        Haze: "assets/haze.png",
        Snow: "assets/snow.png",
        Clear: "assets/clear.png"
    };
    icon.src=icons[weatherMain] || "assets/clear.png";
}

const url="https://api.openweathermap.org/data/2.5/weather?";
const apiKey="55401b62229dc14b1c967f58a7892245";

async function getWeatherData(city) {
    let finalUrl=`${url}q=${city}&appid=${apiKey}`;
    let weatherData=await fetch(finalUrl).then(res=>res.json());
    console.log(weatherData);

    if(weatherData.cod ==404){
        mainBox2.classList.add("inactive");
        mainBox3.classList.remove("inactive");
        desc.innerHTML="description";
        temp.innerHTML="0°c";
        cityName.innerHTML="New York";
        wind.innerHTML="0km/h";
        humidity.innerHTML="0%";
        search.value="";
        icon.src="assets/clear.png";
    }

    desc.innerHTML=weatherData.weather[0].description;
    temp.innerHTML=Math.round(weatherData.main.temp-273.15)+"°c";
    cityName.innerHTML=weatherData.name;
    wind.innerHTML=weatherData.wind.speed+"km/h";
    humidity.innerHTML=weatherData.main.humidity+"%";

    changeIcon(weatherData.weather[0].main);
}

searchIcon.addEventListener("click",()=>{
    getWeatherData(search.value);
})

search.addEventListener("keypress",(e)=>{
    if(e.key=="Enter"){
        getWeatherData(search.value); 
    }
})

goHome.addEventListener("click",()=>{
    mainBox3.classList.add("inactive");
    mainBox1.classList.remove("inactive");  
})
