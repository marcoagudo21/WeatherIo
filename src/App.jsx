import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import logo from "./assets/logo.png";
import sun from "./assets/01d.png";
import "./App.css";

function App() {
  const date = new Date().toDateString();
  const [locationName, setLocationName] = useState();
  const [coords, setCoords] = useState();
  const [location, setLocation] = useState();
  const [forecastData, setForecastData] = useState({
    day1: {
        temp: 12,
        weatherInfo: "Clouds",
        day: "Tue, 31"
    },
    day2: {
        temp: 11,
        weatherInfo: "Clouds",
        day: "Wed, 01"
    },
    day3: {
        temp: 9,
        weatherInfo: "Rain",
        day: "Thu, 02"
    },
    day4: {
        temp: 10,
        weatherInfo: "Clouds",
        day: "Fri, 03"
    },
    day5: {
        temp: 10,
        weatherInfo: "Clouds",
        day: "Sat, 04"
    }
});
const inputRef = useRef()
  const [locationInfo, setLocationInfo] = useState({});
  //1 Manejo de input text
  const handleChange = (e) => {
    setLocationName(e.target.value);
    console.log(locationName);
  };

  //1.2 Realizo input y llamo a getCoords
  const handleSubmit = (e) => {
    e.preventDefault();
    getCoords(locationName);
  };
  // 2 getCoords trae las lat/lon y setea en el estado setCoords
  const getCoords = async (name) => {
      const data = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=43c6f88cbed588500165cb7880b1b676`
      );
      const resp = await data.json();
      console.log(resp)
      if(resp.length != 0){
        console.log(resp.length)
        setCoords(resp);
      } else{
        document.querySelector('input').classList.add('locationError')

        setTimeout(() => {
          document.querySelector('input').classList.remove('locationError')
        }, 500);

      }
    
    
    
  };

  // 3 cuando se efectue un cambio en coords se ejecuta este efecto
  useEffect(() => {
    if (coords) {
      getLocation();
    } else{
      getCoords('Buenos Aires');
      // Aca luego puedo agregar que puede pasar en caso de que la ubicacion sea erronea
    }
  }, [coords]);

  // 3.1 getLocation trae la informacion del clima del momento y de los proximos 5 dias, los setea con setLocation y setForecastData
  const getLocation = async () => {
    let lat = coords[0].lat;
    let lon = coords[0].lon;
    console.log(lat, lon);
    const data1 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=43c6f88cbed588500165cb7880b1b676`
    );
    const resp1 = await data1.json();
    const data2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=43c6f88cbed588500165cb7880b1b676`
    );
    const resp2 = await data2.json();
    const data3 = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=43c6f88cbed588500165cb7880b1b676`
    );
    const resp3 = await data3.json();

    console.log(resp2);

    const dataNow = {
      tempNow: resp1.main.temp - 273,
      weatherInfo: resp1.weather[0].main,
      name: resp1.name,
      pm25: resp3.list[0].components.pm2_5,
      so2: resp3.list[0].components.so2,
      no2: resp3.list[0].components.no2,
      o3: resp3.list[0].components.o3,
      sunrise: `${new Date(resp1.sys.sunrise * 1000)
        .toUTCString()
        .slice(17, 22)} AM`,
      sunset: `${new Date(resp1.sys.sunset * 1000)
        .toUTCString()
        .slice(17, 22)} AM`,
      humidity: resp1.main.humidity,
      pressure: resp1.main.pressure,
      visibility: `${resp1.visibility / 1000}K`,
      sensation: resp1.main.feels_like - 273,
    };
    const data5D = {
      day1: {
        temp: Math.round(resp2.list[5].main.temp - 273),
        weatherInfo: resp2.list[5].weather[0].main,
        day: new Date(resp2.list[5].dt * 1000).toUTCString().slice(0, 11),
      },
      day2: {
        temp: Math.round(resp2.list[13].main.temp - 273),
        weatherInfo: resp2.list[13].weather[0].main,
        day: new Date(resp2.list[13].dt * 1000).toUTCString().slice(0, 11),
      },
      day3: {
        temp: Math.round(resp2.list[21].main.temp - 273),
        weatherInfo: resp2.list[21].weather[0].main,
        day: new Date(resp2.list[21].dt * 1000).toUTCString().slice(0, 11),
      },
      day4: {
        temp: Math.round(resp2.list[29].main.temp - 273),
        weatherInfo: resp2.list[29].weather[0].main,
        day: new Date(resp2.list[29].dt * 1000).toUTCString().slice(0, 11),
      },
      day5: {
        temp: Math.round(resp2.list[31].main.temp - 273),
        weatherInfo: resp2.list[31].weather[0].main,
        day: new Date(resp2.list[31].dt * 1000).toUTCString().slice(0, 11),
      },
    };
    console.log(data5D);
    console.log(dataNow);

    setLocationInfo(dataNow );
    
    setLocation(resp1);
    setForecastData(data5D);
  };

  return (
    <div className="container">
      <nav>
        <img src={logo} alt="logo" />
        <form action="submit" onSubmit={handleSubmit}>
          <i class="fa-solid fa-magnifying-glass"></i>{" "}
          <input ref={inputRef} type="text" name="" id="" onChange={handleChange} />
        </form>
      </nav>
      <section className="grid__container">
        <div className="grid__item1">
          <div className="today__now">
            <div className="info1">
              <p style={{ fontWeight: "bold" }}>Now</p>
              <p
                style={{
                  fontSize: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {Math.round(locationInfo.tempNow)} °c
                <span>
                  <img src={sun} alt="" />
                </span>
              </p>
              <p>{locationInfo.weatherInfo}</p>
            </div>
            <div>
              <hr />
            </div>
            <div className="info2">
              <p>{locationInfo.name}</p>
              <p>{date}</p>
            </div>
          </div>
        </div>
        <div className="grid__item2">
          <p className="grid__forecast">5 Days Forecast</p>
          <div className="grid__forecast__day">
            <span>
              <img src={sun} alt="sun" /> {forecastData.day1.temp}°
            </span>{" "}
            <span>{forecastData.day1.day} </span>
          </div>
          <div className="grid__forecast__day">
            <span>
              <img src={sun} alt="sun" /> {forecastData.day2.temp}°
            </span>{" "}
            <span>{forecastData.day2.day} </span>
          </div>
          <div className="grid__forecast__day">
            <span>
              <img src={sun} alt="sun" /> {forecastData.day3.temp}°
            </span>{" "}
            <span>{forecastData.day3.day} </span>
          </div>
          <div className="grid__forecast__day">
            <span>
              <img src={sun} alt="sun" /> {forecastData.day4.temp}°
            </span>{" "}
            <span>{forecastData.day4.day} </span>
          </div>
          <div className="grid__forecast__day">
            <span>
              <img src={sun} alt="sun" /> {forecastData.day5.temp}°
            </span>{" "}
            <span>{forecastData.day5.day} </span>
          </div>
        </div>
        <div className="grid__item3">
          <p style={{padding:'1%'}}>Today Highlights</p>
          <div className="today__highlights">
            <div className="highlights1">
              <div className="highlights1__air">
                <p>Air Quality Index</p>
                <div className="air__info">
                  <i class="fa-solid fa-wind"></i>
                  <div className="air__data">
                    <p>PM25</p>
                    <h2>{locationInfo.pm25}</h2>
                  </div>{" "}
                  <div className="air__data">
                    <p>SO2</p>
                    <h2>{locationInfo.so2}</h2>
                  </div>
                  <div className="air__data">
                    <p>NO2</p>
                    <h2>{locationInfo.no2}</h2>
                  </div>
                  <div className="air__data">
                    <p>O3</p>
                    <h2>{locationInfo.o3}</h2>
                  </div>
                </div>
              </div>
              <div className="highlights1__sunrisesunsets">
                <p>Sunrise & Sunset</p>
                <div className="sunrisesunset__info">
                  <div className="sunrise">
                    <i class="fa-regular fa-sun"></i>
                    <div className="sunrise__data">
                      <p>Sunrise</p>
                      <h2>{locationInfo.sunrise}</h2>
                    </div>
                  </div>
                  <div className="sunset">
                    <i class="fa-regular fa-moon"></i>
                    <div className="sunset__data">
                      <p>Sunset</p>
                      <h2>{locationInfo.sunset}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="highlights2">
              <div className="highlights2__humidity">
                <div className="humidity__info1">
                  <p>Humidity</p>
                  <i class="fa-regular fa-droplet-percent"></i>
                </div>
                <h2>{Math.round(locationInfo.humidity)}%</h2>
              </div>
              <div className="highlights2__pressure">
                <div className="pressure__info1">
                  <p>Pressure</p>
                  <i class="fa-regular fa-stopwatch"></i>
                </div>
                <h2>{locationInfo.pressure}hPa</h2>
              </div>
              <div className="highlights2__visibility">
                <div className="visibility__info1">
                  <p>Visibility</p>
                  <i class="fa-regular fa-eye"></i>
                </div>
                <h2>{locationInfo.visibility}</h2>
              </div>
              <div className="highlights2__sensation">
                <div className="sensation__info1">
                  <p>Sensation</p>
                  <i class="fa-solid fa-temperature-three-quarters"></i>
                </div>
                <h2>{Math.round(locationInfo.sensation)}°C</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
