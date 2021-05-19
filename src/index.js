import './style.css';
import { getWeather } from './modules/get-weather.js';
import { renderWeatherDisplay } from './modules/renderWeatherDisplay.js';

// VVVVV TEMP working code VVVVV
// default value
getWeather.getData('Taipei', 'TW').then((data) => {
  renderWeatherDisplay.displayWeatherInfo(data);
});
// AAAAA TEMP working code AAAAA
