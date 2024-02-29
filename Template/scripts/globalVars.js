'use strict';

const globalVars = {
    searchInput: document.getElementById("searchInput"),
    searchBtn: document.getElementById("searchBtn"),
    favBtn: document.getElementById("favBtn"),
    apiKey: '71dd8ef',
    
    apiUrl: async function(searchInputValue) {
        return `https://www.omdbapi.com/?s=${encodeURIComponent(searchInputValue)}&apikey=${this.apiKey}`;
    },

    setupHeaderEvents: function(){
        //Search form
        const searchInput = document.getElementById('searchInput');
        let alertDisplayed = false; // Flag to track if alert is displayed

        searchInput.addEventListener('input', async function(event) {
            const searchInputValue = searchInput.value.trim(); // Get search input value
            
            if (searchInputValue.length >= 3) { // Check if input length is at least 3 characters
                
                try {
                    
                    const apiUrl = await globalVars.apiUrl(searchInputValue); // Fetch API URL
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

        //Favorites button
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
}