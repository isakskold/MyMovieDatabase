'use strict'

window.addEventListener('load', () => {
    console.log('load');
    // Call function to set up header events
    globalVars.setupHeaderEvents();

    // Call function to populate movie details based on IMDb ID from URL
    populateMovieDetailsFromURL();
});

async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=71dd8ef&i=${imdbID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

async function populateMovieDetails(imdbID) {
    const movieDetailsElement = document.getElementById('movieDetails');

    try {
        const data = await fetchMovieDetails(imdbID);
        if (data) {
            const directorElement = document.querySelector('.movie-details__director');
            const genreElement = document.querySelector('.movie-details__genre');
            const releasedElement = document.querySelector('.movie-details__released');
            const runtimeElement = document.querySelector('.movie-details__runtime');
            const ratingElement = document.querySelector('.movie-details__rating');
            const imageElement = document.querySelector('.movie-details__image img');
            const descriptionElement = document.querySelector('.movie-details__description');

            directorElement.textContent = data.Director;
            genreElement.textContent = data.Genre;
            releasedElement.textContent = data.Released;
            runtimeElement.textContent = data.Runtime;
            ratingElement.textContent = data.imdbRating;
            imageElement.src = data.Poster;
            descriptionElement.textContent = data.Plot;
        } else {
            movieDetailsElement.textContent = 'Movie details not available';
        }
    } catch (error) {
        console.error('Error populating movie details:', error);
        movieDetailsElement.textContent = 'Error fetching movie details';
    }
}


function populateMovieDetailsFromURL() {
    // Extract IMDb ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('imdbID');

    // Call populateMovieDetails function with IMDb ID
    if (imdbID) {
        populateMovieDetails(imdbID);
    } else {
        console.error('IMDb ID not found in URL');
    }
}