document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const genresMenu = document.getElementById('genresMenu');

    if (menuToggle && genresMenu) {
        menuToggle.addEventListener('click', () => {
            genresMenu.classList.toggle('is-open');
        });

        // Adiciona um evento de clique no documento inteiro
        document.addEventListener('click', (event) => {
            // Verifica se o clique foi fora do menu de gêneros e do botão do menu hambúrguer
            const isClickInsideMenu = genresMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            // Se o menu estiver aberto E o clique for fora do menu e do botão, ele fecha
            if (genresMenu.classList.contains('is-open') && !isClickInsideMenu && !isClickOnToggle) {
                genresMenu.classList.remove('is-open');
            }
        });
    }
});