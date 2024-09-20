import { TbBrandReact } from "react-icons/tb";
import TopButtons from "./components/TopButtons.jsx";
import Input from "./components/Inputs.jsx";
import TimeAndLocation from "./components/TimeAndLocation.jsx";
import TempAndDetails from "./components/TempAndDetails.jsx";
import Forecast from "./components/Forcast.jsx"; // Correct spelling
import getFormattedWeatherData from "./services/weatherServices.js";
import { useEffect, useState } from "react";

function App() {
  const [query, setQuery] = useState({ q: "New York" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      setWeather(data); // Correct state update
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  

  useEffect(() => {
    getWeather();
  }, [query, units]); // Correctly rely on query and units

  return (
    <div className="mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 from-cyan-600 to-blue-700">
      <TopButtons setQuery={setQuery} />
      <Input setQuery={setQuery} units={units} setUnits={setUnits} />

      {weather && (
        <div>
          {/* Pass weather data to components */}
          <TimeAndLocation weather={weather} />
          <TempAndDetails weather={weather} />
          <Forecast title="Hourly Forecast" items={weather.hourly} /> {/* Pass 'items' */}
          <Forecast title="Daily Forecast" items={weather.daily} /> {/* Pass 'items' */}
        </div>
      )}
    </div>
  );
}

export default App;
