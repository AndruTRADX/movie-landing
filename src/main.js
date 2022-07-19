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

async function getTrendingMoviesPreview() {
  const {data} = await api('trending/movie/day');

  const movies = data.results;
  movies.forEach(movie => {
    const trendingPreviewMoviesContainer = document.querySelector('.trendingPreview-movieList');
    const movieContainer = document.createElement('div');
    const movieImg = document.createElement('img');
    
    movieContainer.classList.add('movie-container');
    movieImg.classList.add('movie-img');

    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300' + movie.poster_path);

    movieContainer.appendChild(movieImg);
    trendingPreviewMoviesContainer.appendChild(movieContainer)
  });
}

async function getCategoriesPreview() {
  const {data} = await api('genre/movie/list');

  const categories = data.genres;

  categories.forEach(category => {
    const categoriesContainer = document.querySelector('.categoriesPreview-list');
    const categoryContainer = document.createElement('div');
    const categoryTitle = document.createElement('h3');
    const categoryTitleText = document.createTextNode(category.name);
    
    categoryTitle.classList.add('category-title');
    categoryContainer.classList.add('category-container');


    categoryTitle.setAttribute('id', 'id' + category.id);
    
    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    categoriesContainer.appendChild(categoryContainer);
  });
}

getCategoriesPreview();
getTrendingMoviesPreview();