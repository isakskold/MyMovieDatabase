'use strict';

window.addEventListener('load', () => {
    console.log('load');
    //Förslagsvis anropar ni era funktioner som skall sätta lyssnare, rendera objekt osv. härifrån
    fetchAndSetupCarousel();
    globalVars.setupHeaderEvents();
    setupPopularMovies();
});

// Function to fetch trailers data and set up carousel
async function fetchAndSetupCarousel() {
    try {
        const response = await fetch('https://santosnr6.github.io/Data/movies.json');
        if (!response.ok) {
            throw new Error('Failed to fetch movie data');
        }
        const data = await response.json();
        const trailers = getRandomTrailers(data, 5); // Get 5 random trailers

        const carousel = document.querySelector('[data-carousel]');
        const slides = carousel.querySelector('[data-slides]');

        // Remove existing trailer slides
        slides.innerHTML = '';

        // Create and append new trailer slides
        trailers.forEach((trailer, index) => {
            const slide = document.createElement('li');
            slide.classList.add('carousel__slide');
            if (index === 0) {
                slide.dataset.active = true; // Set the first slide as active initially
            }
            const iframe = document.createElement('iframe');
            iframe.src = trailer.trailer_link; // Using trailer_link key to access YouTube trailer link
            iframe.width = '420';
            iframe.height = '315';
            iframe.frameBorder = '0';
            slide.appendChild(iframe);
            slides.appendChild(slide);
        });

        // Call function to add functionality to carousel buttons
        addCarouselFunctionality(carousel);
    } catch (error) {
        console.error('Error fetching and setting up carousel:', error);
    }
}

// Function to get random trailers from data
function getRandomTrailers(data, numTrailers) {
    const trailers = [];
    const numMovies = data.length;
    const indices = new Set();

    // Generate unique random indices
    while (indices.size < numTrailers) {
        const index = Math.floor(Math.random() * numMovies);
        indices.add(index);
    }

    // Get trailers corresponding to random indices
    indices.forEach(index => {
        trailers.push(data[index]);
    });

    return trailers;
}

// Function to add functionality to carousel buttons
function addCarouselFunctionality(carousel) {
    const buttons = carousel.querySelectorAll('[data-carousel-btn]');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const offset = btn.dataset.carouselBtn === 'next' ? 1 : -1;
            const slides = carousel.querySelector('[data-slides]');
            const activeSlide = slides.querySelector('[data-active]');
            let newIndex = [...slides.children].indexOf(activeSlide) + offset;

            if (newIndex < 0) {
                newIndex = slides.children.length - 1;
            } else if (newIndex >= slides.children.length) {
                newIndex = 0;
            }

            // Remove data-active attribute from all slides
            slides.querySelectorAll('.carousel__slide').forEach(slide => {
                delete slide.dataset.active;
            });

            // Set data-active attribute on the new active slide
            slides.children[newIndex].dataset.active = true;
        });
    });
}


function displayMovies(movieTitles, resultsContainer) {
    const resultList = resultsContainer.querySelector('.results__list');
    resultList.innerHTML = ''; // Clear previous search results

    movieTitles.forEach(movie => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.textContent = movie.Title; // Display movie title
        link.href = `movie.html?imdbID=${movie.imdbID}`; // Set href attribute with IMDb ID as query parameter

        // Apply custom CSS to remove default link styles
        link.style.color = 'inherit'; // Inherit color from parent element
        link.style.textDecoration = 'none'; // Remove underline

        link.addEventListener('click', function(event) {
            // Prevent default action of link click to avoid immediate redirection
            event.preventDefault();
            
            // Redirect to movie.html with IMDb ID as query parameter
            window.location.href = link.href;
        });

        listItem.appendChild(link); // Display movie title
        resultList.appendChild(listItem);
    });
}

//Function that fetches data about movies, then creates a card for each based on the template card created in the html
async function setupPopularMovies() {
    try {
        // Fetch movie data from the provided URL
        const response = await fetch('https://santosnr6.github.io/Data/movies.json');
        const data = await response.json();

        const popularMoviesContainer = document.getElementById('popularCardContainer');
        const movieCardTemplate = document.getElementById('movie-card-template');

        // Iterate over the fetched movie data and create movie cards
        data.forEach(movie => {
            // Clone the movie card template
            const movieCard = document.importNode(movieCardTemplate.content, true);

            // Populate the movie card with data
            const image = movieCard.querySelector('.movie-card__image');
            const title = movieCard.querySelector('.movie-card__title');

            image.src = movie.poster;
            title.textContent = movie.title;

            // Add event listener to the image
            image.addEventListener('click', () => {
                // Redirect to another page with more specified info about the chosen movie
                window.location.href = 'movie.html?movieId=' + movie.id;
            });

            // Append the movie card to the container
            popularMoviesContainer.appendChild(movieCard);
            console.log("Movies succesfully appended to the template");
        });
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}
