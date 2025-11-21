/**
 * Composable per gestire l'allineamento del testo
 */
export function useTextAlignment() {
  /**
   * Allinea il testo (left, center, right, justify)
   */
  const alignText = (alignment, editableRef) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let node = selection.anchorNode;
    if (node.nodeType === 3) {
      node = node.parentNode;
    }

    const editable = editableRef.value;
    if (!node || !editable.contains(node) || node === editable) return;

    // Trova block element (P, DIV, H1-H6, LI)
    let blockElement = node;
    while (blockElement && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(blockElement.tagName)) {
      blockElement = blockElement.parentNode;
      if (blockElement === editable) {
        blockElement = null;
        break;
      }
    }

    if (!blockElement || blockElement === editable) return;

    // Applica allineamento
    blockElement.style.textAlign = alignment;
  };

  /**
   * Applica formattazione heading (h1-h6) o paragrafo
   */
  const formatBlock = (tagName) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let container = range.commonAncestorContainer;

    // Trova block element
    while (container && container.nodeType !== 1) {
      container = container.parentNode;
    }

    while (container && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(container.tagName)) {
      container = container.parentNode;
    }

    if (container) {
      const newElement = document.createElement(tagName);
      newElement.innerHTML = container.innerHTML;

      container.parentNode.replaceChild(newElement, container);

      range.selectNodeContents(newElement);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return {
    alignText,
    formatBlock
  };
}
