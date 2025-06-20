import { getWeather } from './get-weather.js';
import { renderWeatherDisplay } from './render-weather-display.js';

const manageSearchCity = ((doc) => {
    /*** Manage search city ***/
    const searchCityForm = doc.querySelector('#search-city-form');
    const searchCityInput = doc.querySelector('#search-city-input');
    const searchCityContainer = doc.querySelector('#search-city-container');
    const cityName = doc.querySelector('#city-name');

    const _getCityList = async (cityName) => {
        const apiResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=df6abf1568cbcf5775d17b9dfeaffe81`,
        );
        const jsonData = await apiResponse.json();
        return jsonData;
    };

    const _displaySearchedCityInfo = (city, country) => {
        // the last arg (after arg passed by bind()) is the event
        getWeather.getData(city, country).then((data) => {
            renderWeatherDisplay.displayWeatherInfo(data);
        });
        searchCityInput.value = '';
        // replace cityName & country ISO
        cityName.textContent = '';
        const countrySpan = doc.createElement('span');
        countrySpan.classList.add('country-iso');
        countrySpan.textContent = country;
        cityName.append(city, countrySpan);
        searchCityContainer.removeChild(searchCityInput.nextSibling);
    };

    const _createCityLi = (city) => {
        const li = doc.createElement('li');
        li.classList.add('search-city-suggestion');
        const countrySpan = doc.createElement('span');
        countrySpan.classList.add('country-iso');
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
})(document);

export { manageSearchCity };
