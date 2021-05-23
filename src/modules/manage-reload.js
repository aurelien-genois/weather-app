import { getWeather } from './get-weather.js';
import { renderWeatherDisplay } from './render-weather-display.js';

const manageReload = ((doc) => {
  /*** Manage Reload ***/
  const reloadBtn = doc.querySelector('#reload-btn');

  reloadBtn.addEventListener('click', () => {
    const cityNameP = doc.querySelector('#city-name');
    const cityNameText = cityNameP.textContent.slice(0, -2);
    const countryIso = cityNameP.querySelector('.country-iso').textContent;
    getWeather.getData(cityNameText, countryIso).then((data) => {
      renderWeatherDisplay.displayWeatherInfo(data);
    });
  });
})(document);

export { manageReload };
