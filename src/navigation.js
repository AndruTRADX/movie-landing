import {headerSection,trendingPreviewSection,categoriesPreviewSection,genericSection,movieDetailSection,searchForm,
  trendingMoviesPreviewList,categoriesPreviewList,movieDetailCategoriesList,relatedMoviesContainer,headerTitle,arrowBtn,
  headerCategoryTitle,searchFormInput,searchFormBtn,trendingBtn,movieDetailTitle,movieDetailDescription,movieDetailScore
} from "./nodes.js";

import {getCategoriesPreview,getTrendingMoviesPreview,getMoviesByCategory,getMoviesBySearch,getTrendingMovies,getMovieById,getPaginatedTrendingMovies,getPaginatedMoviesBySearch,getPaginatedMoviesByCategory,getLikedMovies} from "./main.js";

let infiniteScroll;

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

const likedMovieListArticle = document.querySelector('.liked-container');

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('touchmove', infiniteScroll, false);
// window.addEventListener('scroll', infiniteScroll, false);

// función principal
function navigator() {

  if (infiniteScroll) {
    // window.removeEventListener('scroll', infiniteScroll, {passive:false});
    window.removeEventListener('touchmove', infiniteScroll, {passive:false});
    infiniteScroll = undefined;
  }

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

  if (infiniteScroll) {
    // window.addEventListener('scroll', infiniteScroll, {passive:false});
    window.addEventListener('touchmove', infiniteScroll, {passive:false});
  }
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
  likedMovieListArticle.classList.remove('inactive');
  
  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
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
  likedMovieListArticle.classList.add('inactive');

  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split('-');

  headerCategoryTitle.innerHTML = categoryName
  .replaceAll('%20',' ').replaceAll('%C3%B3','ó').replaceAll('%C3%BA','ú').replaceAll('%C3%AD','í').replaceAll('%C3%A9','é');

  getMoviesByCategory(categoryId);
  infiniteScroll = getPaginatedMoviesByCategory(categoryId);
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
  likedMovieListArticle.classList.add('inactive');

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
  likedMovieListArticle.classList.add('inactive');

  const [_, query] = location.hash.split('=');
  getMoviesBySearch(query);

  infiniteScroll = getPaginatedMoviesBySearch(query);
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
  likedMovieListArticle.classList.add('inactive');

  getTrendingMovies();
  headerCategoryTitle.innerHTML = 'Tendencias'

  infiniteScroll = getPaginatedTrendingMovies;
}