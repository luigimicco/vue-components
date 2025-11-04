<template>
  <div class="html-editor-container" :class="{ 'readonly': readonly }">
    <!-- Toolbar -->
    <div v-if="!readonly" class="toolbar">


      <div class="toolbar-group" v-if="toolbar.includes('font')">
        <select v-model="selectedFont" @change="applyFont" class="toolbar-select">
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div> 

      <!-- Titoli -->
      <div class="toolbar-group" v-if="toolbar.includes('heading')">
        <select v-model="selectedHeading" @change="applyHeading" class="toolbar-select">
          <option value="">Normale</option>
          <option value="h1" style="font-weight:bold; font-size: 2em" >Titolo 1</option>
          <option value="h2" style="font-weight:bold; font-size: 1.8em" >Titolo 2</option>
          <option value="h3" style="font-weight:bold; font-size: 1.7em" >Titolo 3</option>
          <option value="h4" style="font-weight:bold; font-size: 1.6em" >Titolo 4</option>
          <option value="h5" style="font-weight:bold; font-size: 1.5em" >Titolo 5</option>
          <option value="h6" style="font-weight:bold; font-size: 1.4em" >Titolo 6</option>
        </select>
      </div>    
      
      <!-- Font e colore -->
      <div class="toolbar-group" v-if="toolbar.includes('color')">
        <div class="color-picker-wrapper">
          <input type="color" v-model="selectedColor" @change="applyColor" title="Colore testo" class="toolbar-color" />
          <input type="color" v-model="highlightColor" @change="applyHighlight" title="Colore sfondo" class="toolbar-color" />
        </div> 
      </div>

      <template v-if="toolbar.includes('fontsize')" >
        <div class="toolbar-separator"></div>
        <!-- NUOVO: Dimensione font -->
        <div class="toolbar-group">
          <select v-model="selectedFontSize" @change="applyFontSize" class="toolbar-select" style="width:65px;">
            <option value="">Dim.</option>
            <option v-for="size in fontSizes" :value="size">{{ size }}px</option>
          </select>
        </div>
      </template>

      <template v-if="toolbar.includes('alignment')">
        <div class="toolbar-separator"></div>
        <!-- NUOVO: Allineamento testo -->
        <div class="toolbar-group">
          <button @click="alignText('left')" title="Allinea a sinistra" class="toolbar-btn">⟪</button>
          <button @click="alignText('center')" title="Centra" class="toolbar-btn">⟫⟪</button>
          <button @click="alignText('right')" title="Allinea a destra" class="toolbar-btn">⟫</button>
          <button @click="alignText('justify')" title="Giustifica" class="toolbar-btn">⟪⟫</button>
        </div>
      </template>          

      <template v-if="toolbar.includes('clear')|| toolbar.includes('strikethrough') || toolbar.includes('underline') || toolbar.includes('italic') || toolbar.includes('bold') || toolbar.includes('superscript') || toolbar.includes('subscript') ||  toolbar.includes('switchcase')">
        <div class="toolbar-separator"></div>        
        <!-- Formattazione base -->
        <div class="toolbar-group">
          <button v-if="toolbar.includes('bold')" type="button" @click="formatText('bold')" title="Grassetto (Ctrl+B)" class="toolbar-btn">
            <strong>B</strong>
          </button>
          <button v-if="toolbar.includes('italic')" type="button" @click="formatText('italic')" title="Corsivo (Ctrl+I)" class="toolbar-btn">
            <em>I</em>
          </button>
          <button v-if="toolbar.includes('underline')" type="button" @click="formatText('underline')" title="Sottolineato (Ctrl+U)" class="toolbar-btn">
            <span style="text-decoration: underline;">U</span>
          </button>
          <button v-if="toolbar.includes('strikethrough')" type="button" @click="formatText('strikethrough')" title="Barrato (Ctrl+S)" class="toolbar-btn">
            <span style="text-decoration:line-through;">S</span>
          </button>            
          <button v-if="toolbar.includes('superscript')" type="button" @click="formatSupSub('sup')" title="Apice" class="toolbar-btn">X<sup>2</sup></button>
          <button v-if="toolbar.includes('subscript')" type="button" @click="formatSupSub('sub')" title="Pedice" class="toolbar-btn">H<sub>2</sub></button>
          <button v-if="toolbar.includes('switchcase')" type="button" @click="toggleCase" title="Maiuscolo/Minuscolo" class="toolbar-btn">
            Aa
          </button>          
          <button v-if="toolbar.includes('clear')" @click="removeFormatting" title="Rimuovi formattazione" class="toolbar-btn">Clear</button>

        </div>
      </template>


      
      <template v-if="toolbar.includes('list')">
        <div class="toolbar-separator"></div>
        <!-- Liste e rientri -->
        <div class="toolbar-group">
          <button @click="toggleList('ul')" title="Elenco puntato" class="toolbar-btn">●.</button>
          <button @click="toggleList('ol')" title="Elenco numerato" class="toolbar-btn">1.</button>
        </div>      
      </template>

      <template v-if="toolbar.includes('indent')">
        <div class="toolbar-separator"></div>
        <div class="toolbar-group">
          <button @click="indent('outdent')" title="Riduci rientro" class="toolbar-btn">◀</button>
          <button @click="indent('indent')" title="Aumenta rientro" class="toolbar-btn">▶</button>
        </div>
      </template>
      
      <template v-if="toolbar.includes('link')">
        <div class="toolbar-separator"></div>
        <!-- Link -->
        <div class="toolbar-group">
          <button @click="insertLink" title="Inserisci Link" class="toolbar-btn">🔗</button>
        </div>              
      </template>
      
      <!-- Placeholder -->
      <template v-if="placeholders && placeholders.length > 0 && toolbar.includes('placeholder')">
        <div class="toolbar-separator"></div>
        <div class="toolbar-group">
          <select v-model="selectedPlaceholder" @change="insertPlaceholder" class="toolbar-select toolbar-select-placeholder">
            <option value="">Inserisci campo...</option>
            <optgroup v-for="(group, i) in placeholders" :key="i" :label="group.label">
              <option v-for="(item, j) in group.items" :key="j" :value="item.value">
                {{ item.label }}
              </option>
            </optgroup>
          </select>
        </div>
      </template>

      <template v-if="toolbar.includes('html')">
        <div class="toolbar-separator"></div>
        <div class="toolbar-group">
          <button @click="toggleHtmlMode" :class="['toolbar-btn', { active: htmlMode }]" title="Mostra codice HTML">&lt;/&gt;</button>
        </div>
      </template>

    </div>



    <!-- Indicator readonly -->
    <div v-if="readonly" class="readonly-indicator">📖 Modalità sola lettura</div>

    <!-- Editor e anteprima -->
    <div class="editor-preview-wrapper">
      <!-- Editor -->
      <div
        v-if="!htmlMode"
        ref="editable"
        class="editor"
        :contenteditable="!readonly"
        @input="onInput"
        @mousedown="onEditorClick"
        spellcheck="false"
        :class="{ 'readonly': readonly }"
        :style="editorStyle"
        @keydown.ctrl.b.prevent="!readonly && formatText('bold')"
        @keydown.ctrl.i.prevent="!readonly && formatText('italic')"
        @keydown.ctrl.u.prevent="!readonly && formatText('underline')"             
      ></div>
      <!-- Codice HTML -->
      <textarea
        v-if="!readonly"
        v-show="htmlMode"
        v-model="content"
        @input="onTextareaInput"
        class="html-source"
        :style="editorStyle"
        spellcheck="false"
      ></textarea>
      <div
        v-if="readonly && htmlMode"
        class="html-source-readonly"
        v-text="content"
      ></div>
      <!-- Anteprima -->
      <div v-if="false" class="preview" v-html="content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HtmlEditor",
  props: {
    modelValue: {
      type: String,
      default: ""
    },      
    placeholders: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editorStyle: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      default: () => [ 'font', 'heading', 'switchcase', 'fontsize', 'color', 'bold', 'italic', 'underline', 'strikethrough','superscript','subscript', 'alignment', 'clear', 'list', 'indent', 'link', 'placeholder', 'html']
    }, /*  */
  },
  emits: [
    'update:modelValue',
  ],   
  data() {
    return {
      content: this.modelValue,
      selectedFont: "Arial",
      selectedColor: "#000000",
      selectedFontSize: "",
      fontSizes: [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64],
      highlightColor: "#ffff00",      
      selectedHeading: "",
      selectedPlaceholder: "",
      htmlMode: false,
      lastSelection: null,
    };
  },
  watch: {
    content: {
      handler(newVal) {
        this.$emit("update:modelValue", newVal);
      },
      deep: true,
    },    
    readonly(newVal) {
      if (newVal && this.htmlMode) {
        this.htmlMode = false;
      }
    }
  },
  mounted() {
      // Imposta il contenuto iniziale per evitare il bug di scrittura inversa
      this.$refs.editable.innerHTML = this.content;
  },
  methods: {
      onInput() {
          this.content = this.$refs.editable.innerHTML;
          this.cleanEmptyTags();
      },
      
      onEditorClick() {
          this.saveSelection();
      },
      
      saveSelection() {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
              this.lastSelection = selection.getRangeAt(0);
          }
      },
      
      restoreSelection() {
          if (this.lastSelection) {
              const selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(this.lastSelection);
          }
      },  
      
      // --- Maiuscolo/Minuscolo ---
      toggleCase() {
        if (this.readonly) return;
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        if (range.collapsed) return;
        const text = range.toString();
        if (!text) return;

        // Analisi: se la maggior parte è minuscolo => rendi maiuscolo, altrimenti minuscolo
        const lower = text.replace(/[^a-z]/g, "").length;
        const upper = text.replace(/[^A-Z]/g, "").length;
        const isLower = lower >= upper;

        const replaced = isLower ? text.toUpperCase() : text.toLowerCase();

        // Sostituisci selezione
        range.deleteContents();
        range.insertNode(document.createTextNode(replaced));
        sel.removeAllRanges();
        sel.addRange(range);
        this.onInput();
      },      

      // --- Dimensione font ---
      applyFontSize() {
        if (this.readonly || !this.selectedFontSize) return;
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        if (range.collapsed) return;

        const selectedContent = range.extractContents();
        const span = document.createElement("span");
        span.style.fontSize = this.selectedFontSize + "px";
        span.appendChild(selectedContent);
        range.insertNode(span);

        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.addRange(newRange);

        this.selectedFontSize = "";
        this.onInput();
      },      

      // --- Evidenziatore / Highlighter ---
      applyHighlight() {
        if (this.readonly) return;
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        if (range.collapsed) return;

        const selectedContent = range.extractContents();
        const span = document.createElement("span");
        span.style.backgroundColor = this.highlightColor;
        span.appendChild(selectedContent);
        range.insertNode(span);

        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.addRange(newRange);

        this.onInput();
      },

      formatText(command) {
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          const range = selection.getRangeAt(0);
          if (range.collapsed) return;
          
          // Extract the selected content
          const contents = range.extractContents();
          
          let tag;
          if (command === "bold") tag = "b";
          else if (command === "italic") tag = "i";
          else if (command === "underline") tag = "u";
          else if (command === "strikethrough") tag = "s";  // <--- AGGIUNTO!
          else return;
          const wrapper = document.createElement(tag);

          // Create the wrapper element
//          const wrapper = document.createElement(command === 'bold' ? 'strong' : 
//                                              command === 'italic' ? 'em' : 'u');
          wrapper.appendChild(contents);
          
          // Insert the wrapper
          range.insertNode(wrapper);
          
          // Reselect the formatted text
          range.selectNode(wrapper);
          selection.removeAllRanges();
          selection.addRange(range);
          
          this.onInput();
      },
      
      formatSupSub(command) {
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          const range = selection.getRangeAt(0);
          if (range.collapsed) {
              alert('Seleziona del testo per applicare apice o pedice');
              return;
          }
          
          // Extract the selected content
          const contents = range.extractContents();
          
          // Create the wrapper element (sup or sub)
          const wrapper = document.createElement(command);
          wrapper.appendChild(contents);
          
          // Insert the wrapper
          range.insertNode(wrapper);
          
          // Reselect the formatted text
          range.selectNode(wrapper);
          selection.removeAllRanges();
          selection.addRange(range);
          
          this.onInput();
      },
      
      alignText(alignment) {
          this.saveSelection();
          this.$refs.editable.focus();
          this.restoreSelection();
          
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          let node = selection.anchorNode;
          if (node.nodeType === 3) {
              node = node.parentNode;
          }
          
          const editable = this.$refs.editable;
          if (!node || !editable.contains(node) || node === editable) return;
          
          // Find block element (P, DIV, H1-H6, LI)
          let blockElement = node;
          while (blockElement && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(blockElement.tagName)) {
              blockElement = blockElement.parentNode;
              if (blockElement === editable) {
                  blockElement = null;
                  break;
              }
          }
          
          if (!blockElement || blockElement === editable) return;
          
          // Apply text alignment
          blockElement.style.textAlign = alignment;
          
          this.onInput();
      },
      
      applyHeading() {
          if (!this.selectedHeading) {
              this.formatBlock('p');
          } else {
              this.formatBlock(this.selectedHeading);
          }
          
          // Reset selector after applying
          this.$nextTick(() => {
              this.selectedHeading = '';
          });
      },
      
      formatBlock(tagName) {
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          const range = selection.getRangeAt(0);
          let container = range.commonAncestorContainer;
          
          // Find the block element containing the selection
          while (container && container.nodeType !== 1) {
              container = container.parentNode;
          }
          
          // Find container that is P, DIV, H1-H6, or LI
          while (container && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(container.tagName)) {
              container = container.parentNode;
          }
          
          if (container) {
              // Create new element
              const newElement = document.createElement(tagName);
              newElement.innerHTML = container.innerHTML;
              
              // Replace the old element
              container.parentNode.replaceChild(newElement, container);
              
              // Place cursor at end of new element
              range.selectNodeContents(newElement);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
              
              this.onInput();
          }
      },
      
      insertLink() {
          const selection = window.getSelection();
          if (!selection.rangeCount || selection.getRangeAt(0).collapsed) {
              alert('Seleziona del testo prima di inserire un link');
              return;
          }
          
          const url = prompt('Inserisci URL:', 'https://');
          if (!url || url === 'https://') return;
          
          const range = selection.getRangeAt(0);
          const contents = range.extractContents();
          
          // Create link element
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.appendChild(contents);
          
          // Insert the link
          range.insertNode(link);
          
          // Place cursor after the link
          range.setStartAfter(link);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          
          this.onInput();
      },
      
      insertPlaceholder() {
          if (!this.selectedPlaceholder) return;
          
          this.saveSelection();
          this.$refs.editable.focus();
          this.restoreSelection();
          
          let selection = window.getSelection();
          if (!selection.rangeCount) {
              // Se non c'è selezione, inserisce alla fine
              this.$refs.editable.focus();
              const range = document.createRange();
              range.selectNodeContents(this.$refs.editable);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
          }
          
          const range = selection.getRangeAt(0);
          const textNode = document.createTextNode(this.selectedPlaceholder);
          
          // Cancella contenuto selezionato (se presente) e inserisce placeholder
          range.deleteContents();
          range.insertNode(textNode);
          
          // Posiziona cursore dopo il placeholder
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Reset selector dopo inserimento
          this.$nextTick(() => {
              this.selectedPlaceholder = '';
          });
          
          this.onInput();
      },
      
      applyFont(event) {
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          const range = selection.getRangeAt(0);
          if (range.collapsed) {
              alert('Seleziona del testo per applicare il font');
              return;
          }
          
          // Extract the selected content
          const contents = range.extractContents();
          
          // Create span element with font-family style
          const span = document.createElement('span');
          span.style.fontFamily = this.selectedFont;
          span.appendChild(contents);
          
          // Insert the span
          range.insertNode(span);
          
          // Reselect the formatted text
          range.selectNode(span);
          selection.removeAllRanges();
          selection.addRange(range);
          
          this.onInput();
      },
      

