const getWeather = (() => {

    // get city coor with geocoding
    const _getCityCoor = async (cityName, countryCode) => {
        // country code in ISO 3166 alpha-2
        const apiResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=5&appid=df6abf1568cbcf5775d17b9dfeaffe81`,
            { mode: 'cors' },
        );
        const jsonData = await apiResponse.json();

        // console.log('getCityCoor');
        // console.log(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=5&appid=df6abf1568cbcf5775d17b9dfeaffe81`);
        // console.log(jsonData);

        const lat = jsonData[0].lat;
        const lon = jsonData[0].lon;

        return { lat, lon };
        // return a promise !
        // https://api.openweathermap.org/geo/1.0/direct?q=London,GB&appid=df6abf1568cbcf5775d17b9dfeaffe81
    };

    // get weather data
    /*
        const _getWeatherData = async (city, countryIso) => {
            const coor = await _getCityCoor(city, countryIso);
            const apiResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${coor.lat}&lon=${coor.lon}&units=metric&exclude=minutely&appid=902817488113353b62ab2f6e7f7a1dc9`,
            );
            const jsonData = await apiResponse.json();
            return jsonData;
            // return a promise !
            // https://api.openweathermap.org/data/3.0/onecall?lat=25.0478&lon=121.5319&units=metric&exclude=minutely&appid=df6abf1568cbcf5775d17b9dfeaffe81
        };
    */

    const _getCurrentWeatherData = async (cityCoor) => {
        const apiResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoor.lat}&lon=${cityCoor.lon}&units=metric&appid=df6abf1568cbcf5775d17b9dfeaffe81`,
        );
        const jsonData = await apiResponse.json();

        // console.log('getCurrentWeatherData');
        // console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${cityCoor.lat}&lon=${cityCoor.lon}&units=metric&appid=df6abf1568cbcf5775d17b9dfeaffe81`);
        // console.log(jsonData);

        return jsonData;
        // return a promise !
        // https://api.openweathermap.org/data/2.5/weather?lat=25.0478&lon=121.5319&units=metric&appid=df6abf1568cbcf5775d17b9dfeaffe81
    };

    const _getDailyHourlyWeatherData = async (cityCoor) => {
        const apiResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${cityCoor.lat}&lon=${cityCoor.lon}&units=metric&appid=df6abf1568cbcf5775d17b9dfeaffe81`,
        );
        const jsonData = await apiResponse.json();

        // console.log('getDailyHourlyWeatherData');
        // console.log(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityCoor.lat}&lon=${cityCoor.lon}&units=metric&appid=df6abf1568cbcf5775d17b9dfeaffe81`);
        // console.log(jsonData);

        return jsonData;
        // return a promise !
        // https://api.openweathermap.org/data/2.5/forecast?lat=25.0478&lon=121.5319&units=metric&appid=df6abf1568cbcf5775d17b9dfeaffe81
    };

    const _getCurrentWeather = (weatherObj) => {
        return {
            timeZone: weatherObj.timezone,
            dateTime: _getTimezoneDatetime(weatherObj.dt, weatherObj.timezone),
            iconCode: weatherObj.weather[0].icon,
            weatherText: weatherObj.weather[0].description,
            weatherType: weatherObj.weather[0].main,
            temperature: weatherObj.main.temp,
        };
    };
    /*
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
    */

    const _getTimezoneDatetime = (timestamp, timezoneOffset) => {
        // Convert Unix timestamp to milliseconds
        const date = new Date(timestamp * 1000);
        // Get the current timezone offset in minutes and convert to seconds
        let currentTimezoneOffset = new Date().getTimezoneOffset() * 60;
        // Reverse the sign of the current timezone offset
        // (because getTimezoneOffset method in JavaScript returns the difference, in minutes, between UTC and local time. The value is positive if the local timezone is behind UTC and negative if the local timezone is ahead of UTC.)
        currentTimezoneOffset = -currentTimezoneOffset;
        // Apply the timezone offset (adjusting for the current timezone offset)
        date.setSeconds(date.getSeconds() + timezoneOffset - currentTimezoneOffset);
        // Get the Unix timestamp in seconds
        const unixTimestamp = Math.floor(date.getTime() / 1000);

        // ! décalage de 4 heures !!!
        return unixTimestamp;
    }

    const _getHourlyWeather = (weatherObj) => {
        const all3hoursArr = weatherObj.list; // every 3 hours for 5 days
        const selectedHoursArr = [];

        // get only the next 6th "3h-hours steps"" from the next 24h
        for (let i = 0; i < 6; i++) {
            selectedHoursArr.push({
                dateTime: _getTimezoneDatetime(all3hoursArr[i].dt, weatherObj.city.timezone),
                iconCode: all3hoursArr[i].weather[0].icon,
                weatherText: all3hoursArr[i].weather[0].description,
                temperature: all3hoursArr[i].main.temp,
            });
        }
        return selectedHoursArr;
    };
    const _getDailyWeather = (weatherObj) => {
        const all3hoursArr = weatherObj.list; // every 3 hours for 5 days
        const selectedDaysArr = [];

        // 24/3= 8 forecasts per day
        // get only the next 5 days
        // ? TODO for temp_max/temp_min: set i at first obj at 12:00 ? (according to weatherObj.city.timezone)
        // OR try to get the min temp_min and the max temp_max from all obj at the same day
        for (let i = 0; i < (5 * 8); i += 8) {
            selectedDaysArr.push({
                dateTime: _getTimezoneDatetime(all3hoursArr[i].dt, weatherObj.city.timezone),
                iconCode: all3hoursArr[i].weather[0].icon,
                weatherText: all3hoursArr[i].weather[0].description,
                minTemperature: all3hoursArr[i].main.temp_min,
                maxTemperature: all3hoursArr[i].main.temp_max,
            });
        }
        return selectedDaysArr;
    };

    // get data return an array of current/hourly/daily
    const getData = async (cityName, countryCode) => {
        const coor = await _getCityCoor(cityName, countryCode);

        // let weatherData = await _getWeatherData(cityName, countryCode);
        let currentWeatherDatas = await _getCurrentWeatherData(coor);
        let dailyHourlyWeatherDatas = await _getDailyHourlyWeatherData(coor);
        return {
            currentDatas: _getCurrentWeather(currentWeatherDatas),
            hourlyDatas: _getHourlyWeather(dailyHourlyWeatherDatas),
            dailyDatas: _getDailyWeather(dailyHourlyWeatherDatas),
        };
    };

    return { getData };
})();

export { getWeather };
