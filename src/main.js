import APIKey from './secret-files.js'

async function getTrendingMoviesPreview() {
  const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + APIKey);
  const data = await res.json();
  console.log(data.results)

  const movies = data.results;
  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300' + movie.poster_path);

    movieContainer.appendChild(movieImg);
    const trendingPreviewMoviesContainer = document.querySelector('.trendingPreview-movieList');
    trendingPreviewMoviesContainer.appendChild(movieContainer)
  });
}

getTrendingMoviesPreview()