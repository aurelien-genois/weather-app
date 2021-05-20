import './style.css';
import { getWeather } from './modules/get-weather.js';
import { renderWeatherDisplay } from './modules/render-weather-display.js';

// default value
getWeather.getData('Taipei', 'TW').then((data) => {
  renderWeatherDisplay.displayWeatherInfo(data);
});
