import './style.css';
import { getWeather } from './modules/get-weather.js';
import { renderWeatherDisplay } from './modules/renderWeatherDisplay.js';

// VVVVV TEMP working code VVVVV
const weatherDisplay = document.querySelector('#weather-data');
// default value
getWeather.getData('Taipei', 'TW').then((data) => {
  // ! replace with display the weather info fn
  weatherDisplay.textContent = JSON.stringify(data);
  console.log(data);
});
// AAAAA TEMP working code AAAAA

const h1 = document.querySelector('h1');
h1.textContent = 'Hello Formofo!';