/* 
      formatStrike(event) {
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          const range = selection.getRangeAt(0);
          if (range.collapsed) {
              alert('Seleziona del testo per applicare la formattazione');
              return;
          }
          
          // Extract the selected content
          const contents = range.extractContents();
          
          // Create span element with font-family style
          const span = document.createElement('span');
          span.style.textDecoration = "line-through";
          span.appendChild(contents);
          
          // Insert the span
          range.insertNode(span);
          
          // Reselect the formatted text
          range.selectNode(span);
          selection.removeAllRanges();
          selection.addRange(range);
          
          this.onInput();


      },
       */
      applyColor(event) {
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          const range = selection.getRangeAt(0);
          if (range.collapsed) {
              alert('Seleziona del testo per applicare il colore');
              return;
          }
          
          // Extract the selected content
          const contents = range.extractContents();
          
          // Create span element with color style
          const span = document.createElement('span');
          span.style.color = this.selectedColor;
          span.appendChild(contents);
          
          // Insert the span
          range.insertNode(span);
          
          // Reselect the formatted text
          range.selectNode(span);
          selection.removeAllRanges();
          selection.addRange(range);
          
          this.onInput();
      },
      
      removeFormatting() {
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          const range = selection.getRangeAt(0);
          if (range.collapsed) return;
          
          const fragment = range.extractContents();
          const plainText = fragment.textContent || "";
          if (!plainText) return;
          
          const editable = this.$refs.editable;
          
          // Trova container (startContainer, risali fino a elemento)
          let container = range.startContainer;
          while (container && container.nodeType !== 1) {
              container = container.parentNode;
          }
          
          // Verifica editable.contains(container)
          if (!container || !editable.contains(container)) return;
          
          // Trova blockElement risalendo parent fino a P, DIV, H1-H6, LI
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
              
              // Riseleziona textNode
              range.selectNodeContents(textNode);
              selection.removeAllRanges();
              selection.addRange(range);
              
              this.onInput();
              return;
          }
          
          // Se blockElement.tagName === 'LI'
          if (blockElement.tagName === 'LI') {
              const list = blockElement.parentNode; // UL/OL
              const newParagraph = document.createElement("p");
              const textNode = document.createTextNode(plainText);
              newParagraph.appendChild(textNode);
              
              if (list.children.length === 1) {
                  // Se l'unico elemento, sostituisce tutta la lista
                  list.parentNode.replaceChild(newParagraph, list);
              } else {
                  // Altrimenti inserisce paragrafo e rimuove LI
                  list.parentNode.insertBefore(newParagraph, list);
                  list.removeChild(blockElement);
              }
              
              // Riseleziona textNode in newParagraph
              range.selectNodeContents(textNode);
              selection.removeAllRanges();
              selection.addRange(range);
          } else {
              // Altrimenti (P, DIV, H1-H6)
              const newParagraph = document.createElement("p");
              const textNode = document.createTextNode(plainText);
              newParagraph.appendChild(textNode);
              blockElement.parentNode.replaceChild(newParagraph, blockElement);
              
              // Riseleziona textNode in newParagraph
              range.selectNodeContents(textNode);
              selection.removeAllRanges();
              selection.addRange(range);
          }
          
          this.onInput();
      },
      
      getTextNodesIn(node) {
          const textNodes = [];
          if (node.nodeType === 3) {
              textNodes.push(node);
          } else {
              for (let i = 0; i < node.childNodes.length; i++) {
                  textNodes.push(...this.getTextNodesIn(node.childNodes[i]));
              }
          }
          return textNodes;
      },
      
      toggleHtmlMode() {
          if (!this.htmlMode) {
              // Passando da editor a HTML: salva il contenuto corrente
              this.content = this.$refs.editable.innerHTML;
          }
          
          // Inverte la modalità
          this.htmlMode = !this.htmlMode;
          
          if (!this.htmlMode) {
              // Passando da HTML a editor: aspetta il render e aggiorna innerHTML
              this.$nextTick(() => {
                  this.$refs.editable.innerHTML = this.content;
              });
          }
      },
      
      onTextareaInput() {
          // Quando si modifica la textarea HTML, aggiorna solo il contenuto reattivo
          // Il v-model si occupa già dell'aggiornamento di this.content
      },
      
      cleanEmptyTags() {
          // Non pulire in modalità HTML
          if (this.htmlMode) return;
          
          const editable = this.$refs.editable;
          if (!editable) return;
          
          // Trova e rimuovi tag vuoti
          const emptyTags = editable.querySelectorAll('b:empty, i:empty, u:empty, strong:empty, em:empty, span:empty, a:empty');
          emptyTags.forEach(tag => {
              tag.parentNode.removeChild(tag);
          });
          
          // Aggiorna il contenuto dopo la pulizia
          this.content = editable.innerHTML;
      },
      
      toggleList(listType) {
          this.saveSelection();
          this.$refs.editable.focus();
          this.restoreSelection();
          
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          let node = selection.anchorNode;
          if (node.nodeType === 3) {
              node = node.parentNode;
          }
          
          const editable = this.$refs.editable;
          // CONTROLLO CRITICO: early return se fuori dall'editor
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
          
          this.onInput();
      },
      
      indent(direction) {
          this.saveSelection();
          this.$refs.editable.focus();
          this.restoreSelection();
          
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          
          let node = selection.anchorNode;
          if (node.nodeType === 3) {
              node = node.parentNode;
          }
          
          const editable = this.$refs.editable;
          // CONTROLLO CRITICO: early return se fuori dall'editor
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
          
          this.onInput();
      },
      
      handleKeydown(event) {
          // Handle keyboard shortcuts
          if (event.ctrlKey || event.metaKey) {
              switch (event.key) {
                  case 'b':
                      event.preventDefault();
                      this.formatText('bold');
                      break;
                  case 'i':
                      event.preventDefault();
                      this.formatText('italic');
                      break;
                  case 'u':
                      event.preventDefault();
                      this.formatText('underline');
                      break;
              }
          }
      },
      
      resetContent() {
          this.content = '<p>Scrivi qui...</p>';
          this.selectedFont = 'Arial';
          this.selectedColor = '#000000';
          this.selectedHeading = '';
          this.selectedPlaceholder = '';
          this.htmlMode = false;
          this.lastSelection = null;
          this.$refs.editable.innerHTML = this.content;
      },
      
      getContent() {
          return this.content;
      }
  }
};
</script>

