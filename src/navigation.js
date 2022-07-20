import {headerSection,trendingPreviewSection,categoriesPreviewSection,genericSection,movieDetailSection,searchForm,
  trendingMoviesPreviewList,categoriesPreviewList,movieDetailCategoriesList,relatedMoviesContainer,headerTitle,arrowBtn,
  headerCategoryTitle,searchFormInput,searchFormBtn,trendingBtn,movieDetailTitle,movieDetailDescription,movieDetailScore
} from "./nodes.js";

import {getCategoriesPreview,getTrendingMoviesPreview,getMoviesByCategory,getMoviesBySearch,getTrendingMovies,getMovieById} from "./main.js";

import APIKey from './secret-files.js'

// Escuchas de eventos
searchFormBtn.addEventListener('click', ()=> {
  location.hash = '#search='+searchFormInput.value;
});

trendingBtn.addEventListener('click',()=> {
  location.hash = '#trends=';
});

arrowBtn.addEventListener('click',()=>{
  history.back();
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

// función principal
function navigator(){
  if(location.hash.startsWith('#trends')) {
    trendsPage()
  } else if(location.hash.startsWith('#search=')){
    searchMoviePage()
  } else if(location.hash.startsWith('#movie=')){
    moviesPage()
  } else if(location.hash.startsWith('#category=')){
    categoriesPage()
  } else {
    homePage()
  }
  window.scrollTo(0,0);
}

// funciones individuales
function homePage() {
  console.log('Home!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');
  
  getTrendingMoviesPreview();
  getCategoriesPreview();
}

function categoriesPage() {
  console.log('categories!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split('-');

  headerCategoryTitle.innerHTML = categoryName.replaceAll('%20',' ')

  getMoviesByCategory(categoryId);
}

function moviesPage() {
  console.log('Movie!!');

  headerSection.classList.add('header-container--long');
  // headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');

  const [_, movieId] = location.hash.split('=');
  getMovieById(movieId);
}

function searchMoviePage() {
  console.log('Search!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, query] = location.hash.split('=');
  getMoviesBySearch(query);
}

function trendsPage() {
  console.log('TRENDS!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  getTrendingMovies();
  headerCategoryTitle.innerHTML = 'Tendencias'
}