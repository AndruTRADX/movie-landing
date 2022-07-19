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
  
  location.hash
}

function homePage() {
  console.log('home pa')
}

function categoriesPage() {
  console.log('tamo en las categorias');
}

function moviesPage() {
  console.log('Detalles de una peli');
}

function searchMoviePage() {
  console.log('tamo en le sitio de busquedas');
}

function trendsPage() {
  console.log('estamos en trends');
}

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);