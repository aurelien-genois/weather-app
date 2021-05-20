const manageTemperatureUnit = ((doc) => {
  /*** Manage Celsius to Fahrenheit ***/
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
})(document);

export { manageTemperatureUnit };
