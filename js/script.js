// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Always ensure page loads at the top
    window.scrollTo(0, 0);
    
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm.length < 2) {
                alert('Please enter at least 2 characters to search.');
                return;
            }
            
            // In a real implementation, you would:
            // 1. Fetch results from your game database
            // 2. Redirect to a search results page
            
            // For demo purposes, we'll just redirect to a placeholder
            window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
        });
    }

    // Initialize sticky header behavior
    initStickyHeader();

    // Initialize game card hover effects
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.play-button').style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.play-button').style.opacity = '0';
        });
    });
    
    // Mobile navigation toggle (if implemented)
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Make header navigation links scroll to top when on same page
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if link points to current page
            const href = this.getAttribute('href');
            const currentPath = window.location.pathname.split('/').pop();
            
            // If this link contains the current page (with or without the hash)
            const hrefPath = href.split('#')[0];
            const isCurrentPage = (currentPath === hrefPath || 
                                 (hrefPath === 'index.html' && (currentPath === '' || currentPath === '/')));
            
            if (isCurrentPage) {
                // If we're already on that page, scroll to top
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Home button in logo should also scroll to top when on home page
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const currentPath = window.location.pathname.split('/').pop();
            
            // Check if this is the home page
            if (currentPath === '' || currentPath === '/' || currentPath === 'index.html') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Check for hash in URL on page load to handle direct navigation to #top
    if (window.location.hash === '#top') {
        setTimeout(function() {
            window.scrollTo({
                top: 0,
                behavior: 'auto'
            });
        }, 10);
    }

    // Banner "Play Now" button should scroll to featured games section
    const playNowBtn = document.querySelector('.banner-content .btn');
    if (playNowBtn) {
        playNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const featuredGamesSection = document.getElementById('featured-games');
            if (featuredGamesSection) {
                featuredGamesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // 确保分页功能在DOM加载完成后初始化
    initPagination();
    
    // 初始化首页游戏筛选
    initGameFilters();
    
    // 初始化文章页筛选
    initArticleFilters();
    
    // 初始化游戏类型页面排序
    initGameSorting();
});

// Initialize sticky header with scroll detection
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollTop = 0;
    let scrollThreshold = 100; // Only start showing/hiding after scrolling this amount
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // If we're at the very top of the page, always show header
        if (scrollTop === 0) {
            header.classList.remove('hide');
            return;
        }
        
        // Once we've scrolled past the threshold
        if (scrollTop > scrollThreshold) {
            // Scrolling down - hide header
            if (scrollTop > lastScrollTop) {
                header.classList.add('hide');
            } 
            // Scrolling up - show header
            else {
                header.classList.remove('hide');
            }
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true }); // optimize performance
}

// Game statistics (for a real site, this would be server-side)
const gameStats = {
    trackGamePlay: function(gameId) {
        // Simulating tracking game play - in a real implementation,
        // this would send data to your analytics system
        console.log(`Game played: ${gameId}`);
        
        // For demo, we'll just use localStorage
        const plays = localStorage.getItem('gamePlays') ? 
            JSON.parse(localStorage.getItem('gamePlays')) : {};
        
        plays[gameId] = (plays[gameId] || 0) + 1;
        localStorage.setItem('gamePlays', JSON.stringify(plays));
    }
};

// Function to detect and handle browser/device compatibility
function checkCompatibility() {
    // Basic device/browser detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Apply class to body based on device type
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-ios', isIOS);
    
    // Check for WebGL support (important for some games)
    let webglSupported = false;
    try {
        const canvas = document.createElement('canvas');
        webglSupported = !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) {
        webglSupported = false;
    }
    
    document.body.classList.toggle('webgl-supported', webglSupported);
    
    return {
        isMobile,
        isIOS,
        webglSupported
    };
}

// Run compatibility check when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const compatibility = checkCompatibility();
    
    // Show warning for devices that might have issues
    if (!compatibility.webglSupported) {
        console.warn('WebGL not supported - some games may not work correctly');
    }
});

// 全局变量来跟踪当前筛选器
let currentFilter = 'all';

// 分页功能
function initPagination() {
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer) return;
    
    const pageBtns = document.querySelectorAll('.pagination-btn, .pagination-button');
    const nextBtn = document.querySelector('.pagination-next-btn');
    
    // 绑定页码按钮点击事件
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pageNum = parseInt(this.getAttribute('data-page'));
            changePage(pageNum, true); // Pass true to enable scrolling
            
            // 更新按钮激活状态
            pageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 绑定"下一页"按钮点击事件
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // 找到当前激活的页码按钮
            const activeBtn = document.querySelector('.pagination-btn.active, .pagination-button.active');
            if (!activeBtn) return;
            
            const currentPage = parseInt(activeBtn.getAttribute('data-page'));
            const allBtns = Array.from(document.querySelectorAll('.pagination-btn[data-page], .pagination-button[data-page]'));
            
            // 找出可见按钮中的最大页码
            const visibleBtns = allBtns.filter(btn => btn.style.display !== 'none');
            const maxPage = Math.max(...visibleBtns.map(btn => parseInt(btn.getAttribute('data-page'))));
            
            if (currentPage < maxPage) {
                const nextPage = currentPage + 1;
                changePage(nextPage, true); // Pass true to enable scrolling
                
                // 更新按钮激活状态
                allBtns.forEach(b => {
                    if (parseInt(b.getAttribute('data-page')) === nextPage) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
            }
        });
    }
    
    // 初始化时只设置第一页内容为可见，不滚动位置
    changePage(1, false);
}

