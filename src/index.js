import './sass/index.scss';
import Notiflix from 'notiflix';
const axios = require('axios').default;

const inputRef = document.querySelector('[name="searchQuery"]');
const searchRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');

// inputRef.addEventListener('input', onInput);
searchRef.addEventListener('submit', onSearch);
loadMoreRef.addEventListener('click', onLoadMore);

let searchQuery = '';
let page = 0;
let totalHits = 0;

function onSearch(evt) {
  loadMoreRef.style.display = 'none';
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  resetPage();

  evt.preventDefault();

  resetGallery();

  getPictures()
    .then(renderGalleryCard)
    // .then(pictures => console.log(pictures))
    .catch(error => console.log(error));
}

const BASE_URL = `https://pixabay.com/api/?key=34603447-420b9507c9dfa301393340c59`;
const PER_PAGE = `40`;

async function getPictures() {
  page += 1;
  try {
    const response = await axios.get(
      `${BASE_URL}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${page}`
    );
    totalHits = response.data.totalHits;
    return response.data.hits;
  } catch (error) {
    console.error(error);
  }
}

function renderGalleryCard(pictures) {
  if (pictures.length === 0) {
    console.log(pictures.length);
    Notiflix.Notify.info(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  } else {
    const galleryMarkup = pictures
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__img"/>
  <div class="info">
    <p class="info-item">
      <b>Likes </b>${likes}
    </p>
    <p class="info-item">
      <b>Views </b>${views}
    </p>
    <p class="info-item">
      <b>Comments </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads </b> ${downloads}
    </p>
  </div>
</div>`;
        }
      )
      .join('');

    galleryRef.insertAdjacentHTML('beforeend', galleryMarkup);
    showButton();
    totalHitsCheck();
  }
}

function totalHitsCheck() {
  if (totalHits < page * PER_PAGE) {
    hideButton();
  }
}

function onLoadMore() {
  getPictures()
    .then(renderGalleryCard)
    .catch(error => console.log(error));
}

function showButton() {
  loadMoreRef.style.display = 'inline-block';
}

function hideButton() {
  loadMoreRef.style.display = 'none';
  Notiflix.Notify.failure(
    `We're sorry, but you've reached the end of search results.`
  );
}

function resetGallery() {
  galleryRef.innerHTML = '';
}

function resetPage() {
  page = 0;
}

// function onInput(evt) {
//   //   searchQuery = evt.currentTarget.value;
//   //   console.log(searchQuery);
// }

// async function fetchGallery(name) {
//   fetch(`${BASE_URL}${name}?fields=name,capital,population,flags,languages`)
//     .then(response => {
//       if (!response.ok) {
//         Notiflix.Notify.failure('Oops, there is no country with that name');
//       }
//       return response.json();
//     })
//     .then(renderGalleryCard)
//     .catch(error => {
//       console.log(error);
//     });
// }
// function renderCountryCard(countries) {
//   if (countries.length > 10) {
//     Notiflix.Notify.info(
//       'Too many matches found. Please enter a more specific name.'
//     );
//     clearAllFields();
//   }
//   if (countries.length === 1) {
//     const countryMarkup = countries
//       .flatMap(({ flags, languages, population, capital, name }) => {
//         return `<h1 class="title"><img
//         src="${flags.svg}"
//         alt="${flags.alt}"
//         width="40" height="25" />${name.official}</h1>
//       <ul class="country-info__list">
//         <li><b>Capital:</b> ${capital}</li>
//         <li><b>Population:</b> ${population}</li>
//         <li><b>Languages:</b> ${Object.values(languages)}</li>
//       </ul>`;
//       })
//       .join('');
//     countryInfoRef.innerHTML = countryMarkup;
//     clearCountryList();

//     const countryInfoListRef = document.querySelector('.country-info__list');
//     const titleRef = document.querySelector('.title');

//     titleRef.style.marginLeft = '35px';
//     countryInfoListRef.style.listStyleType = 'none';
//     countryInfoListRef.style.margin = '20px';
//   }
//   if (countries.length < 11 && countries.length > 1) {
//     const countriesListMarkup = countries
//       .flatMap(({ flags, name }) => {
//         return `<li class="list-item">
//         <img
//         src="${flags.svg}"
//         alt="${flags.alt}"
//         width="30" height="20" /> ${name.official}</li>`;
//       })
//       .join('');
//     countryListRef.innerHTML = countriesListMarkup;
//     clearCountryInfo();

//     const listItemRef = document.querySelectorAll('.list-item');
//     listItemRef.forEach(item => {
//       item.style.padding = '15px';
//     });
//   }
