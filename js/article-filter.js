document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const filterButtons = document.querySelectorAll('.filter-button');
    const articleCards = document.querySelectorAll('.article-card');
    const paginationContainer = document.querySelector('.pagination');
    const paginationButtons = document.querySelectorAll('.pagination-button');
    const articlesPerPage = 6; // Number of articles to show per page
    
    // Check if URL has a filter parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get('filter');
    
    // Initialize variables
    let currentFilter = urlFilter || 'all';
    let currentPage = 1;
    let filteredArticles = [];
    
    // Function to filter articles
    function filterArticles(filter) {
        articleCards.forEach(card => {
            // Reset display
            card.style.display = 'none';
            
            // Get category from the card
            const category = card.getAttribute('data-category').toLowerCase();
            
            // Check if card should be shown based on current filter
            if (filter === 'all' || category === filter) {
                // Add to filtered articles array
                filteredArticles.push(card);
            }
        });
        
        // Update pagination
        updatePagination();
        
        // Show articles for current page
        showArticlesForPage(currentPage);
        
        // Update active filter button
        updateActiveFilterButton(filter);
    }
    
    // Function to update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        
        // Clear pagination container
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
            
            // Create pagination buttons
            if (totalPages > 1) {
                // Previous button
                const prevButton = document.createElement('button');
                prevButton.classList.add('pagination-button', 'prev-button');
                prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
                prevButton.disabled = currentPage === 1;
                prevButton.addEventListener('click', function() {
                    if (currentPage > 1) {
                        currentPage--;
                        showArticlesForPage(currentPage);
                        updatePaginationButtons();
                    }
                });
                paginationContainer.appendChild(prevButton);
                
                // Page buttons
                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.classList.add('pagination-button');
                    if (i === currentPage) {
                        pageButton.classList.add('active');
                    }
                    pageButton.textContent = i;
                    pageButton.addEventListener('click', function() {
                        currentPage = i;
                        showArticlesForPage(currentPage);
                        updatePaginationButtons();
                    });
                    paginationContainer.appendChild(pageButton);
                }
                
                // Next button
                const nextButton = document.createElement('button');
                nextButton.classList.add('pagination-button', 'next-button');
                nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
                nextButton.disabled = currentPage === totalPages;
                nextButton.addEventListener('click', function() {
                    if (currentPage < totalPages) {
                        currentPage++;
                        showArticlesForPage(currentPage);
                        updatePaginationButtons();
                    }
                });
                paginationContainer.appendChild(nextButton);
            }
        }
    }
    
    // Function to update pagination buttons
    function updatePaginationButtons() {
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        const paginationButtons = document.querySelectorAll('.pagination-button');
        
        paginationButtons.forEach((button, index) => {
            // Skip first (prev) and last (next) buttons
            if (index === 0) {
                button.disabled = currentPage === 1;
            } else if (index === paginationButtons.length - 1) {
                button.disabled = currentPage === totalPages;
            } else {
                const pageNum = index;
                button.classList.toggle('active', pageNum === currentPage);
            }
        });
    }
    
    // Function to show articles for the current page
    function showArticlesForPage(page) {
        // Calculate start and end indices
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        
        // Hide all articles
        articleCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show only articles for current page
        for (let i = startIndex; i < endIndex && i < filteredArticles.length; i++) {
            filteredArticles[i].style.display = 'block';
        }
        
        // Scroll to top of articles section
        document.querySelector('.articles-grid').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Function to update active filter button
    function updateActiveFilterButton(filter) {
        filterButtons.forEach(button => {
            const buttonFilter = button.getAttribute('data-filter');
            button.classList.toggle('active', buttonFilter === filter);
        });
    }
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            currentPage = 1;
            filteredArticles = [];
            
            // Update URL with filter parameter without reloading the page
            const url = new URL(window.location);
            if (filter === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filter);
            }
            window.history.pushState({}, '', url);
            
            filterArticles(filter);
        });
    });
    
    // Initialize with the current filter
    filteredArticles = [];
    filterArticles(currentFilter);
    
    // Search functionality
    const searchInput = document.getElementById('article-search');
    const searchButton = document.getElementById('search-button');
    
    function searchArticles() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        currentPage = 1;
        filteredArticles = [];
        
        articleCards.forEach(card => {
            // Reset display
            card.style.display = 'none';
            
            // Get category from the card
            const category = card.getAttribute('data-category').toLowerCase();
            const title = card.querySelector('.article-title').textContent.toLowerCase();
            const description = card.querySelector('.article-description').textContent.toLowerCase();
            
            // Check if card should be shown based on search term and current filter
            if ((searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm)) && 
                (currentFilter === 'all' || category === currentFilter)) {
                // Add to filtered articles array
                filteredArticles.push(card);
            }
        });
        
        // Update pagination
        updatePagination();
        
        // Show articles for current page
        showArticlesForPage(currentPage);
    }
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', searchArticles);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchArticles();
            }
        });
    }
}); 