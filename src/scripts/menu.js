
    // Elementos do DOM
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const xIcon = document.getElementById('x-icon');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    // Variável para controlar o estado do menu
    let isMenuOpen = false;
    
    // Função para alternar o menu
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      
      if (isMenuOpen) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        xIcon.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        xIcon.classList.add('hidden');
      }
    }
    
    // Adicionar evento de clique ao botão do menu
    mobileMenuButton.addEventListener('click', toggleMenu);
    
    // Adicionar eventos de clique aos links do menu móvel
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Fechar o menu quando um link for clicado
        if (isMenuOpen) {
          toggleMenu();
        }
      });
    });
