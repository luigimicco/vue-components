/**
 * Composable per gestire la formattazione del testo
 */
export function useFormatting(emit) {
  /**
   * Metodo generico per applicare stili CSS al testo selezionato
   */
  const applyStyle = (styleProp, styleValue) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      emit?.('show-notification', 'Seleziona del testo');
      return;
    }

    const contents = range.extractContents();
    const span = document.createElement('span');
    span.style[styleProp] = styleValue;
    span.appendChild(contents);
    range.insertNode(span);

    // Riseleziona il contenuto formattato
    range.selectNode(span);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  /**
   * Applica un font al testo selezionato
   */
  const applyFont = (font) => {
    applyStyle('fontFamily', font);
  };

  /**
   * Applica un colore al testo selezionato
   */
  const applyColor = (color) => {
    applyStyle('color', color);
  };

  /**
   * Applica un colore di sfondo (evidenziatore)
   */
  const applyHighlight = (color) => {
    applyStyle('backgroundColor', color);
  };

  /**
   * Applica dimensione font
   */
  const applyFontSize = (size) => {
    applyStyle('fontSize', size + 'px');
  };

  /**
   * Formattazione testo (bold, italic, underline, strikethrough)
   */
  const formatText = (command) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const contents = range.extractContents();

    let tag;
    if (command === 'bold') tag = 'b';
    else if (command === 'italic') tag = 'i';
    else if (command === 'underline') tag = 'u';
    else if (command === 'strikethrough') tag = 's';
    else return;

    const wrapper = document.createElement(tag);
    wrapper.appendChild(contents);

    range.insertNode(wrapper);
    range.selectNode(wrapper);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  /**
   * Formattazione apice/pedice
   */
  const formatSupSub = (command) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      emit?.('show-notification', 'Seleziona del testo per applicare apice o pedice');
      return;
    }

    const contents = range.extractContents();
    const wrapper = document.createElement(command); // 'sup' o 'sub'
    wrapper.appendChild(contents);

    range.insertNode(wrapper);
    range.selectNode(wrapper);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  /**
   * Toggle maiuscolo/minuscolo
   */
  const toggleCase = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const text = range.toString();
    if (!text) return;

    const lower = text.replace(/[^a-z]/g, '').length;
    const upper = text.replace(/[^A-Z]/g, '').length;
    const isLower = lower >= upper;

    const replaced = isLower ? text.toUpperCase() : text.toLowerCase();

    range.deleteContents();
    range.insertNode(document.createTextNode(replaced));
    sel.removeAllRanges();
    sel.addRange(range);
  };

  /**
   * Rimuove tutta la formattazione dal testo selezionato
   */
  const removeFormatting = (editableRef) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const fragment = range.extractContents();
    const plainText = fragment.textContent || '';
    if (!plainText) return;

    const editable = editableRef.value;
    let container = range.startContainer;

    while (container && container.nodeType !== 1) {
      container = container.parentNode;
    }

    if (!container || !editable.contains(container)) return;

    let blockElement = container;
    while (blockElement && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(blockElement.tagName)) {
      blockElement = blockElement.parentNode;
      if (blockElement === editable) {
        blockElement = null;
        break;
      }
    }

    if (!blockElement || blockElement === editable) {
      const textNode = document.createTextNode(plainText);
      range.insertNode(textNode);
      range.selectNodeContents(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    if (blockElement.tagName === 'LI') {
      const list = blockElement.parentNode;
      const newParagraph = document.createElement('p');
      const textNode = document.createTextNode(plainText);
      newParagraph.appendChild(textNode);

      if (list.children.length === 1) {
        list.parentNode.replaceChild(newParagraph, list);
      } else {
        list.parentNode.insertBefore(newParagraph, list);
        list.removeChild(blockElement);
      }

      range.selectNodeContents(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      const newParagraph = document.createElement('p');
      const textNode = document.createTextNode(plainText);
      newParagraph.appendChild(textNode);
      blockElement.parentNode.replaceChild(newParagraph, blockElement);

      range.selectNodeContents(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return {
    applyStyle,
    applyFont,
    applyColor,
    applyHighlight,
    applyFontSize,
    formatText,
    formatSupSub,
    toggleCase,
    removeFormatting
  };
}
