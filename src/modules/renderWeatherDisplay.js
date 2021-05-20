import { getWeather } from './get-weather.js';
import { fromUnixTime, format } from 'date-fns';

const renderWeatherDisplay = ((doc) => {
  /*** Manage search city ***/
  const searchCityForm = doc.querySelector('#search-city-form');
  const searchCityInput = doc.querySelector('#search-city-input');
  const searchCityContainer = doc.querySelector('#search-city-container');
  const cityName = doc.querySelector('#city-name');

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
    const li = doc.createElement('li');
    li.classList.add('search-city-suggestion');
    const countrySpan = doc.createElement('span');
    countrySpan.textContent = city.country;
    li.append(city.name, countrySpan);
    li.addEventListener(
      'click',
      _displaySearchedCityInfo.bind(this, city.name, city.country),
    );
    return li;
  };

  const _createCityList = (cityList) => {
    const ul = doc.createElement('ul');
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
  const todayDateTime = doc.querySelector('#date-time');
  const currentWeatherIcon = doc.querySelector('#current-weather-icon');
  const currentWeatherDesc = doc.querySelector('#current-weather-description');
  const currentWeatherTempValue = doc.querySelector(
    '#current-weather-temp .temp-value',
  );
  const currentWeatherTempUnit = doc.querySelector(
    '#current-weather-temp .temp-unit',
  );
  const hourlyWeatherLis = doc.querySelectorAll('.hourly-weather-li');
  const dailyWeatherLis = doc.querySelectorAll('.daily-weather-li');

  const _renderCurrentWeather = (currentDatas) => {
    // datas is a current object
    const date = fromUnixTime(currentDatas.dateTime);
    todayDateTime.textContent = format(date, 'cccc d LLLL y');
    currentWeatherIcon.src = `http://openweathermap.org/img/wn/${currentDatas.iconCode}.png`;
    currentWeatherIcon.alt = currentDatas.weatherText;
    currentWeatherDesc.textContent = currentDatas.weatherText;
    currentWeatherTempValue.textContent = currentDatas.temperature.toFixed(1);
    currentWeatherTempValue.classList.add('celsius');
    currentWeatherTempUnit.textContent = '°C';

    console.log(currentDatas);
  };

  const _renderHourlyWeather = (hourlyDatas) => {
    // datas is an array of hours object
    hourlyWeatherLis.forEach((li, i) => {
      const hourlyWeatherHour = li.querySelector('.hourly-weather-hour');
      const hourlyWeatherIcon = li.querySelector('.hourly-weather-icon');
      const hourlyWeatherTempValue = li.querySelector(
        '.hourly-weather-temp .temp-value',
      );
      const hourlyWeatherTempUnit = li.querySelector(
        '.hourly-weather-temp .temp-unit',
      );
      const hour = fromUnixTime(hourlyDatas[i].dateTime);
      hourlyWeatherHour.textContent = `${format(hour, 'H')}h`;
      hourlyWeatherIcon.src = `http://openweathermap.org/img/wn/${hourlyDatas[i].iconCode}.png`;
      hourlyWeatherIcon.alt = hourlyDatas[i].weatherText;
      hourlyWeatherTempValue.textContent = hourlyDatas[i].temperature.toFixed();
      hourlyWeatherTempValue.classList.add('celsius');
      hourlyWeatherTempUnit.textContent = '°C';
    });

    console.log(hourlyDatas);
  };

  const _renderDailyWeather = (dailyDatas) => {
    // datas is an array of days object
    dailyWeatherLis.forEach((li, i) => {
      const dailyWeatherHour = li.querySelector('.daily-weather-day');
      const dailyWeatherIcon = li.querySelector('.daily-weather-icon');
      const dailyWeatherMinTempValue = li.querySelector(
        '.daily-weather-mintemp .temp-value',
      );

      const dailyWeatherMaxTempValue = li.querySelector(
        '.daily-weather-maxtemp .temp-value',
      );
      const dailyWeatherMaxTempUnit = li.querySelector(
        '.daily-weather-maxtemp .temp-unit',
      );
      const day = fromUnixTime(dailyDatas[i].dateTime);
      dailyWeatherHour.textContent = format(day, 'ccc');
      dailyWeatherIcon.src = `http://openweathermap.org/img/wn/${dailyDatas[i].iconCode}.png`;
      dailyWeatherIcon.alt = dailyDatas[i].weatherText;
      dailyWeatherMinTempValue.textContent = dailyDatas[
        i
      ].minTemperature.toFixed();
      dailyWeatherMinTempValue.classList.add('celsius');
      dailyWeatherMaxTempValue.textContent = dailyDatas[
        i
      ].maxTemperature.toFixed();
      dailyWeatherMaxTempValue.classList.add('celsius');
      dailyWeatherMaxTempUnit.textContent = '°C';
    });

    console.log(dailyDatas);
  };

  const displayWeatherInfo = (weatherDatas) => {
    _renderCurrentWeather(weatherDatas.currentDatas);
    _renderHourlyWeather(weatherDatas.hourlyDatas);
    _renderDailyWeather(weatherDatas.dailyDatas);
  };

  /*** Manage Celsius to Farenheit ***/
  const tempCheckbox = doc.querySelector('#switch-temp-checkbox');
  tempCheckbox.checked = false; // reset to celsius state
  const tempsValues = doc.querySelectorAll('.temp-text .temp-value');
  const tempsUnits = doc.querySelectorAll('.temp-text .temp-unit');

  const _convertToFahrenheit = (valueSpan, valueText) => {
    const tempF = (valueText * 9) / 5 + 32;
    if (valueSpan.parentElement.id === 'current-weather-temp') {
      valueSpan.textContent = tempF.toFixed(1);
    } else {
      valueSpan.textContent = tempF.toFixed();
    }
    valueSpan.classList.remove('celsius');
    valueSpan.classList.add('fahrenheit');
    tempsUnits.forEach((unit) => {
      unit.textContent = '°F';
    });
  };

  const _convertToCelsius = (valueSpan, valueText) => {
    const tempC = ((valueText - 32) * 5) / 9;
    if (valueSpan.parentElement.id === 'current-weather-temp') {
      valueSpan.textContent = tempC.toFixed(1);
    } else {
      valueSpan.textContent = tempC.toFixed();
    }
    valueSpan.classList.remove('fahrenheit');
    valueSpan.classList.add('celsius');
    tempsUnits.forEach((unit) => {
      unit.textContent = '°C';
    });
  };

  tempCheckbox.addEventListener('change', () => {
    tempsValues.forEach((tempValue) => {
      const actualValue = tempValue.textContent;
      if (tempValue.classList.contains('celsius')) {
        _convertToFahrenheit(tempValue, actualValue);
      } else if (tempValue.classList.contains('fahrenheit')) {
        _convertToCelsius(tempValue, actualValue);
      }
    });
  });

  return { displayWeatherInfo };
})(document);

export { renderWeatherDisplay };