// 切换页面
function changePage(pageNum, shouldScroll) {
    console.log('Changing to page:', pageNum);
    
    // 处理游戏列表分页 - 只选择 #all-games 下的游戏卡片
    const gameItems = document.querySelectorAll('#all-games .games-grid .game-card[data-page], #all-games .all-games-list .game-card[data-page], #all-games .games-list .game-card[data-page]');
    if (gameItems.length > 0) {
        console.log('Found game items:', gameItems.length);
        gameItems.forEach(item => {
            const itemPage = parseInt(item.getAttribute('data-page'));
            const itemCategory = item.getAttribute('data-category');
            
            // 仅显示当前页面且匹配当前筛选类别的项目
            if (itemPage === pageNum && (currentFilter === 'all' || itemCategory === currentFilter)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 处理文章列表分页
    const articleItems = document.querySelectorAll('.articles-grid .article-card[data-page]');
    if (articleItems.length > 0) {
        console.log('Found article items:', articleItems.length);
        articleItems.forEach(item => {
            const itemPage = parseInt(item.getAttribute('data-page'));
            if (itemPage === pageNum) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 只有当shouldScroll为true时才滚动到内容区域
    if (shouldScroll) {
        // 滚动到相关内容区域顶部，精确定位
        const scrollTarget = document.querySelector('#all-games') || 
                            document.querySelector('.articles-content') || 
                            document.querySelector('.all-category-games') ||
                            document.querySelector('.articles-grid');
                            
        if (scrollTarget) {
            // 计算要滚动的准确位置（目标元素顶部的位置减去一点偏移量）
            const targetPosition = scrollTarget.getBoundingClientRect().top + window.pageYOffset - 20;
            
            // 平滑滚动到指定位置
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// 游戏筛选功能
function initGameFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    
    if (filterBtns.length === 0) {
        console.log('No filter buttons found');
        return;
    }
    
    console.log('Initializing game filters, found buttons:', filterBtns.length);
    
    // 初始化时获取所有页面
    const allPages = new Set();
    document.querySelectorAll('.game-card[data-page]').forEach(card => {
        allPages.add(parseInt(card.getAttribute('data-page')));
    });
    
    // 初始状态下更新分页按钮
    updatePaginationButtons(allPages);
    
    // 绑定筛选按钮点击事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            console.log('Filter button clicked:', filter);
            
            // 更新按钮激活状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选游戏
            filterGames(filter);
        });
    });
}

// 筛选游戏
function filterGames(category) {
    console.log('Filtering games by category:', category);
    
    // 设置当前筛选类别
    currentFilter = category;
    
    // 只查找 #all-games 下的游戏卡片
    const gameItems = document.querySelectorAll('#all-games .games-list .game-card, #all-games .games-grid .game-card');
    
    if (gameItems.length === 0) {
        console.log('No game items found');
        return;
    }
    
    // 记录筛选后视图中存在的页面
    const availablePages = new Set();
    
    // 应用筛选
    gameItems.forEach(item => {
        // 获取游戏卡片的页数和类别
        const itemPage = parseInt(item.getAttribute('data-page') || '1');
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            // 如果是第一页或当前选中页面的内容，则显示；否则保持隐藏状态
            const currentPage = parseInt(document.querySelector('.pagination-btn.active, .pagination-button.active')?.getAttribute('data-page') || '1');
            
            if (itemPage === currentPage) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
            
            // 记录此分类下存在的页面
            availablePages.add(itemPage);
        } else {
            // 不匹配的类别隐藏
            item.style.display = 'none';
        }
    });
    
    console.log('Available pages after filtering:', Array.from(availablePages));
    
    // 更新分页按钮状态
    updatePaginationButtons(availablePages);
    
    // 重置到第一页，但不滚动页面
    resetPaginationWithoutScroll();
}

// 重置分页到第一页，但不滚动页面
function resetPaginationWithoutScroll() {
    const pageBtns = document.querySelectorAll('.pagination-btn, .pagination-button');
    
    if (pageBtns.length === 0) return;
    
    // 找到第一个分页按钮并标记为激活
    const firstPageBtn = document.querySelector('.pagination-btn[data-page="1"], .pagination-button[data-page="1"]');
    if (firstPageBtn) {
        pageBtns.forEach(b => b.classList.remove('active'));
        firstPageBtn.classList.add('active');
        // 不滚动页面，只改变内容显示
        changePage(1, false);
    }
}

// 更新分页按钮状态
function updatePaginationButtons(availablePages) {
    const pageBtns = document.querySelectorAll('.pagination-btn, .pagination-button');
    
    if (pageBtns.length === 0) return;
    
    // 更新每个分页按钮的可见性
    pageBtns.forEach(btn => {
        const pageNum = parseInt(btn.getAttribute('data-page'));
        
        if (availablePages.has(pageNum)) {
            btn.style.display = '';
        } else {
            btn.style.display = 'none';
        }
    });
    
    // 隐藏下一页按钮，如果只有一页或没有页面
    const nextBtn = document.querySelector('.pagination-next-btn');
    if (nextBtn) {
        if (availablePages.size <= 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = '';
        }
    }
    
    // 如果当前没有页面或只有一页，隐藏整个分页控件
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        if (availablePages.size <= 1) {
            pagination.style.display = 'none';
        } else {
            pagination.style.display = 'flex';
        }
    }
}

// 文章筛选功能
function initArticleFilters() {
    const filterButtons = document.querySelectorAll('.filter-button[data-filter]');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新按钮激活状态
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选文章
            filterArticles(filter);
            
            // 重置分页到第一页
            resetPagination();
        });
    });
    
    // 文章搜索功能
    const searchInput = document.getElementById('article-search');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            searchArticles(searchInput.value.trim().toLowerCase());
            resetPagination();
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchArticles(this.value.trim().toLowerCase());
                resetPagination();
            }
        });
    }
}

