import { DateTime } from "luxon";

const API_KEY = "3978877770fba12a28a28caa1eebc1ed";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const iconUrlFromCode = (icon) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;

const formatToLocalTime = (
  sec,
  offset,
  format = "cccc, dd LLL yyyy 'Local time:' hh:mm a"
) =>
  DateTime.fromSeconds(sec, { zone: "utc" })
    .plus({ seconds: offset }) // Add the timezone offset in seconds
    .toFormat(format);

const formatCurrent = async (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0];
  const formattedLocalTime = formatToLocalTime(dt, timezone);

  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"),
    speed,
    icon: iconUrlFromCode(icon),
    formattedLocalTime,
    dt,
    timezone,
    lat,
    lon,
  };
};

const formatForecastWeather = (sec, offset, data) => {
  // hourly forecast
  const hourly = data
    .filter((f) => f.dt > sec)
    .slice(0, 5)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      data: f.dt_txt,
    }));

  // daily forecast
  const daily = data
    .filter((f) => f.dt_txt.includes("00:00:00")) // Adjust this if necessary
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "ccc"),
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }));

  return { hourly, daily };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrent);

  const { dt, lat, lon, timezone } = formattedCurrWeather;

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units || "metric", // Use metric units by default
  }).then((d) => formatForecastWeather(dt, timezone, d.list));

  console.log(formattedCurrWeather);
  console.log(formattedForecastWeather);

  return { ...formattedCurrWeather, ...formattedForecastWeather };
};

export default getFormattedWeatherData;
