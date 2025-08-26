document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do menu de hambúrguer e dropdown ---
    // (Mantida a mesma, pois já está funcional)
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

    const exploreDropdownMenu = document.querySelector('.explore-dropdown-menu');
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

    // --- Lógica da barra de pesquisa com o Backend (AJUSTADA) ---
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResultsContainer');

    // Esta função cria o HTML de cada resultado de livro
    const createResultItem = (book) => {
        // Assegura que os caminhos das imagens e links estão corretos
        // com base no que você me enviou (e nas suas configurações do server.js)
        const imagePath = book.image ? `../${book.image}` : '';
        const pagePath = book.page ? `../${book.page}` : '#';

        return `
            <a href="${pagePath}" class="search-result-item">
                <img src="${imagePath}" alt="${book.title}" class="search-result-image">
                <div class="search-result-info">
                    <span class="search-result-title">${book.title}</span>
                    <span class="search-result-author">${book.author}</span>
                </div>
            </a>
        `;
    };

    // Esta função renderiza a lista de livros na tela
    const renderResults = (books) => {
        searchResultsContainer.innerHTML = ''; // Limpa os resultados anteriores
        if (books.length > 0) {
            const resultItems = books.map(createResultItem).join('');
            searchResultsContainer.innerHTML = resultItems;
            searchResultsContainer.style.display = 'block';
        } else {
            searchResultsContainer.innerHTML = '<span class="no-results">Nenhum livro encontrado.</span>';
            searchResultsContainer.style.display = 'block';
        }
    };

    // Esta função faz a requisição para a sua API de busca
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

    // Listener para o campo de input que dispara a busca
    if (searchInput) {
        let timeoutId;

        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.trim();

            clearTimeout(timeoutId);

            if (searchTerm.length > 0) {
                // Aguarda 300ms antes de fazer a requisição para não sobrecarregar
                timeoutId = setTimeout(() => {
                    searchBooks(searchTerm);
                }, 300);
            } else {
                searchResultsContainer.style.display = 'none';
                searchResultsContainer.innerHTML = '';
            }
        });
    }

    // Listener para fechar os resultados ao clicar fora
    document.addEventListener('click', (event) => {
        const isClickInsideSearch = searchInput && searchInput.parentElement.contains(event.target);
        const isClickInsideResults = searchResultsContainer && searchResultsContainer.contains(event.target);
        
        if (!isClickInsideSearch && !isClickInsideResults) {
            if (searchResultsContainer) {
                searchResultsContainer.style.display = 'none';
                searchResultsContainer.innerHTML = '';
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