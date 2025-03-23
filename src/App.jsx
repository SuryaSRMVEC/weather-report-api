import { useState, useEffect } from "react";
import axios from "axios";
import { IoMdSunny, IoMdRainy, IoMdCloudy, IoMdSnow, IoMdThunderstorm, IoMdSearch } from "react-icons/io";
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind } from "react-icons/bs";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

const APIkey = "cca613aa879e2e36f93439d4a92724cf";

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("Madrid, Spain");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;
    axios
      .get(url)
      .then((res) => {
        setTimeout(() => {
          setData(res.data);
          setLoading(false);
        }, 1200);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err.response?.data?.message || "An error occurred");
      });
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => setErrorMsg(""), 2000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  const handleInput = (e) => setInputValue(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setLocation(inputValue);
    } else {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
    }
    setInputValue("");
  };

  if (!data || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-blue-300">
        <ImSpinner8 className="text-white text-6xl animate-spin" />
      </div>
    );
  }

  const weatherIcons = {
    Clouds: <IoMdCloudy className="text-gray-400" />,
    Haze: <BsCloudHaze2Fill className="text-gray-300" />,
    Rain: <IoMdRainy className="text-blue-500" />,
    Clear: <IoMdSunny className="text-yellow-400" />,
    Drizzle: <BsCloudDrizzleFill className="text-blue-300" />,
    Snow: <IoMdSnow className="text-blue-200" />,
    Thunderstorm: <IoMdThunderstorm className="text-purple-600" />,
  };

  const date = new Date();

  return (
    <div className="flex flex-col items-center h-screen bg-gradient-to-r from-indigo-500 to-blue-300 p-6">
      {errorMsg && <div className="bg-red-600 text-white p-2 rounded-md mb-4">{errorMsg}</div>}
      <form
        className={`w-full max-w-md bg-black/30 p-2 rounded-full flex items-center transition ${animate ? "animate-shake" : ""}`}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          className="flex-1 bg-transparent outline-none text-white pl-4"
          placeholder="Search city or country"
        />
        <button className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full">
          <IoMdSearch className="text-white text-xl" />
        </button>
      </form>
      <div className="bg-black/40 text-white p-6 rounded-xl mt-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center">
          <div className="text-7xl">{weatherIcons[data.weather[0].main]}</div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold">{data.name}, {data.sys.country}</h2>
            <p className="text-sm">{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</p>
          </div>
        </div>
        <div className="flex justify-center items-center my-8">
          <span className="text-8xl font-light">{Math.round(data.main.temp)}</span>
          <TbTemperatureCelsius className="text-4xl" />
        </div>
        <p className="text-center capitalize text-lg">{data.weather[0].description}</p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center space-x-2">
            <BsEye className="text-xl" />
            <span>Visibility: {data.visibility / 1000} km</span>
          </div>
          <div className="flex items-center space-x-2">
            <BsThermometer className="text-xl" />
            <span>Feels like: {Math.round(data.main.feels_like)}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <BsWater className="text-xl" />
            <span>Humidity: {data.main.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <BsWind className="text-xl" />
            <span>Wind: {data.wind.speed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
