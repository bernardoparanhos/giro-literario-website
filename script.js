// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do menu "Explorar" ---
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

    // --- Lógica da barra de pesquisa com o Backend (MongoDB) ---
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResultsContainer'); // Novo ID para o contêiner de resultados

    /**
     * Gera o HTML para exibir um resultado de busca.
     * @param {Object} book - O objeto livro a ser exibido.
     * @returns {string} O HTML gerado para o item de busca.
     */
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

    /**
     * Renderiza os resultados da busca no contêiner.
     * @param {Array<Object>} books - A lista de livros a ser renderizada.
     */
    const renderResults = (books) => {
        searchResultsContainer.innerHTML = ''; // Limpa o conteúdo anterior
        if (books.length > 0) {
            const resultItems = books.map(createResultItem).join('');
            searchResultsContainer.innerHTML = resultItems;
            searchResultsContainer.style.display = 'block'; // Mostra o contêiner
        } else {
            searchResultsContainer.innerHTML = '<span class="no-results">Nenhum livro encontrado.</span>';
            searchResultsContainer.style.display = 'block'; // Mostra o contêiner mesmo sem resultados
        }
    };

    /**
     * Busca livros no servidor com base no termo de busca.
     * @param {string} term - O termo de busca (título ou autor).
     */
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
            searchResultsContainer.style.display = 'block'; // Mostra a mensagem de erro
        }
    };

    // Adiciona um listener para o evento 'input' no campo de busca
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.trim();
        // CORREÇÃO APLICADA: A busca agora acontece se o termo tiver 1 ou mais caracteres
        if (searchTerm.length > 0) {
            searchBooks(searchTerm);
        } else {
            // Esconde os resultados se o termo for vazio
            searchResultsContainer.style.display = 'none';
        }
    });

    // Adiciona um listener para esconder os resultados ao clicar fora do contêiner
    document.addEventListener('click', (event) => {
        const isClickInsideSearch = searchInput.parentElement.contains(event.target);
        const isClickInsideResults = searchResultsContainer.contains(event.target);
        
        if (!isClickInsideSearch && !isClickInsideResults) {
            searchResultsContainer.style.display = 'none';
        }
    });

    // Impede o envio do formulário de busca para que a página não recarregue
    document.querySelector('.search-form').addEventListener('submit', (event) => {
        event.preventDefault();
    });
});