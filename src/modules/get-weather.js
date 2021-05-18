const getWeather = (() => {
  // get city coor with geocoding
  const _getCityCoor = async (cityName, countryCode) => {
    // country code in ISO 3166 alpha-2
    const apiResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=5&appid=902817488113353b62ab2f6e7f7a1dc9`,
      { mode: 'cors' },
    );
    const jsonData = await apiResponse.json();

    const lat = jsonData[0].lat;
    const lon = jsonData[0].lon;

    return { lat, lon };
    // return a promise !
    // http://api.openweathermap.org/geo/1.0/direct?q=London,GB&appid=902817488113353b62ab2f6e7f7a1dc9
  };

  // get weather data
  const _getWeatherData = async (city, countryIso) => {
    const coor = await _getCityCoor(city, countryIso);
    const apiResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${coor.lat}&lon=${coor.lon}&units=metric&exclude=minutely&appid=902817488113353b62ab2f6e7f7a1dc9`,
    );
    const jsonData = await apiResponse.json();
    return jsonData;
    // return a promise !
    // https://api.openweathermap.org/data/2.5/onecall?lat=25.0478&lon=121.5319&units=metric&exclude=minutely&appid=902817488113353b62ab2f6e7f7a1dc9
  };

  const _getCurrentWeather = (weatherObj) => {
    return {
      dateTime: weatherObj.current.dt,
      iconCode: weatherObj.current.weather[0].icon,
      weatherText: weatherObj.current.weather[0].description,
      temperature: weatherObj.current.temp,
    };
  };
  const _getHourlyWeather = (weatherObj) => {
    const allHoursArr = weatherObj.hourly;
    const selectedHoursArr = [];
    // get only the 4h hours steps from the next 24h
    for (let i = 4; i < 28; i += 4) {
      selectedHoursArr.push({
        dateTime: allHoursArr[i].dt,
        iconCode: allHoursArr[i].weather[0].icon,
        weatherText: allHoursArr[i].weather[0].description,
        temperature: allHoursArr[i].temp,
      });
    }
    return selectedHoursArr;
  };
  const _getDailyWeather = (weatherObj) => {
    const allDaysArr = weatherObj.daily;
    const selectedDaysArr = [];
    // get only the next 7 days
    for (let i = 0; i < 7; i++) {
      selectedDaysArr.push({
        dateTime: allDaysArr[i].dt,
        iconCode: allDaysArr[i].weather[0].icon,
        weatherText: allDaysArr[i].weather[0].description,
        minTemperature: allDaysArr[i].temp.min,
        maxTemperature: allDaysArr[i].temp.max,
      });
    }
    return selectedDaysArr;
  };

  // get data return an array of current/hourly/daily
  const getData = async (cityName, countryCode) => {
    let weatherData = await _getWeatherData(cityName, countryCode);
    return [
      _getCurrentWeather(weatherData),
      _getHourlyWeather(weatherData),
      _getDailyWeather(weatherData),
    ];
  };

  return { getData };
})();

export { getWeather };
