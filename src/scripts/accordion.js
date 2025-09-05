// Função utilitária para combinar classes CSS (similar à função cn do React)
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Cria o ícone ChevronDown
function createChevronIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.classList.add('text-muted-foreground', 'pointer-events-none', 'shrink-0', 'translate-y-0.5', 'transition-transform', 'duration-200');
  svg.style.width = '1rem';
  svg.style.height = '1rem';

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M6 9l6 6 6-6');
  svg.appendChild(path);

  return svg;
}

// Adicionar estilos CSS para animações
function addAccordionStyles() {
  if (document.getElementById('accordion-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'accordion-styles';
  style.textContent = `
    @keyframes accordionUp {
      from { height: var(--accordion-content-height); opacity: 1; }
      to { height: 0; opacity: 0; }
    }
    
    @keyframes accordionDown {
      from { height: 0; opacity: 0; }
      to { height: var(--accordion-content-height); opacity: 1; }
    }
    
    [data-state="closed"].accordion-content {
      animation: accordionUp 0.2s ease-out;
      height: 0;
      overflow: hidden;
    }
    
    [data-state="open"].accordion-content {
      animation: accordionDown 0.2s ease-out;
      overflow: hidden;
    }
    
    [data-state="open"] > svg {
      transform: rotate(180deg);
    }
    
    .accordion-trigger {
      display: flex;
      flex: 1;
      align-items: start;
      justify-content: space-between;
      gap: 1rem;
      border-radius: 0.375rem;
      padding: 1rem 0;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      outline: none;
    }
    
    .accordion-trigger:hover {
      text-decoration: underline;
    }
    
    .accordion-trigger:focus-visible {
      border-color: var(--ring);
      box-shadow: 0 0 0 3px rgba(var(--ring), 0.5);
    }
    
    .accordion-trigger:disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    
    .accordion-item {
      border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.1));
    }
    
    .accordion-item:last-child {
      border-bottom: none;
    }
    
    .accordion-content-inner {
      padding: 0 0 1rem 0;
    }
  `;
  document.head.appendChild(style);
}

// Classe principal do Accordion
class AccordionComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      collapsible: true,
      multiple: false,
      ...options
    };
    
    this.items = [];
    this.init();
  }

  init() {
    // Adicionar estilos CSS
    addAccordionStyles();
    
    // Configurar o container principal
    this.container.setAttribute('data-slot', 'accordion');
    this.container.classList.add('accordion');
    
    // Encontrar todos os itens do accordion
    const itemElements = this.container.querySelectorAll('[data-accordion-item]');
    
    itemElements.forEach((itemElement, index) => {
      this.setupAccordionItem(itemElement, index);
    });
  }

  setupAccordionItem(itemElement, index) {
    // Configurar o elemento do item
    itemElement.setAttribute('data-slot', 'accordion-item');
    itemElement.classList.add('accordion-item');
    
    // Encontrar o trigger e o conteúdo
    const triggerElement = itemElement.querySelector('[data-accordion-trigger]');
    const contentElement = itemElement.querySelector('[data-accordion-content]');
    
    if (!triggerElement || !contentElement) {
      console.error('Accordion item must have trigger and content elements');
      return;
    }
    
    // Configurar o header e o trigger
    const headerElement = document.createElement('div');
    headerElement.classList.add('flex');
    
    // Mover o trigger para dentro do header
    itemElement.insertBefore(headerElement, triggerElement);
    headerElement.appendChild(triggerElement);
    
    // Configurar o trigger
    triggerElement.setAttribute('data-slot', 'accordion-trigger');
    triggerElement.classList.add('accordion-trigger');
    triggerElement.setAttribute('aria-expanded', 'false');
    triggerElement.id = `accordion-trigger-${index}`;
    contentElement.setAttribute('aria-labelledby', triggerElement.id);
    
    // Adicionar o ícone ao trigger
    const chevronIcon = createChevronIcon();
    triggerElement.appendChild(chevronIcon);
    
    // Configurar o conteúdo
    contentElement.setAttribute('data-slot', 'accordion-content');
    contentElement.classList.add('accordion-content');
    contentElement.setAttribute('data-state', 'closed');
    
    // Criar o wrapper interno para o conteúdo
    const contentInner = document.createElement('div');
    contentInner.classList.add('accordion-content-inner');
    
    // Mover o conteúdo original para dentro do wrapper
    while (contentElement.firstChild) {
      contentInner.appendChild(contentElement.firstChild);
    }
    contentElement.appendChild(contentInner);
    
    // Adicionar evento de clique
    triggerElement.addEventListener('click', () => {
      this.toggleItem(index);
    });
    
    // Armazenar referência ao item
    this.items.push({
      element: itemElement,
      trigger: triggerElement,
      content: contentElement,
      contentInner: contentInner,
      isOpen: false,
      index
    });
  }

  toggleItem(index) {
    const item = this.items[index];
    
    if (!item) return;
    
    const isClosing = item.isOpen;
    
    // Se não for múltiplo, feche todos os outros
    if (!this.options.multiple && !isClosing) {
      this.items.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index && otherItem.isOpen) {
          this.closeItem(otherItem);
        }
      });
    }
    
    // Alternar o item atual
    if (isClosing) {
      this.closeItem(item);
    } else {
      this.openItem(item);
    }
  }

  openItem(item) {
    if (item.isOpen) return;
    
    item.isOpen = true;
    item.trigger.setAttribute('aria-expanded', 'true');
    item.content.setAttribute('data-state', 'open');
    
    // Definir a altura para a animação
    const height = item.contentInner.offsetHeight;
    item.content.style.setProperty('--accordion-content-height', `${height}px`);
    item.content.style.height = `${height}px`;
    
    // Após a animação, remover a altura fixa
    const handleAnimationEnd = () => {
      if (item.isOpen) {
        item.content.style.height = 'auto';
      }
      item.content.removeEventListener('animationend', handleAnimationEnd);
    };
    
    item.content.addEventListener('animationend', handleAnimationEnd);
  }

  closeItem(item) {
    if (!item.isOpen) return;
    
    item.isOpen = false;
    item.trigger.setAttribute('aria-expanded', 'false');
    
    // Definir a altura atual antes de fechar
    const height = item.content.offsetHeight;
    item.content.style.setProperty('--accordion-content-height', `${height}px`);
    item.content.style.height = '0';
    
    // Mudar o estado após definir a altura para a animação
    item.content.setAttribute('data-state', 'closed');
  }
  
  // Métodos públicos para controlar o accordion
  open(index) {
    const item = this.items[index];
    if (item) this.openItem(item);
  }
  
  close(index) {
    const item = this.items[index];
    if (item) this.closeItem(item);
  }
  
  openAll() {
    if (!this.options.multiple) return;
    this.items.forEach(item => this.openItem(item));
  }
  
  closeAll() {
    this.items.forEach(item => this.closeItem(item));
  }
}

// Função para inicializar todos os accordions na página
function initAccordions() {
  document.querySelectorAll('[data-accordion]').forEach(container => {
    new AccordionComponent(container, {
      multiple: container.hasAttribute('data-multiple'),
      collapsible: !container.hasAttribute('data-no-collapsible')
    });
  });
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordions);
} else {
  initAccordions();
}

// Exportar para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AccordionComponent,
    initAccordions
  };
}