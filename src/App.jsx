import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [coords, setCoords] = useState(null);
  const [locationData, setLocationData] = useState({});
  const getCoords = async () => {
    const data = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=buenosaires&appid=43c6f88cbed588500165cb7880b1b676`
    );
    const resp = await data.json();
    return resp;
  };
  const getLocationInfo = async (location) => {
    const data = await fetch(location);
    const resp = await data.json();
    return resp;
  };
  useEffect(()=>{
    const searchLocation = async () => {
      const locationData = await getCoords();
      const lon = locationData[0].lon;
      const lat = locationData[0].lat;
      setCoords({ lat, lon });
      if (coords) {
        const location = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=43c6f88cbed588500165cb7880b1b676`;
        const locationInfo = await getLocationInfo(location)
        setLocationData(locationInfo)
      }
    };
    searchLocation();
  },[count])
  
  return (
    <>
      <nav>
        <img src="" alt="" />
        <form action="">
          <input type="text" name="" id="" />
        </form>
      </nav>
      <section className="grid__container">
        <div className="grid__item1">
          <div className="today__now"></div>
          <div className="today"></div>
        </div>
        <div className="grid__item2">
          <div className="today__highlights"></div>
          <div className="days"></div>
        </div>
      </section>
    </>
  );
}

export default App;
