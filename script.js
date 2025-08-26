// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do menu "Explorar" para telas menores ---
    const menuToggle = document.getElementById('menuToggle');
    const genresMenu = document.getElementById('genresMenu');

    if (menuToggle && genresMenu) {
        menuToggle.addEventListener('click', () => {
            genresMenu.classList.toggle('is-open');
        });

        document.addEventListener('click', (event) => {
            const isClickInsideMenu = genresMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (genresMenu.classList.contains('is-open') && !isClickInsideMenu && !isClickOnToggle) {
                genresMenu.classList.remove('is-open');
            }
        });
    }

    // --- Lógica do botão "Explore o site" para abrir o menu "Explorar" ---
    const exploreSiteButton = document.querySelector('.buy-button');
    const exploreDropdownMenu = document.querySelector('.explore-dropdown-menu');
    const exploreMenuContainer = document.querySelector('.explore-menu-container');

    if (exploreSiteButton && exploreDropdownMenu && exploreMenuContainer) {
        exploreSiteButton.addEventListener('click', (event) => {
            // Previne a navegação, se o botão estiver dentro de um formulário ou link
            event.preventDefault();

            // Adiciona a classe 'show' para exibir o menu
            exploreDropdownMenu.classList.add('show');

            // Adiciona um listener temporário para fechar o menu ao clicar fora
            const closeMenuOnClickOutside = (e) => {
                if (!exploreMenuContainer.contains(e.target) && e.target !== exploreSiteButton) {
                    exploreDropdownMenu.classList.remove('show');
                    // Remove o próprio listener para evitar múltiplos
                    document.removeEventListener('click', closeMenuOnClickOutside);
                }
            };
            document.addEventListener('click', closeMenuOnClickOutside);
        });
    }

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

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.trim();
        if (searchTerm.length > 0) {
            searchBooks(searchTerm);
        } else {
            searchResultsContainer.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        const isClickInsideSearch = searchInput.parentElement.contains(event.target);
        const isClickInsideResults = searchResultsContainer.contains(event.target);
        
        if (!isClickInsideSearch && !isClickInsideResults) {
            searchResultsContainer.style.display = 'none';
        }
    });

    document.querySelector('.search-form').addEventListener('submit', (event) => {
        event.preventDefault();
    });
});