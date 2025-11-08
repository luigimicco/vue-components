export default {
  updated(el, binding) {
    if (el._tooltip) {
      // Assumi che el._tooltip.childNodes[1] sia lo span del testo
      const textSpan = el._tooltip.querySelector('span');
      if (textSpan) {
        textSpan.textContent = binding.value || 'Tooltip';
      }
    }
  },

  mounted(el, binding) {
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';

    tooltip.style.backgroundColor = 'none';
    tooltip.style.color = 'white';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.zIndex = '10000'; // z-index alto per essere sopra altri elementi
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'flex';
    tooltip.style.alignItems = 'center';

    const textSpan = document.createElement('span');
    textSpan.textContent = binding.value || 'Tooltip';
    textSpan.style.backgroundColor = 'rgba(0,0,0,0.85)';
    textSpan.style.padding = '5px 15px';
    textSpan.style.borderRadius = '4px';

    // Creazione freccia triangolo
    const arrow = document.createElement('div');
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderStyle = 'solid';

    function updateArrowStyle(position) {
      switch (position) {
        case 'right':
          arrow.style.borderWidth = '6px 6px 6px 0';
          arrow.style.borderColor = 'transparent rgba(0,0,0,0.85) transparent transparent';
          arrow.style.marginRight = '0';
          arrow.style.marginLeft = '0';
          tooltip.style.flexDirection = 'row';
          break;
        case 'left':
          arrow.style.borderWidth = '6px 0 6px 6px';
          arrow.style.borderColor = 'transparent transparent transparent rgba(0,0,0,0.85)';
          arrow.style.marginLeft = '0';
          arrow.style.marginRight = '0';
          tooltip.style.flexDirection = 'row-reverse';
          break;
        case 'bottom':
          arrow.style.borderWidth = '0 6px 6px 6px';
          arrow.style.borderColor = 'transparent transparent rgba(0,0,0,0.85) transparent';
          arrow.style.marginTop = '0';
          arrow.style.marginBottom = '0';
          tooltip.style.flexDirection = 'column';
          break;
        case 'top':
        default:
          arrow.style.borderWidth = '6px 6px 0 6px';
          arrow.style.borderColor = 'rgba(0,0,0,0.85) transparent transparent transparent';
          arrow.style.marginBottom = '0';
          arrow.style.marginTop = '0';
          tooltip.style.flexDirection = 'column-reverse';
          break;
      }
    }

    tooltip.appendChild(arrow);
    tooltip.appendChild(textSpan);
    document.body.appendChild(tooltip);

    function getOptimalPosition() {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Se l'utente ha specificato una posizione, usala
      if (binding.arg) {
        return binding.arg;
      }

      // Calcola spazio disponibile in ogni direzione
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Dimensioni approssimate del tooltip (deve essere visible per misurarle)
      tooltip.style.opacity = '0';
      const tooltipRect = tooltip.getBoundingClientRect();
      tooltip.style.opacity = '1';

      const spaceTop = rect.top;
      const spaceRight = viewportWidth - rect.right;
      const spaceBottom = viewportHeight - rect.bottom;
      const spaceLeft = rect.left;

      // Verifica quale posizione ha più spazio disponibile
      const positions = [
        { name: 'top', space: spaceTop, needed: tooltipRect.height + 15 },
        { name: 'right', space: spaceRight, needed: tooltipRect.width + 15 },
        { name: 'bottom', space: spaceBottom, needed: tooltipRect.height + 15 },
        { name: 'left', space: spaceLeft, needed: tooltipRect.width + 15 }
      ];

      // Filtra posizioni che hanno abbastanza spazio
      const validPositions = positions.filter(pos => pos.space >= pos.needed);
      
      // Se ci sono posizioni valide, scegli quella con più spazio
      if (validPositions.length > 0) {
        return validPositions.reduce((best, current) => 
          current.space > best.space ? current : best
        ).name;
      }
     
      // Se nessuna posizione ha abbastanza spazio, scegli quella con più spazio disponibile
      return positions.reduce((best, current) => 
        current.space > best.space ? current : best
      ).name;

    }

    function setPosition(event) {
      const placement = getOptimalPosition(); //binding.arg || 'top';

      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      updateArrowStyle(placement);

      let top, left;
      switch (placement) {
        case 'right':
          top = rect.top + scrollTop + rect.height / 2 - tooltip.offsetHeight / 2;
          left = rect.right + scrollLeft + 8;
          break;
        case 'bottom':
          top = rect.bottom + scrollTop + 8;
          left = rect.left + scrollLeft + rect.width / 2 - tooltip.offsetWidth / 2;
          break;
        case 'left':
          top = rect.top + scrollTop + rect.height / 2 - tooltip.offsetHeight / 2;
          left = rect.left + scrollLeft - tooltip.offsetWidth - 8;
          break;
        case 'top':
        default:
          top = rect.top + scrollTop - tooltip.offsetHeight - 8;
          left = rect.left + scrollLeft + rect.width / 2 - tooltip.offsetWidth / 2;
          break;
      }
  
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }

    function show(event) {
      tooltip.style.visibility = 'visible';
      setPosition(event);
    }

    function hide() {
      tooltip.style.visibility = 'hidden';
    }

    el.addEventListener('mouseenter', show);
//    el.addEventListener('mousemove', setPosition);
    el.addEventListener('mouseleave', hide);

    el._tooltip = tooltip;
    el._show = show;
    el._hide = hide;
  },
  unmounted(el) {
    el.removeEventListener('mouseenter', el._show);
//    if (setPosition) el.removeEventListener('mousemove', setPosition);
    el.removeEventListener('mouseleave', el._hide);
    if (el._tooltip) {
      document.body.removeChild(el._tooltip);
      delete el._tooltip;
    }
  },
};
