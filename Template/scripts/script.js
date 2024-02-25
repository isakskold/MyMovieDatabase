'use strict';

window.addEventListener('load', () => {
    console.log('load');
    //Förslagsvis anropar ni era funktioner som skall sätta lyssnare, rendera objekt osv. härifrån
    setupCarousel();
    setupHeaderEvents();
    setupPopularMovies();
});

//Denna funktion skapar funktionalitet för karusellen
function setupCarousel() {
    console.log('carousel');
    const buttons = document.querySelectorAll('[data-carousel-btn]');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const offset = btn.dataset.carouselBtn === 'next' ? 1 : -1;
            const slides = btn.closest('[data-carousel').querySelector('[data-slides');
            const activeSlide = slides.querySelector('[data-active]');
            let newIndex = [...slides.children].indexOf(activeSlide) + offset;
            
            if(newIndex < 0) {
                newIndex = slides.children.length - 1;
            } else if( newIndex >= slides.children.length) {
                newIndex = 0;
            }

            slides.children[newIndex].dataset.active = true;
            delete activeSlide.dataset.active;
        });
    });
}

//Function that handles events in header section
function setupHeaderEvents() {
    // Event listener for favBtn
    favBtn.addEventListener('click', () => {
        // Redirect to favorites.html when the button is clicked
        window.location.href = "favorites.html";
    });

    console.log("Header event handler set up");

    // Add event listeners for other header activities here
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

            // Append the movie card to the container
            popularMoviesContainer.appendChild(movieCard);
            console.log("Movies succesfully appended to the template");
        });
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}
