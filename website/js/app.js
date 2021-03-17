// Base URL for OpenWeatherMap API
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';

// Referencing the main elements
const generateButton = document.getElementById('generate');
const zipCode = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const screenMessage = document.getElementById('screen-message');

// Referencing the elements to update the UI
const weatherIconElement = document.getElementById('weather-icon');
const tempElement = document.getElementById('temp');
const cityElement = document.getElementById('city');
const dateElement = document.getElementById('date');
const contentElement = document.getElementById('content');

//Add initial Message
screenMessage.innerText = "Type Something";

// Event listener to add function to existing HTML DOM element
generateButton.addEventListener('click', getWeatherEvent);

/* Function called by event listener */
function getWeatherEvent(event) {
  event.preventDefault();

  console.log(`Mandatory elements: ${zipCode.value}, ${feelings.value}`);

  // Checks whether the user has entered the required inputs
  if (zipCode.value && feelings.value) {
    screenMessage.innerText = '';

    getWeatherByZipCode(baseUrl, zipCode.value)
    .then(data => postWeatherData('/save', data))
    .then(() => updateUi())
    .catch(() => {
      cleanUi();
      screenMessage.innerText = 'The inserted zipcode is invalid'
    });
  } else {
    cleanUi();
    screenMessage.innerText = 'You need to enter the zipcode and feelings';
  }
}

/* Function to GET Web API Data*/
const getWeatherByZipCode = async (baseUrl, zipCode) => {
  const urldata = {
    url: `${baseUrl}${zipCode}`,
  };

  const dataWeather = await fetch('/getWeather', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(urldata)
  });

  try {
    const data = await dataWeather.json();

    if (data.cod === "404") {
      throw new Error('error 404');
    }
    return data;
  } catch (error) {
    console.log('Error =>', error);
    return error;
  }
}

/* Function to POST data */
const postWeatherData = async (url, { main, name, dt }) => {
  const postData = {
    temp: main.temp,
    name: name,
    dateTime: dt,
    content: feelings.value,
  };

  return await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
}

// Function to clear all UI
const cleanUi = () => {
  weatherIconElement.className = "";
  tempElement.innerHTML = "";
  cityElement.innerHTML = "";
  dateElement.innerHTML = "";
  contentElement.innerHTML = "";
}

/* Function to GET Project Data */
const updateUi = async () => {
  const data = await fetch('/all');
  const dataRetrieve = await data.json();

  weatherIconElement.className = "";
  weatherIconElement.className = getClassNameIcon(dataRetrieve.dateTime);

  tempElement.innerHTML = `${dataRetrieve.temp} °C`;
  cityElement.innerHTML = dataRetrieve.name;
  dateElement.innerHTML = getFormattedDate(dataRetrieve.dateTime);
  contentElement.innerHTML = dataRetrieve.content;
}

// Takes the correct CSS class based on the hours
const getClassNameIcon = (dateTime) => {
  const hours = new Date(dateTime * 1000).getUTCHours();
  const classNameIcon = hours >= 4 && hours <= 17 ? 
                        'fa fa-sun-o fa-3x' : 
                        'fa fa-moon-o fa-3x';

  return classNameIcon;
}

// Function to Format the Datetime in Date
const getFormattedDate = (dateTime) => {
  const date = new Date(dateTime * 1000);
  const year = date.getFullYear();

  // Put a zero in 1-digit numbers
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  // Put a zero in 1-digit numbers
  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '/' + day + '/' + year;
}