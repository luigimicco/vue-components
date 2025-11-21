/**
 * Composable per gestire i link
 */
export function useLinkManagement(emit) {
  /**
   * Inserisce un link
   */
  const insertLink = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.getRangeAt(0).collapsed) {
      emit?.('show-message', {
        type: 'warning',
        message: 'Seleziona del testo prima di inserire un link'
      });
      return;
    }

    // Emetti evento per richiedere URL all'utente
    emit?.('request-link', (url) => {
      if (!url || url === 'https://') return;

      const range = selection.getRangeAt(0);
      const contents = range.extractContents();

      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.appendChild(contents);

      range.insertNode(link);

      range.setStartAfter(link);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  };

  return {
    insertLink
  };
}
