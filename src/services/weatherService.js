import { DateTime } from "luxon";
const API_KEY = "your key";
const BASE_URL = "https://api.openweathermap.org/data/2.5";


const getWeatherData = (infotype, searchParams) => {
  const url = new URL(BASE_URL + "/" + infotype);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const formatCurrentData = (data) => {
    console.log(data)
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
    console.log(data)
  let { list } = data;
  let { timezone } = data.city
  list = list.slice(0, 5).map((d) => {
    console.log(d.dt)
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.main.temp,
      icon: d.weather[0].icon,
    };
  });
  let hourly = list
  return { timezone, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentData);

  const { lat, lon } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  }).then(formatForecastWeather);
  return {...formattedCurrentWeather, ...formattedForecastWeather};
};

const formatToLocalTime = (
    secs,
    zone,
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
  ) => {let date = DateTime.fromSeconds(secs).plus({seconds: zone - 3600*3}).toFormat(format)

return date};

console.log(formatToLocalTime(
    1667066400, 3600))

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export {formatToLocalTime, iconUrlFromCode}
