import { fromUnixTime, format } from 'date-fns';
import './manage-search-city.js';
import './manage-temperature-unit.js';
import './manage-reload.js';
import { getUnsplashImg } from './get-unsplash-img';

const renderWeatherDisplay = ((doc) => {
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
    currentWeatherIcon.src = `http://openweathermap.org/img/wn/${currentDatas.iconCode}@4x.png`;
    currentWeatherIcon.alt = currentDatas.weatherText;
    currentWeatherDesc.textContent = currentDatas.weatherText;
    currentWeatherTempValue.textContent = currentDatas.temperature.toFixed(1);
    currentWeatherTempValue.classList.add('celsius');
    currentWeatherTempUnit.textContent = '°C';
    getUnsplashImg
      .getImgInfos(currentDatas.weatherText)
      .then((result) => {
        doc.body.style.backgroundImage = `url(${result.url}),linear-gradient(rgb(209, 246, 255), rgb(85, 166, 199))`;
        console.log(
          `background image (${result.desc}) by ${result.creator}:`,
          result.creatorLink,
          'background image URL:',
          result.url,
        );
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(currentDatas);
  };

  const _renderHourlyWeather = (hourlyDatas) => {
    // datas is an array of hours object
    hourlyWeatherLis.forEach((li, i) => {
      const hourlyWeatherHour = li.querySelector('.hourly-weather-hour');
      const hourlyWeatherIcon = li.querySelector('.hourly-weather-icon');
      const hourlyWeatherDesc = li.querySelector('.hourly-weather-desc');
      const hourlyWeatherTempValue = li.querySelector(
        '.hourly-weather-temp .temp-value',
      );
      const hourlyWeatherTempUnit = li.querySelector(
        '.hourly-weather-temp .temp-unit',
      );
      const hour = fromUnixTime(hourlyDatas[i].dateTime);
      hourlyWeatherHour.textContent = `${format(hour, 'H')}h`;
      hourlyWeatherIcon.src = `http://openweathermap.org/img/wn/${hourlyDatas[i].iconCode}@2x.png`;
      hourlyWeatherIcon.alt = hourlyDatas[i].weatherText;
      hourlyWeatherDesc.textContent = hourlyDatas[i].weatherText;
      hourlyWeatherTempValue.textContent = hourlyDatas[i].temperature.toFixed();
      hourlyWeatherTempValue.classList.add('celsius');
      hourlyWeatherTempUnit.textContent = '°C';
    });

    console.log(hourlyDatas);
  };

  const _renderDailyWeather = (dailyDatas) => {
    // datas is an array of days object
    dailyWeatherLis.forEach((li, i) => {
      const dailyWeatherDay = li.querySelector('.daily-weather-day');
      const dailyWeatherIcon = li.querySelector('.daily-weather-icon');
      const dailyWeatherDesc = li.querySelector('.daily-weather-desc');
      const dailyWeatherMinTempValue = li.querySelector(
        '.daily-weather-mintemp.temp-value',
      );

      const dailyWeatherMaxTempValue = li.querySelector(
        '.daily-weather-maxtemp.temp-value',
      );
      const dailyWeatherTempUnit = li.querySelector('.temp-unit');
      const day = fromUnixTime(dailyDatas[i].dateTime);
      dailyWeatherDay.textContent = format(day, 'ccc');
      dailyWeatherIcon.src = `http://openweathermap.org/img/wn/${dailyDatas[i].iconCode}@2x.png`;
      dailyWeatherIcon.alt = dailyDatas[i].weatherText;
      dailyWeatherDesc.textContent = dailyDatas[i].weatherText;
      dailyWeatherMinTempValue.textContent = dailyDatas[
        i
      ].minTemperature.toFixed();
      dailyWeatherMinTempValue.classList.add('celsius');
      dailyWeatherMaxTempValue.textContent = dailyDatas[
        i
      ].maxTemperature.toFixed();
      dailyWeatherMaxTempValue.classList.add('celsius');
      dailyWeatherTempUnit.textContent = '°C';
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
