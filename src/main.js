import { genericSection, relatedMoviesContainer } from './nodes.js';
import APIKey from './secret-files.js';

let page = 1;
let maxPage;

// Data
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    "Content-Type": "application.json charset=utf-8"
  },
  params: {
    "api_key": APIKey,
    "language": navigator.language || "es-ES"
  },
});

function likedMovieList() {
  // variable "item" que sea igual a lo que estamos buscando
  // como todo dentro de localStorage es un "string", entonces parseamos lo que haya a un objeto
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;

  // preguntamos si "item" tiene cualquier cosa
  if(item) {
    // si tiene algo, ese algo lo añadimos a la variable "movies"
    movies = item;
  } else {
    // si no, entonces "movies" es igual a un objeto vacio
    movies = {};
  }
  
  // al final retornamos la variable "movies"
  return movies;
}

function likeMovie(movie) {
  // identificador de movie = movie.id
  const likedMovies = likedMovieList();

  // preguntar si la película está en localStorage
  if (likedMovies[movie.id]) {
    // si está dentro del localStorage, entonces la eliminamos
    likedMovies[movie.id] = undefined;
  } else {
    // si no, gregar la película a localStorage
    likedMovies[movie.id] = movie;
  }

  // actualizamos la información en el localStorage 
  // le decimos que queremos guardar el objeto en "liked_movies"
  // pero si queremos guardar un objeto en localStorage tiene que ser un string, entonces usamos "JSON.stringify()"
  localStorage.setItem('liked_movies',JSON.stringify(likedMovies));

  // Volvemos a llamar estas funciónes ára recargar el DOM
  getTrendingMoviesPreview()
  getLikedMovies()
}

// Utils
const lazyLoader = new IntersectionObserver((entries)=> {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const url = entry.target.getAttribute('data-img');
      entry.target.setAttribute('src',url);
    }
  })
});

function createMovies(movies, container, {lazyLoad = false, clean = true} = {}) {
  if (clean) {
    container.innerHTML = '';
  }

  movies.forEach(movie => {
  
    const movieContainer = document.createElement('div');
    const movieImg = document.createElement('img');
  
    movieContainer.classList.add('movie-container');
    movieImg.classList.add('movie-img');
    movieImg.addEventListener('click',()=>{
      location.hash = '#movie='+ movie.id;
    });

    movieImg.setAttribute('alt', movie.title)
    movieImg.setAttribute(
      lazyLoad?'data-img': 'src',
    'https://image.tmdb.org/t/p/w300' + movie.poster_path);
    movieImg.addEventListener('error',()=>{
      movieImg.setAttribute('src','https://media.istockphoto.com/vectors/error-page-or-file-not-found-icon-vector-id924949200?k=20&m=924949200&s=170667a&w=0&h=-g01ME1udkojlHCZeoa1UnMkWZZppdIFHEKk6wMvxrs=')
    });

    const movieButton = document.createElement('button');
    movieButton.classList.add('movie-btn');
    likedMovieList()[movie.id] && movieButton.classList.add('movie-btn--liked');
    movieButton.addEventListener('click', ()=> {
      movieButton.classList.toggle('movie-btn--liked');
      likeMovie(movie)
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieButton);
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

  createMovies(movies,trendingPreviewMovieList,{lazyLoad:true});
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
  maxPage = data.total_pages;

  createMovies(movies,genericSection,{lazyLoad:true});
}

async function getMoviesBySearch(query = '') {
  if(query === ''){
    return location.hash = '#home'
  }
  const {data} = await api('search/movie',{
    params: {
      query,
  }});

  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies,genericSection,{lazyLoad:true});
}

async function getTrendingMovies() {
  const {data} = await api('trending/movie/day');
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies,genericSection,{lazyLoad:true});
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
  headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 15%, rgba(0, 0, 0, 0) 29.17%), url(${movieURL})`;

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

function getLikedMovies() {
  const likedMovies = likedMovieList();
  const moviesArray = Object.values(likedMovies);
  const likedMovieListArticle = document.querySelector('.liked-movieList');

  if(moviesArray.length !== 0) {
    createMovies(moviesArray, likedMovieListArticle, {clean: true, lazyLoad: true});
  } else {
    const message = document.createElement('h3');
    message.innerText = 'Aún no has añadido ningúna película'
    likedMovieListArticle.innerHTML = '';
    likedMovieListArticle.appendChild(message);
  }
}

// Funciones de Infinite Scroll
function getPaginatedMoviesByCategory(id) {
  return async function () {
    const {scrollTop,scrollHeight,clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 25);
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
  
      const {data} = await api('discover/movie',{
        params: {
          page,
          "with_genres": id
        }
      });

    const movies = data.results;
    createMovies(movies, genericSection, {lazyLoad:true, clean:false});
  } 
  }
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const {scrollTop,scrollHeight,clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 20);
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
  
      const {data} = await api('search/movie',{
        params: {
          page,
          query
        }
      });

    const movies = data.results;
    createMovies(movies, genericSection, {lazyLoad:true, clean:false});
  } 
  }
}

async function getPaginatedTrendingMovies() {
  const {scrollTop,scrollHeight,clientHeight} = document.documentElement;
  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 20);
  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax) {
    page++;
  
    const {data} = await api('trending/movie/day',{
      params: {
        page,
      }
    });

    const movies = data.results;
    createMovies(movies, genericSection, {lazyLoad:true, clean:false});
  }
}

export {getCategoriesPreview ,getTrendingMoviesPreview, getMoviesByCategory, getMoviesBySearch,getTrendingMovies,getMovieById,getPaginatedTrendingMovies,getPaginatedMoviesBySearch,getPaginatedMoviesByCategory,getLikedMovies}