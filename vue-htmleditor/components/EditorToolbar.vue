<template>
  <div class="toolbar" role="toolbar" aria-label="Barra strumenti editor">
    <!-- Font selector -->
    <div class="toolbar-group" v-if="toolbar.includes('font')">
      <select 
        v-model="localFont" 
        @change="$emit('apply-font', localFont)" 
        class="toolbar-select"
        aria-label="Seleziona font"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>
    </div>

    <!-- Heading selector -->
    <div class="toolbar-group" v-if="toolbar.includes('heading')">
      <select 
        v-model="localHeading" 
        @change="handleHeading" 
        class="toolbar-select"
        aria-label="Seleziona stile titolo"
      >
        <option value="">Normale</option>
        <option value="h1" style="font-weight:bold; font-size: 2em">Titolo 1</option>
        <option value="h2" style="font-weight:bold; font-size: 1.8em">Titolo 2</option>
        <option value="h3" style="font-weight:bold; font-size: 1.7em">Titolo 3</option>
        <option value="h4" style="font-weight:bold; font-size: 1.6em">Titolo 4</option>
        <option value="h5" style="font-weight:bold; font-size: 1.5em">Titolo 5</option>
        <option value="h6" style="font-weight:bold; font-size: 1.4em">Titolo 6</option>
      </select>
    </div>

    <!-- Color pickers -->
    <div class="toolbar-group" v-if="toolbar.includes('color')">
      <div class="color-picker-wrapper" role="group" aria-label="Selettori colore">
        <input 
          type="color" 
          v-model="localColor" 
          @change="$emit('apply-color', localColor)" 
          title="Colore testo" 
          class="toolbar-color"
          aria-label="Colore testo"
        />
        <input 
          type="color" 
          v-model="localHighlight" 
          @change="$emit('apply-highlight', localHighlight)" 
          title="Colore sfondo" 
          class="toolbar-color"
          aria-label="Colore evidenziatore"
        />
      </div>
    </div>

    <!-- Font size -->
    <template v-if="toolbar.includes('fontsize')">
      <div class="toolbar-separator" role="separator"></div>
      <div class="toolbar-group">
        <select 
          v-model="localFontSize" 
          @change="handleFontSize" 
          class="toolbar-select" 
          style="width:65px;"
          aria-label="Seleziona dimensione font"
        >
          <option value="">Dim.</option>
          <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}px</option>
        </select>
      </div>
    </template>

    <!-- Text alignment -->
    <template v-if="toolbar.includes('alignment')">
      <div class="toolbar-separator" role="separator"></div>
      <div class="toolbar-group" role="group" aria-label="Allineamento testo">
        <button @click="$emit('align', 'left')" title="Allinea a sinistra" class="toolbar-btn" aria-label="Allinea a sinistra">⟪</button>
        <button @click="$emit('align', 'center')" title="Centra" class="toolbar-btn" aria-label="Allinea al centro">⟫⟪</button>
        <button @click="$emit('align', 'right')" title="Allinea a destra" class="toolbar-btn" aria-label="Allinea a destra">⟫</button>
        <button @click="$emit('align', 'justify')" title="Giustifica" class="toolbar-btn" aria-label="Giustifica">⟪⟫</button>
      </div>
    </template>

    <!-- Formatting buttons -->
    <template v-if="hasFormattingButtons">
      <div class="toolbar-separator" role="separator"></div>
      <div class="toolbar-group" role="group" aria-label="Formattazione testo">
        <button v-if="toolbar.includes('bold')" type="button" @click="$emit('format', 'bold')" title="Grassetto (Ctrl+B)" class="toolbar-btn" aria-label="Grassetto">
          <strong>B</strong>
        </button>
        <button v-if="toolbar.includes('italic')" type="button" @click="$emit('format', 'italic')" title="Corsivo (Ctrl+I)" class="toolbar-btn" aria-label="Corsivo">
          <em>I</em>
        </button>
        <button v-if="toolbar.includes('underline')" type="button" @click="$emit('format', 'underline')" title="Sottolineato (Ctrl+U)" class="toolbar-btn" aria-label="Sottolineato">
          <span style="text-decoration: underline;">U</span>
        </button>
        <button v-if="toolbar.includes('strikethrough')" type="button" @click="$emit('format', 'strikethrough')" title="Barrato" class="toolbar-btn" aria-label="Barrato">
          <span style="text-decoration:line-through;">S</span>
        </button>
        <button v-if="toolbar.includes('superscript')" type="button" @click="$emit('format-sup-sub', 'sup')" title="Apice" class="toolbar-btn" aria-label="Apice">X<sup>2</sup></button>
        <button v-if="toolbar.includes('subscript')" type="button" @click="$emit('format-sup-sub', 'sub')" title="Pedice" class="toolbar-btn" aria-label="Pedice">H<sub>2</sub></button>
        <button v-if="toolbar.includes('switchcase')" type="button" @click="$emit('toggle-case')" title="Maiuscolo/Minuscolo" class="toolbar-btn" aria-label="Cambia maiuscolo/minuscolo">Aa</button>
        <button v-if="toolbar.includes('clear')" @click="$emit('remove-formatting')" title="Rimuovi formattazione" class="toolbar-btn" aria-label="Rimuovi formattazione">Clear</button>
      </div>
    </template>

    <!-- Lists -->
    <template v-if="toolbar.includes('list')">
      <div class="toolbar-separator" role="separator"></div>
      <div class="toolbar-group" role="group" aria-label="Liste">
        <button @click="$emit('toggle-list', 'ul')" title="Elenco puntato" class="toolbar-btn" aria-label="Elenco puntato">●.</button>
        <button @click="$emit('toggle-list', 'ol')" title="Elenco numerato" class="toolbar-btn" aria-label="Elenco numerato">1.</button>
      </div>
    </template>

    <!-- Indent -->
    <template v-if="toolbar.includes('indent')">
      <div class="toolbar-separator" role="separator"></div>
      <div class="toolbar-group" role="group" aria-label="Rientro">
        <button @click="$emit('indent', 'outdent')" title="Riduci rientro" class="toolbar-btn" aria-label="Riduci rientro">◀</button>
        <button @click="$emit('indent', 'indent')" title="Aumenta rientro" class="toolbar-btn" aria-label="Aumenta rientro">▶</button>
      </div>
    </template>

    <!-- Link -->
    <template v-if="toolbar.includes('link')">
      <div class="toolbar-separator" role="separator"></div>
      <div class="toolbar-group">
        <button @click="$emit('insert-link')" title="Inserisci Link" class="toolbar-btn" aria-label="Inserisci link">🔗</button>
      </div>
    </template>

    <!-- Placeholders -->
    <template v-if="placeholders && placeholders.length > 0 && toolbar.includes('placeholder')">
      <div class="toolbar-separator" role="separator"></div>
      <div class="toolbar-group">
        <select 
          v-model="localPlaceholder" 
          @change="handlePlaceholder" 
          class="toolbar-select toolbar-select-placeholder"
          aria-label="Inserisci campo placeholder"
        >
          <option value="">Inserisci campo...</option>
          <optgroup v-for="(group, i) in placeholders" :key="i" :label="group.label">
            <option v-for="(item, j) in group.items" :key="j" :value="item.value">
              {{ item.label }}
            </option>
          </optgroup>
        </select>
      </div>
    </template>

    <!-- HTML mode toggle -->
    <template v-if="toolbar.includes('html')">
      <div class="toolbar-separator" role="separator"></div>
      <div class="toolbar-group">
        <button 
          @click="$emit('toggle-html')" 
          :class="['toolbar-btn', { active: htmlMode }]" 
          title="Mostra codice HTML"
          aria-label="Mostra codice HTML"
          :aria-pressed="htmlMode"
        >&lt;/&gt;</button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'EditorToolbar',
  props: {
    toolbar: {
      type: Array,
      default: () => ['font', 'heading', 'switchcase', 'fontsize', 'color', 'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'alignment', 'clear', 'list', 'indent', 'link', 'placeholder', 'html']
    },
    selectedFont: {
      type: String,
      default: 'Arial'
    },
    selectedColor: {
      type: String,
      default: '#000000'
    },
    selectedFontSize: {
      type: [String, Number],
      default: ''
    },
    highlightColor: {
      type: String,
      default: '#ffff00'
    },
    selectedHeading: {
      type: String,
      default: ''
    },
    selectedPlaceholder: {
      type: String,
      default: ''
    },
    placeholders: {
      type: Array,
      default: () => []
    },
    htmlMode: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'apply-font',
    'apply-color',
    'apply-highlight',
    'apply-font-size',
    'apply-heading',
    'align',
    'format',
    'format-sup-sub',
    'toggle-case',
    'remove-formatting',
    'toggle-list',
    'indent',
    'insert-link',
    'insert-placeholder',
    'toggle-html'
  ],
  
  data() {
    return {
      localFont: this.selectedFont,
      localColor: this.selectedColor,
      localFontSize: this.selectedFontSize,
      localHighlight: this.highlightColor,
      localHeading: this.selectedHeading,
      localPlaceholder: this.selectedPlaceholder,
      fontSizes: [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64]
    };
  },
  
  computed: {
    hasFormattingButtons() {
      return this.toolbar.some(item => 
        ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'switchcase', 'clear'].includes(item)
      );
    }
  },
  
  watch: {
    selectedFont(val) {
      this.localFont = val;
    },
    selectedColor(val) {
      this.localColor = val;
    },
    selectedFontSize(val) {
      this.localFontSize = val;
    },
    highlightColor(val) {
      this.localHighlight = val;
    },
    selectedHeading(val) {
      this.localHeading = val;
    },
    selectedPlaceholder(val) {
      this.localPlaceholder = val;
    }
  },
  
  methods: {
    handleHeading() {
      this.$emit('apply-heading', this.localHeading);
      this.$nextTick(() => {
        this.localHeading = '';
      });
    },
    
    handleFontSize() {
      if (this.localFontSize) {
        this.$emit('apply-font-size', this.localFontSize);
        this.$nextTick(() => {
          this.localFontSize = '';
        });
      }
    },
    
    handlePlaceholder() {
      if (this.localPlaceholder) {
        this.$emit('insert-placeholder', this.localPlaceholder);
        this.$nextTick(() => {
          this.localPlaceholder = '';
        });
      }
    }
  }
};
</script>

<style scoped>
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
</style>
