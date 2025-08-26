// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do menu de hambúrguer para telas menores ---
    const menuToggle = document.getElementById('menuToggle');
    const genresMenu = document.getElementById('genresMenu');
    const exploreLink = document.querySelector('.explore-link');

    const toggleGenresMenu = () => {
        if (genresMenu) {
            genresMenu.classList.toggle('is-open');
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleGenresMenu);
    }
    
    if (exploreLink) {
        exploreLink.addEventListener('click', (event) => {
            if (window.innerWidth <= 767) {
                event.preventDefault();
                toggleGenresMenu();
            }
        });
    }

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = genresMenu && genresMenu.contains(event.target);
        const isClickOnToggle = menuToggle && menuToggle.contains(event.target);
        const isClickOnExploreLink = exploreLink && exploreLink.contains(event.target);

        if (genresMenu && genresMenu.classList.contains('is-open') && !isClickInsideMenu && !isClickOnToggle && !isClickOnExploreLink) {
            genresMenu.classList.remove('is-open');
        }
    });

    // --- Lógica do dropdown "Explorar" no cabeçalho (sem o botão principal) ---
    const exploreDropdownMenu = document.querySelector('.explore-dropdown-menu');
    const exploreMenuContainer = document.querySelector('.explore-menu-container');

    // Este listener global é o que fecha a aba ao clicar fora (apenas em desktop)
    document.addEventListener('click', (event) => {
        if (window.innerWidth > 767) {
            const isClickInsideMenu = exploreDropdownMenu && exploreDropdownMenu.contains(event.target);
            const isClickOnExploreLink = exploreLink && exploreLink.contains(event.target);
            const isMenuOpen = exploreDropdownMenu && exploreDropdownMenu.classList.contains('show');

            if (isMenuOpen && !isClickInsideMenu && !isClickOnExploreLink) {
                exploreDropdownMenu.classList.remove('show');
            }
        }
    });

    // --- Lógica da barra de pesquisa com o Backend (MongoDB) ---
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResultsContainer');

    const createResultItem = (book) => {
        return `
            <a href="../${book.page}" class="search-result-item">
                <img src="../${book.image}" alt="${book.title}" class="search-result-image">
                <div class="search-result-info">
                    <span class="search-result-title">${book.title}</span>
                    <span class="search-result-author">${book.author}</span>
                </div>
            </a>
        `;
    };

    const renderResults = (books) => {
        searchResultsContainer.innerHTML = '';
        if (books.length > 0) {
            const resultItems = books.map(createResultItem).join('');
            searchResultsContainer.innerHTML = resultItems;
            searchResultsContainer.style.display = 'block';
        } else {
            searchResultsContainer.innerHTML = '<span class="no-results">Nenhum livro encontrado.</span>';
            searchResultsContainer.style.display = 'block';
        }
    };

    const searchBooks = async (term) => {
        try {
            const response = await fetch(`http://localhost:3000/search-books?term=${encodeURIComponent(term)}`);
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor.');
            }
            const books = await response.json();
            renderResults(books);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            searchResultsContainer.innerHTML = '<p class="no-results">Não foi possível carregar os livros. Verifique se o servidor está rodando.</p>';
            searchResultsContainer.style.display = 'block';
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.trim();
            if (searchTerm.length > 0) {
                searchBooks(searchTerm);
            } else {
                searchResultsContainer.style.display = 'none';
            }
        });
    }

    document.addEventListener('click', (event) => {
        const isClickInsideSearch = searchInput && searchInput.parentElement.contains(event.target);
        const isClickInsideResults = searchResultsContainer && searchResultsContainer.contains(event.target);
        
        if (!isClickInsideSearch && !isClickInsideResults) {
            if (searchResultsContainer) {
                searchResultsContainer.style.display = 'none';
            }
        }
    });

    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    }
});