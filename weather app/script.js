
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-conatiner");
const userInfoContainer = document.querySelector(".user-info-container");

//initially
let currentTab = userTab;
const API_KEY = "be284507c8f7aa9153d863329c45f418";
currentTab.classList.add("current-tab");
getfronSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab != currentTab)
    {
        //removing background color --> current-tab
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")
    }

    if(!searchForm.classList.contains("active")){
        //if search container is invisible ? then make it visible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // i was on search tab now i want to make your weather tab visible
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfronSessionStorage();
    }
}
userTab.addEventListener("click", () =>{
    //passed clicked tab as input parameter
    switchTab(userTab);
})
searchTab.addEventListener("click", () =>{
    //passed clicked tab as input parameter
    switchTab(searchTab);
})


// checks if coordinate are already present in session storage
function getfronSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // if local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo_c(coordinates);
    }
}
async function fetchUserWeatherInfo_c(coordinates){
    const {lat,lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader invisible
    loadingScreen.classList.add("active");

    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");

        console.log("Error Found", err);
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element

    const cityName = document.querySelector("[data-cityNAme]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherInfo object and put it UI elements

    cityName.innerText= weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
        
    }
    else{
        alert("No geolocation support available");
        console.log("No geolocation support available")
    }
}

function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo_c(userCoordinates);
}

const grantAccessBtn = document.querySelector("[data-grantAccess]")
grantAccessBtn.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
        fetchUserWeatherInfo(cityName);
})

async function fetchUserWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err)
    {
        console.log("error found ", err)
    }
}



// https://api.openweathermap.org/data/2.5/weather?lat=14.33&lon=17.77&appid=be284507c8f7aa9153d863329c45f418