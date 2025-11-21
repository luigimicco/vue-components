/**
 * Composable per gestire la selezione del testo nell'editor
 */
export function useSelection() {
  let lastSelection = null;

  /**
   * Salva la selezione corrente
   */
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      lastSelection = selection.getRangeAt(0);
    }
  };

  /**
   * Ripristina l'ultima selezione salvata
   */
  const restoreSelection = () => {
    if (lastSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(lastSelection);
    }
  };

  /**
   * Ottiene tutti i nodi di testo all'interno di un nodo
   */
  const getTextNodesIn = (node) => {
    const textNodes = [];
    if (node.nodeType === 3) {
      textNodes.push(node);
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        textNodes.push(...getTextNodesIn(node.childNodes[i]));
      }
    }
    return textNodes;
  };

  return {
    saveSelection,
    restoreSelection,
    getTextNodesIn,
    get lastSelection() {
      return lastSelection;
    }
  };
}