// 筛选文章
function filterArticles(category) {
    const articleItems = document.querySelectorAll('.articles-grid .article-card[data-category]');
    
    if (articleItems.length === 0) return;
    
    articleItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 搜索文章
function searchArticles(query) {
    const articleItems = document.querySelectorAll('.articles-grid .article-card');
    
    if (articleItems.length === 0 || !query) {
        // 如果没有查询或没有文章，则显示所有文章
        articleItems.forEach(item => {
            item.style.display = '';
        });
        return;
    }
    
    articleItems.forEach(item => {
        const title = item.querySelector('.article-title').textContent.toLowerCase();
        const description = item.querySelector('.article-description').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 游戏类型页面排序功能
function initGameSorting() {
    const sortSelect = document.getElementById('games-sort');
    
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        
        // 根据选择的方式排序游戏
        sortGames(sortValue);
        
        // 重置分页到第一页
        resetPagination();
    });
}

// 游戏排序
function sortGames(sortBy) {
    const gamesContainer = document.querySelector('.all-games-list');
    const gameItems = document.querySelectorAll('.all-games-list .game-card');
    
    if (!gamesContainer || gameItems.length === 0) return;
    
    // 将节点列表转换为数组以便排序
    const gameItemsArray = Array.from(gameItems);
    
    switch (sortBy) {
        case 'popular':
            // 按游玩次数排序（从高到低）
            gameItemsArray.sort((a, b) => {
                const playsA = parseInt(a.querySelector('.plays').textContent.replace(/[^0-9]/g, ''));
                const playsB = parseInt(b.querySelector('.plays').textContent.replace(/[^0-9]/g, ''));
                return playsB - playsA;
            });
            break;
        
        case 'newest':
            // 模拟按发布日期排序，这里我们只是使用DOM顺序的反向
            gameItemsArray.reverse();
            break;
            
        case 'oldest':
            // 模拟按发布日期排序，这里我们使用DOM顺序
            break;
            
        case 'rated':
            // 按评分排序（从高到低）
            gameItemsArray.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector('.rating').textContent.replace(/[^0-9.]/g, ''));
                const ratingB = parseFloat(b.querySelector('.rating').textContent.replace(/[^0-9.]/g, ''));
                return ratingB - ratingA;
            });
            break;
    }
    
    // 重新插入排序后的游戏卡片
    gameItemsArray.forEach(item => {
        gamesContainer.appendChild(item);
    });
}

// 重置分页到第一页
function resetPagination() {
    const pageBtns = document.querySelectorAll('.pagination-btn, .pagination-button');
    
    if (pageBtns.length === 0) return;
    
    // 找到第一个分页按钮并标记为激活
    const firstPageBtn = document.querySelector('.pagination-btn[data-page="1"], .pagination-button[data-page="1"]');
    if (firstPageBtn) {
        pageBtns.forEach(b => b.classList.remove('active'));
        firstPageBtn.classList.add('active');
        // 不滚动页面，只改变内容显示
        changePage(1, false);
    }
} 