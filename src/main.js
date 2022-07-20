import { genericSection, relatedMoviesContainer } from './nodes.js';
import APIKey from './secret-files.js';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    "Content-Type": "application.json;charset=utf-8"
  },
  params: {
    "api_key": APIKey
  },
})

// Utils
function createMovies(movies, container) {
  container.innerHTML = '';
  movies.forEach(movie => {
  
    const movieContainer = document.createElement('div');
    const movieImg = document.createElement('img');
  
    movieContainer.classList.add('movie-container');
    movieImg.classList.add('movie-img');
    movieContainer.addEventListener('click',()=>{
      location.hash = '#movie='+ movie.id;
    });

    if (movie.poster_path !== null) {
      movieImg.setAttribute('alt', movie.title);
    }

    movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300' + movie.poster_path);

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = '';
  
  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    const categoryTitle = document.createElement('h3');
    const categoryTitleText = document.createTextNode(category.name);
    
    categoryTitle.classList.add('category-title');
    categoryContainer.classList.add('category-container');


    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click',()=>{
      location.hash = `#category=${category.id}-${category.name}`;
    });
    
    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// llamados a la API
async function getTrendingMoviesPreview() {
  const {data} = await api('trending/movie/day');

  const movies = data.results;
  const trendingPreviewMovieList = document.querySelector('.trendingPreview-movieList');

  createMovies(movies,trendingPreviewMovieList);
}

async function getCategoriesPreview() {
  const {data} = await api('genre/movie/list');

  const categories = data.genres;
  const categoriesPreviewList = document.querySelector('.categoriesPreview-list');

  createCategories(categories, categoriesPreviewList)
}

async function getMoviesByCategory(id) {
  const {data} = await api('discover/movie',{
    params: {
      "with_genres": id
  }});

  const movies = data.results;

  createMovies(movies,genericSection);
}

async function getMoviesBySearch(query = '') {
  if(query === ''){
    query = 'movie'  
  }
  const {data} = await api('search/movie',{
    params: {
      query,
  }});

  const movies = data.results;

  createMovies(movies,genericSection);
}

async function getTrendingMovies() {
  const {data} = await api('trending/movie/day');

  const movies = data.results;

  createMovies(movies,genericSection);
}

async function getMovieById(id) {
  const {data: movie} = await api('movie/' + id);

  const movieDetailTitle = document.querySelector('.movieDetail-title');
  const movieDetailDescription = document.querySelector('.movieDetail-description');
  const movieDetailScore = document.querySelector('.movieDetail-score');
  const movieDetailCategoriesList = document.querySelector('#movieDetail .categories-list');
  const headerSection = document.querySelector('#header');
  const movieURL = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;
  headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieURL})`;

  createCategories(movie.genres,movieDetailCategoriesList);
  getRelatedMoviesById(id)
}

async function getRelatedMoviesById(id) {
  const {data} = await api('movie/' + id + '/recommendations');
  const createdMovies = data.results;
  const relatedMoviesContainer = document.querySelector('.relatedMovies-scrollContainer');
  relatedMoviesContainer.innerHTML = '';

  createMovies(createdMovies,relatedMoviesContainer);
  relatedMoviesContainer.scrollTo(0, 0);
}

export {getCategoriesPreview ,getTrendingMoviesPreview, getMoviesByCategory, getMoviesBySearch,getTrendingMovies,getMovieById}