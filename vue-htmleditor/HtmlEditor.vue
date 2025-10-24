<template>
  <div class="html-editor-container" :class="{ 'readonly': readonly }">
    <!-- Toolbar -->
    <div v-if="!readonly" class="toolbar">
      <!-- Formattazione base -->
      <div class="toolbar-group">
        <button type="button" @click="formatText('bold')" title="Grassetto (Ctrl+B)" class="toolbar-btn">
          <strong>B</strong>
        </button>
        <button type="button" @click="formatText('italic')" title="Corsivo (Ctrl+I)" class="toolbar-btn">
          <em>I</em>
        </button>
        <button type="button" @click="formatText('underline')" title="Sottolineato (Ctrl+U)" class="toolbar-btn">
          <span style="text-decoration: underline;">U</span>
        </button>
      </div>

      <div class="toolbar-separator"></div>

      <!-- Font e colore -->
      <div class="toolbar-group">
        <select v-model="selectedFont" @change="applyFont" class="toolbar-select">
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
        <div class="color-picker-wrapper">
          <input type="color" v-model="selectedColor" @change="applyColor" title="Colore testo" class="toolbar-color" />
          <span class="color-label">A</span>
        </div>
      </div>

      <div class="toolbar-separator"></div>

      <!-- Azioni -->
      <div class="toolbar-group">
        <button type="button" @click="removeFormatting" title="Rimuovi formattazione" class="toolbar-btn">
          🧹
        </button>
        <button 
          type="button" 
          @click="toggleHtmlMode" 
          :class="['toolbar-btn', { active: htmlMode }]"
          title="Mostra codice HTML"
        >
          &lt;/&gt;
        </button>
      </div>

      <div class="toolbar-separator"></div>

      <!-- Titoli -->
      <div class="toolbar-group">
        <select v-model="selectedHeading" @change="applyHeading" class="toolbar-select">
          <option value="">Normale</option>
          <option value="h1">Titolo 1</option>
          <option value="h2">Titolo 2</option>
          <option value="h3">Titolo 3</option>
          <option value="h4">Titolo 4</option>
          <option value="h5">Titolo 5</option>
          <option value="h6">Titolo 6</option>
        </select>
      </div>

      <div class="toolbar-separator"></div>

      <!-- Liste e rientri -->
      <div class="toolbar-group">
        <button @click="toggleList('ul')" title="Elenco puntato" class="toolbar-btn">≡</button>
        <button @click="toggleList('ol')" title="Elenco numerato" class="toolbar-btn">≣</button>
      </div>

      <div class="toolbar-separator"></div>

      <div class="toolbar-group">
        <button @click="indent('outdent')" title="Riduci rientro" class="toolbar-btn">⬅</button>
        <button @click="indent('indent')" title="Aumenta rientro" class="toolbar-btn">➡</button>
      </div>

      <div class="toolbar-separator"></div>

      <!-- Link -->
      <div class="toolbar-group">
        <button @click="insertLink" title="Inserisci Link" class="toolbar-btn">
          🔗
        </button>
      </div>

      <!-- Placeholder -->
      <template v-if="placeholders && placeholders.length > 0">
        <div class="toolbar-separator"></div>
        <div class="toolbar-group">
          <select
            v-model="selectedPlaceholder"
            @change="insertPlaceholder"
            class="toolbar-select toolbar-select-placeholder"
          >
            <option value="">Inserisci campo...</option>
            <optgroup v-for="(group, i) in placeholders" :key="i" :label="group.label">
              <option v-for="(item, j) in group.items" :key="j" :value="item.value">{{ item.label }}</option>
            </optgroup>
          </select>
        </div>
      </template>
    </div>

    <!-- Indicatore readonly -->
    <div v-if="readonly" class="readonly-indicator">
      📖 Modalità sola lettura
    </div>

    <div class="editor-preview-wrapper">
      <!-- Editor -->
      <div
        v-show="!htmlMode"
        ref="editable"
        class="editor"
        :contenteditable="!readonly"
        @input="onInput"
        @mousedown="onEditorClick"
        spellcheck="false"
        :class="{ 'readonly': readonly }"
      ></div>

      <!-- Codice HTML -->
      <textarea
        v-show="htmlMode && !readonly"
        v-model="content"
        @input="onTextareaInput"
        class="html-source"
      ></textarea>

      <div
        v-show="htmlMode && readonly"
        class="html-source-readonly"
        v-text="content"
      ></div>

      <!-- Anteprima -->
      <div class="preview" v-html="content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HtmlEditor",
  props: {
    placeholders: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: "<p>Scrivi qui...</p>",
      selectedFont: "Arial",
      selectedColor: "#000000",
      selectedHeading: "",
      selectedPlaceholder: "",
      htmlMode: false,
      lastSelection: null,
    };
  },
  mounted() {
    this.$refs.editable.innerHTML = this.content;
  },
  methods: {
    // --- Base editor events ---
    onInput() {
      if (this.readonly) return;
      this.content = this.$refs.editable.innerHTML;
      this.cleanEmptyTags();
    },

    onTextareaInput() {
      if (this.readonly) return;
    },

    onEditorClick() {
      if (this.readonly) return;
      this.saveSelection();
    },

    saveSelection() {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) this.lastSelection = sel.getRangeAt(0);
    },

    restoreSelection() {
      if (this.lastSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.lastSelection);
      }
    },

    // --- HTML mode ---
    toggleHtmlMode() {
      if (this.readonly) return;
      this.htmlMode = !this.htmlMode;
      if (!this.htmlMode) {
        this.$nextTick(() => (this.$refs.editable.innerHTML = this.content));
      } else {
        this.content = this.$refs.editable.innerHTML;
      }
    },

    cleanEmptyTags() {
      if (this.htmlMode || this.readonly) return;
      const empty = this.$refs.editable.querySelectorAll(
        "b:empty, i:empty, u:empty, span:empty, a:empty, strong:empty, em:empty"
      );
      empty.forEach(t => t.remove());
      this.content = this.$refs.editable.innerHTML;
    },

    // --- Text formatting ---
    formatText(command) {
      if (this.readonly) return;
      document.execCommand(command);
      this.onInput();
    },

    applyFont() {
      if (this.readonly) return;
      document.execCommand("fontName", false, this.selectedFont);
      this.onInput();
    },

    applyColor() {
      if (this.readonly) return;
      document.execCommand("foreColor", false, this.selectedColor);
      this.onInput();
    },

    applyHeading() {
      if (this.readonly) return;
      document.execCommand("formatBlock", false, this.selectedHeading || "p");
      this.selectedHeading = "";
      this.onInput();
    },

    // --- Lists and indentation ---
    toggleList(type) {
      if (this.readonly) return;
      document.execCommand(type === "ul" ? "insertUnorderedList" : "insertOrderedList");
      this.onInput();
    },

    indent(dir) {
      if (this.readonly) return;
      document.execCommand(dir, false, null);
      this.onInput();
    },

    insertLink() {
      if (this.readonly) return;
      const url = prompt("Inserisci URL:", "https://");
      if (url) document.execCommand("createLink", false, url);
      this.onInput();
    },

    // --- Placeholder insertion ---
    insertPlaceholder() {
      if (this.readonly || !this.selectedPlaceholder) return;
      document.execCommand("insertText", false, this.selectedPlaceholder);
      this.selectedPlaceholder = "";
      this.onInput();
    },

    // --- Clear formatting completely ---
    removeFormatting() {
      if (this.readonly) return;
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const fragment = range.extractContents();
      const text = fragment.textContent || "";
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      this.onInput();
    },
  },
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
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 10px;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
}

.toolbar-separator {
  width: 1px;
  height: 24px;
  background-color: #ccc;
}

.toolbar-select {
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  height: 32px;
  font-size: 13px;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  padding: 4px 6px;
}

.color-label {
  margin-left: 4px;
}

.editor-preview-wrapper {
  display: flex;
  flex: 1;
  min-height: 280px;
}

.editor {
  flex: 1;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
  background: #fff;
  overflow-y: auto;
  line-height: 1.6;
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
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  border: none;
  outline: none;
}

.html-source-readonly {
  flex: 1;
  background: #f9fafb;
  padding: 16px;
  border-left: 1px solid #e0e0e0;
  color: #555;
  font-family: 'Courier New', monospace;
}

.readonly-indicator {
  background: #f3f4f6;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
  padding: 8px;
  color: #555;
  font-size: 13px;
}
</style>
