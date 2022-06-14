import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

Notify.init({
  width: '400px',
  position: 'center-top',
  fontSize: '16px',
  timeout: 2000,
});

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(searchСountry, DEBOUNCE_DELAY));

function searchСountry(e) {
  const value = e.target.value;
  const name = value.trim();

  fetchCountries(name)
    .then(findCountry)
    .catch(onFetchError)
    .finally(
      ((refs.countryInfo.innerHTML = ''), (refs.countryList.innerHTML = ''))
    );
}

function findCountry(elems) {
  if (elems.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if ((elems.length >= 2) & (elems.length <= 10)) {
    elems.map(el => {
      const item = `
          <li> <img src="${el.flags.svg}" alt="" class="flag" width=30> ${el.name.official}</li>`;
      refs.countryList.innerHTML += item;
    });
  } else {
    const markup = renderInfoCard(elems[0]);
    createInfoCard(markup);
  }
}

function renderInfoCard({ flags, name, capital, population, languages }) {
  const lang = Object.values(languages);
  return `
  <div class="container">
      <div class="country">
          <img src="${flags.svg}" alt="flag" class="flag" width=40>
          <h1 class="heading">${name.official} </h1>
      </div>
      <p class="info"><span class="info-text">Capital:</span> ${capital}</p>
      <p class="info"><span class="info-text">Population:</span> ${population}</p>
      <p ><span class="info-text">Language:</span>  ${lang} </p>
  </div>
   `;
}

const createInfoCard = mark => {
  refs.countryInfo.insertAdjacentHTML('beforeend', mark);
};

function onFetchError(error) {
  Notify.failure('Oops, there is no country with that name');
}