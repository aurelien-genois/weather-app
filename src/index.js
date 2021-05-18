import './style.css';
import { getWeather } from './modules/get-weather.js';

// VVVVV TEMP working code VVVVV
getWeather.getData('Taipei', 'TW').then((data) => {
  console.log(data);
});
// AAAAA TEMP working code AAAAA

const h1 = document.querySelector('h1');
h1.textContent = 'Hello Formofo!';
console.log(h1);
