import { getWeather } from './get-weather.js';
import { fromUnixTime, format } from 'date-fns';

const renderWeatherDisplay = ((dom) => {
  /*** Manage search city ***/
  const searchCityForm = dom.querySelector('#search-city-form');
  const searchCityInput = dom.querySelector('#search-city-input');
  const searchCityContainer = dom.querySelector('#search-city-container');
  const cityName = dom.querySelector('#city-name');

  const _getCityList = async (cityName) => {
    const apiResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=902817488113353b62ab2f6e7f7a1dc9`,
    );
    const jsonData = await apiResponse.json();
    return jsonData;
  };

  const _displaySearchedCityInfo = (city, country) => {
    // the last arg (after arg passed by bind()) is the event
    getWeather.getData(city, country).then((data) => {
      displayWeatherInfo(data);
    });
    searchCityInput.value = '';
    cityName.textContent = city;
    searchCityContainer.removeChild(searchCityInput.nextSibling);
  };

  const _createCityLi = (city) => {
    const li = dom.createElement('li');
    li.classList.add('search-city-suggestion');
    const countrySpan = dom.createElement('span');
    countrySpan.textContent = city.country;
    li.append(city.name, countrySpan);
    li.addEventListener(
      'click',
      _displaySearchedCityInfo.bind(this, city.name, city.country),
    );
    return li;
  };

  const _createCityList = (cityList) => {
    const ul = dom.createElement('ul');
    ul.id = 'search-city-list';
    const cityLis = cityList.map(_createCityLi);
    cityLis.forEach((cityLi) => {
      ul.appendChild(cityLi);
    });
    return ul;
  };

  const _searchCityFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(searchCityForm);
    const searchValue = data.get('search-city-input');
    if (searchCityInput.nextSibling) {
      // if their is already a prec ul or message, remove it
      searchCityContainer.removeChild(searchCityInput.nextSibling);
    }
    _getCityList(searchValue).then((cities) => {
      // prevent error when no cities ({"cod":"404","message":"not found"}) or nothing {"cod":"400","message":"Nothing to geocode"}
      if ((cities.cod && cities.message) || cities.length === 0) {
        searchCityContainer.append(cities.message || 'not found');
      } else {
        const citiesUl = _createCityList(cities);
        searchCityContainer.appendChild(citiesUl);
      }
    });
  };
  searchCityForm.addEventListener('submit', _searchCityFormSubmit);

  /*** Display Weather ***/
  const todayDateTime = dom.querySelector('#date-time');
  const currentWeatherIcon = dom.querySelector('#current-weather-icon');
  const currentWeatherDesc = dom.querySelector('#current-weather-description');
  const currentWeatherTemp = dom.querySelector('#current-weather-temp');
  const hourlyWeatherLis = dom.querySelectorAll('.hourly-weather-li');
  const dailyWeatherLis = dom.querySelectorAll('.daily-weather-li');

  // todo change '°C' to '°F' when switch temp unit
  const _renderCurrentWeather = (currentDatas) => {
    // datas is a current object
    const date = fromUnixTime(currentDatas.dateTime);
    todayDateTime.textContent = format(date, 'cccc d LLLL y');
    currentWeatherIcon.src = `http://openweathermap.org/img/wn/${currentDatas.iconCode}.png`;
    currentWeatherIcon.alt = currentDatas.weatherText;
    currentWeatherDesc.textContent = currentDatas.weatherText;
    currentWeatherTemp.textContent = `${currentDatas.temperature.toFixed(1)}°C`;

    console.log(currentDatas);
  };

  const _renderHourlyWeather = (hourlyDatas) => {
    // datas is an array of hours object
    hourlyWeatherLis.forEach((li, i) => {
      const hourlyWeatherHour = li.querySelector('.hourly-weather-hour');
      const hourlyWeatherIcon = li.querySelector('.hourly-weather-icon');
      const hourlyWeatherTemp = li.querySelector('.hourly-weather-temp');
      const hour = fromUnixTime(hourlyDatas[i].dateTime);
      hourlyWeatherHour.textContent = `${format(hour, 'H')}h`;
      hourlyWeatherIcon.src = `http://openweathermap.org/img/wn/${hourlyDatas[i].iconCode}.png`;
      hourlyWeatherIcon.alt = hourlyDatas[i].weatherText;
      hourlyWeatherTemp.textContent = `${hourlyDatas[
        i
      ].temperature.toFixed()}°C`;
    });

    console.log(hourlyDatas);
  };

  const _renderDailyWeather = (dailyDatas) => {
    // datas is an array of days object
    dailyWeatherLis.forEach((li, i) => {
      const dailyWeatherHour = li.querySelector('.daily-weather-day');
      const dailyWeatherIcon = li.querySelector('.daily-weather-icon');
      const dailyWeatherTemp = li.querySelector('.daily-weather-temp');
      const day = fromUnixTime(dailyDatas[i].dateTime);
      dailyWeatherHour.textContent = format(day, 'ccc');
      dailyWeatherIcon.src = `http://openweathermap.org/img/wn/${dailyDatas[i].iconCode}.png`;
      dailyWeatherIcon.alt = dailyDatas[i].weatherText;
      dailyWeatherTemp.textContent = `${dailyDatas[
        i
      ].minTemperature.toFixed()}°C/${dailyDatas[i].maxTemperature.toFixed()}`;
    });

    console.log(dailyDatas);
  };

  const displayWeatherInfo = (weatherDatas) => {
    _renderCurrentWeather(weatherDatas.currentDatas);
    _renderHourlyWeather(weatherDatas.hourlyDatas);
    _renderDailyWeather(weatherDatas.dailyDatas);
  };

  return { displayWeatherInfo };
})(document);

export { renderWeatherDisplay };
