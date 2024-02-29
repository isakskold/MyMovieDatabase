'use strict';

window.addEventListener('load', () => {
    console.log('load');
    //Förslagsvis anropar ni era funktioner som skall sätta lyssnare, rendera objekt osv. härifrån
    fetchAndSetupCarousel();
    setupHeaderEvents();
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

//Function that handles events in header section
function setupHeaderEvents() {
    const searchInput = document.getElementById('searchInput');
    let alertDisplayed = false; // Flag to track if alert is displayed

    searchInput.addEventListener('input', async function(event) {
        const searchInputValue = searchInput.value.trim(); // Get search input value
        
        if (searchInputValue.length >= 3) { // Check if input length is at least 3 characters
            const apiKey = '71dd8ef'; // Your OMDB API key
            const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(searchInputValue)}&apikey=${apiKey}`; // Construct API URL
            
            try {
                const response = await fetch(apiUrl); // Fetch movie data
                const data = await response.json(); // Parse JSON response
                
                if (data.Response === 'True') {
                    const searchResults = document.getElementById('searchResults');
                    searchResults.classList.remove('d-none'); // Remove d-none class to show section
                    displayMovies(data.Search, searchResults); // Call function to display movies
                } else {
                    if (!alertDisplayed) {
                        alertDisplayed = true; // Set flag to true
                        console.log(data.Error); // Log error message
                    }
                }
            } catch (error) {
                console.error('Error fetching movie data:', error);
                // No need to display alert for any other errors
            }
        } else {
            const searchResults = document.getElementById('searchResults');
            searchResults.classList.add('d-none'); // Hide search results if input length is less than 3
        }
    });

    document.getElementById('favBtn').addEventListener('click', function() {
        window.location.href = "favorites.html";
    });

    // Close search results when clicking outside
    document.body.addEventListener('click', function(event) {
        const searchResults = document.getElementById('searchResults');
        const searchForm = document.getElementById('searchForm');
        
        if (!searchResults.contains(event.target) && event.target !== searchInput && event.target !== searchForm) {
            searchResults.classList.add('d-none'); // Hide search results if clicked outside
        }
    });
}




function displayMovies(movieTitles, resultsContainer) {
    const resultList = resultsContainer.querySelector('.results__list');
    resultList.innerHTML = ''; // Clear previous search results

    movieTitles.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = movie.Title; // Display movie title
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