<style scoped>
.html-editor-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

/* Stile per modalità readonly */
.html-editor-container.readonly {
  border-color: #d0d0d0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* Indicatore modalità readonly */
.readonly-indicator {
  background: linear-gradient(135deg, #f0f0f0, #e8e8e8);
  border-bottom: 1px solid #d0d0d0;
  padding: 8px 12px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
  text-align: center;
}


/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 10px;
  background: linear-gradient(to bottom, #fff, #f9fafb);
  border-bottom: 1px solid #e5e7eb;
}

.toolbar-group {
  display: flex;
  gap: 4px;
  align-items: center;
}

.toolbar-btn {
  background: white;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 10px;
  min-width: 32px;
  height: 32px;
  user-select: none;
  transition: all 0.2s ease;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-btn:hover {
  background-color: #f0f0f0;
  border-color: #999;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.toolbar-btn.active {
  background: gray; 
  color: white;
  border-color: #667eea;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
}

.toolbar-separator {
  width: 1px;
  height: 24px;
  background-color: #ccc;
}

.toolbar-select {
  padding: 6px 8px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  height: 32px;
}

.toolbar-select:hover {
  border-color: #999;
  background-color: #f8f9fa;
}

.toolbar-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.toolbar-select-placeholder {
  min-width: 150px;
  font-style: italic;
  color: #666;
}

.toolbar-select-placeholder option {
  font-style: normal;
}

.toolbar-color {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
  margin: 1px;
}

.toolbar-color::-webkit-color-swatch-wrapper {
  padding: 0;
}

.toolbar-color::-webkit-color-swatch {
  border: 1px solid #d0d0d0;
  border-radius: 3px;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  padding: 4px 4px;
  transition: all 0.2s ease;
}

.color-picker-wrapper:hover {
  border-color: #999;
}


.color-label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  pointer-events: none;
}

.editor-preview-wrapper {
  display: flex;
  flex: 1;
  min-height: 280px;
}

.editor {
  flex: 1;
  padding: 8px;
    outline: none;
 /*  border-right: 1px solid #e0e0e0; */
  background-color: white;
  overflow-y: auto;
  line-height: 1.6;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.editor:focus {
  background-color: #fafbfc;
}

/* Stile per editor in readonly */
.editor.readonly {
  background-color: #f8f9fa;
  cursor: default;
  user-select: text;
}

.editor.readonly:focus {
  background-color: #f8f9fa;
}



.preview {
  flex: 1;
  padding: 16px;
  border-left: 1px solid #e0e0e0;
  background: #fafafa;
  overflow-y: auto;
}

.html-source {
  flex: 1;
  padding: 16px;
  outline: none;
  border: none;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  background-color: #f5f5f5;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  resize: none;
  min-height: 100%;
  line-height: 1.5;
  color: #333;
}

.html-source-readonly {
  flex: 1;
  background: #f9fafb;
  padding: 16px;
  border-left: 1px solid #e0e0e0;
  color: #555;
  font-family: 'Courier New', monospace;
}

.html-source:focus {
  background-color: #f0f0f0;
}

/* HTML source in modalità readonly */
.html-source-readonly {
  flex: 1;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  background-color: #f8f9fa;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  min-height: 100%;
  line-height: 1.5;
  color: #666;
  white-space: pre-wrap;
  user-select: text;
}
</style>
