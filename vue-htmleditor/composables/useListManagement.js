/**
 * Composable per gestire liste e indentazione
 */
export function useListManagement() {
  /**
   * Toggle lista (UL/OL)
   */
  const toggleList = (listType, editableRef) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let node = selection.anchorNode;
    if (node.nodeType === 3) {
      node = node.parentNode;
    }

    const editable = editableRef.value;
    if (!node || !editable.contains(node) || node === editable) return;

    // Trova currentList risalendo i parent fino a UL/OL
    let currentList = node;
    while (currentList && !['UL', 'OL'].includes(currentList.tagName)) {
      currentList = currentList.parentNode;
      if (currentList === editable) {
        currentList = null;
        break;
      }
    }

    if (currentList) {
      // Se currentList trovato: rimuovi lista
      const items = Array.from(currentList.querySelectorAll('li'));
      const parent = currentList.parentNode;

      items.forEach(li => {
        const p = document.createElement('p');
        p.innerHTML = li.innerHTML;
        parent.insertBefore(p, currentList);
      });

      parent.removeChild(currentList);
    } else {
      // Trova blockElement (P, DIV, H1-H6)
      let blockElement = node;
      while (blockElement && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(blockElement.tagName)) {
        blockElement = blockElement.parentNode;
        if (blockElement === editable) {
          blockElement = null;
          break;
        }
      }

      if (blockElement) {
        // Crea list (UL/OL), crea <li>, copia innerHTML, replaceChild
        const list = document.createElement(listType);
        const li = document.createElement('li');
        li.innerHTML = blockElement.innerHTML;
        list.appendChild(li);

        blockElement.parentNode.replaceChild(list, blockElement);
      }
    }
  };

  /**
   * Gestisce indentazione (indent/outdent)
   */
  const indent = (direction, editableRef) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let node = selection.anchorNode;
    if (node.nodeType === 3) {
      node = node.parentNode;
    }

    const editable = editableRef.value;
    if (!node || !editable.contains(node) || node === editable) return;

    // Trova blockElement (P, DIV, H1-H6, LI)
    let blockElement = node;
    while (blockElement && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(blockElement.tagName)) {
      blockElement = blockElement.parentNode;
      if (blockElement === editable) {
        blockElement = null;
        break;
      }
    }

    if (!blockElement || blockElement === editable) return;

    const currentMargin = parseInt(blockElement.style.marginLeft) || 0;

    if (direction === 'indent') {
      blockElement.style.marginLeft = (currentMargin + 40) + 'px';
    } else if (direction === 'outdent') {
      const newMargin = Math.max(0, currentMargin - 40);
      if (newMargin === 0) {
        blockElement.style.marginLeft = '';
      } else {
        blockElement.style.marginLeft = newMargin + 'px';
      }
    }
  };

  return {
    toggleList,
    indent
  };
}
