<template>
  <!-- Wrapper con direttiva custom per chiudere dropdown clickando fuori -->
  <div 
    ref="wrapper" 
    class="multi-select-wrapper" 
    v-click-outside="closeDropdown"
    role="combobox"
    :aria-expanded="showDropdown"
    :aria-haspopup="'listbox'"
    :aria-label="multiple ? 'Selezione multipla' : 'Selezione singola'"
  >

    <!-- Area elementi selezionati -->
    <div 
      class="selected-items" 
      @click="toggleDropdown"
      :aria-label="`${selectedItemMap.length} elementi selezionati`"
      tabindex="0"
      @keydown.enter="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
    >
      <div class="selected-items-wrapper">
        <!-- Ciclo sugli elementi selezionati -->
        <div
          v-for="(item, index) in selectedItemMap"
          :key="item.key"
          class="selected-item"
          :class="{ 'selected-item-expand': !multiple }"
          role="option"
          :aria-selected="true"
        >
          <!-- Slot personalizzabili per elementi selezionati, default con testo e pulsante rimuovi -->
          <slot
            :name="multiple ? 'selected-item' : 'selected-item-single'"
            :item="item.item"
            :index="index"
            :remove="removeItem"
          >
            <span class="selected-item-content">{{ item.display }}</span>
            <button
              type="button"
              class="remove-button"
              @click.stop="removeItem(item.item)"
              :title="`Rimuovi ${item.display}`"
              :aria-label="`Rimuovi ${item.display}`"
            >
              ×
            </button>
          </slot>
        </div>
      </div>

      <!-- Freccia a tendina per apertura dropdown -->
      <div 
        class="dropdown-arrow" 
        :class="{ 'dropdown-arrow--active': showDropdown }"
        aria-hidden="true"
      >▾</div>
    </div>

    <!-- Dropdown con ricerca e lista opzioni -->
    <div v-if="showDropdown" class="dropdown-wrapper">
      <div class="search-container">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          role="searchbox"
          :aria-label="searchPlaceholder"
          aria-autocomplete="list"
          :aria-controls="'options-list-' + _uid"
          @keydown.esc="closeDropdown"
          @keydown.down.prevent="navigateOptions(1)"
          @keydown.up.prevent="navigateOptions(-1)"
          @keydown.enter.prevent="selectHighlighted"
        />
        <div class="search-icon" aria-hidden="true">
          🔍
        </div>
      </div>

      <!-- Loading -->
      <div 
        v-if="isLoading" 
        class="options-loading"
        role="status"
        aria-live="polite"
        aria-label="Caricamento opzioni in corso"
      >
        <span class="loading-spinner"></span>
        <span>Caricamento...</span>
      </div>

      <!-- Lista delle opzioni filtrate -->
      <div v-if="!isLoading && filteredOptions.length" class="dropdown">
        <div 
          class="options-list" 
          ref="optionsList"
          role="listbox"
          :id="'options-list-' + _uid"
          :aria-multiselectable="multiple"
          :aria-label="'Opzioni disponibili'"
        >
          <div
            v-for="(option, index) in filteredOptions"
            :key="getItemKey(option)"
            class="option-item"
            :class="{
              highlighted: index === highlightedIndex,
              selected: isSelected(option),
              disabled: isDisabled(option),
            }"
            role="option"
            :aria-selected="isSelected(option)"
            :aria-disabled="isDisabled(option)"
            @click.stop="!isDisabled(option) && selectItem(option)"
            @mouseenter="highlightedIndex = index"
          >
            <slot name="option" :option="option" :index="index" :selected="isSelected(option)">
              <span class="option-content">{{ getDisplayText(option) }}</span>
            </slot>
          </div>
        </div>
      </div>

      <!-- Messaggio quando non ci sono risultati -->
      <div 
        v-else-if="!isLoading && searchQuery && !filteredOptions.length" 
        class="no-results"
        role="status"
        aria-live="polite"
      >
        <slot name="no-results">
          <span>Nessun risultato trovato per "{{ searchQuery }}"</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
// Funzione helper debounce per ritardare esecuzione della ricerca
function debounce(fn, delay) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Direttiva custom per rilevare click fuori elemento (Vue 3)
const clickOutsideDirective = {
  mounted(el, binding) {
    el.__vueClickOutside__ = event => {
      if (!(el === event.target || el.contains(event.target))) {
        if (typeof binding.value === 'function') {
          binding.value(event)
        }
      }
    }
    document.addEventListener('click', el.__vueClickOutside__)
    document.addEventListener('touchstart', el.__vueClickOutside__)
  },
  beforeUnmount(el) {
    document.removeEventListener('click', el.__vueClickOutside__)
    document.removeEventListener('touchstart', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
}

export default {
  name: 'MultiSelect',

  // Registrazione direttiva locale
  directives: { 'click-outside': clickOutsideDirective },

  props: {
    modelValue: { type: Array, default: () => [] },       // Array elementi selezionati
    multiple: { type: Boolean, default: true },            // Selezione multipla o singola
    loadOptions: { type: Function, required: true },       // Funzione async per caricamento opzioni
    optionLabel: { type: String, default: 'label' },       // Proprietà per label opzioni
    optionValue: { type: String, default: 'value' },       // Proprietà per valore univoco
    optionDisabled: { type: String, default: 'disabled' }, // Proprietà per disabilitare opzioni
    searchPlaceholder: { type: String, default: 'Cerca...' }, // Placeholder input ricerca
    debounceDelay: { type: Number, default: 300 },          // Ritardo debounce in ms
    minSearchLength: { type: Number, default: 1 },          // Minimo caratteri per iniziare ricerca
    maxOptions: { type: Number, default: 100 },             // Max opzioni da mostrare
    keepOpen: { type: Boolean, default: false },            // Mantieni dropdown aperto dopo selezione
    clearSearchOnSelect: { type: Boolean, default: false }  // Pulisci ricerca dopo selezione
  },

  emits: [
    'update:modelValue',
    'search',
    'select',
    'remove',
    'load-options',
    'open',
    'close'
  ],

  data() {
    return {
      searchQuery: '',         // Testo digitato per ricerca
      options: [],             // Array opzioni caricate dalla ricerca
      selectedItems: [],       // Array interno copie elementi selezionati
      showDropdown: false,     // Dropdown visibile o meno
      isLoading: false,        // Stato loading
      highlightedIndex: -1,    // Indice evidenziato da tastiera
    }
  },

  computed: {
    // Computed array ottimizzato con chiave e display per ogni selezionato
    selectedItemMap() {
      return this.selectedItems.map(item => ({
        key: this.getItemKey(item),
        display: this.getDisplayText(item),
        item
      }))
    },

    // Opzioni filtrate (esclude già selezionate), limite maxOptions
    filteredOptions() {
      return this.options.filter(opt => !this.isSelected(opt)).slice(0, this.maxOptions)
    }
  },

  watch: {
    // Sincronizza modelValue esterno in array interno selezionati
    modelValue: {
      handler(val) { this.selectedItems = [...val] },
      immediate: true
    },

    // Esegue ricerca con debounce ogni volta che cambia la query
    searchQuery: {
      handler: debounce(function (v) { this.performSearch(v) }, 300)
    },

    // Azzeramento evidenziato in caso di apertura/chiusura dropdown
    showDropdown(show) {
      this.highlightedIndex = show && this.filteredOptions.length ? 0 : -1
    }
  },

  methods: {
    // Toggle apertura/chiusura dropdown
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
      this.$emit(this.showDropdown ? 'open' : 'close')
      if (this.showDropdown) this.$nextTick(() => this.$refs.searchInput?.focus())
    },

    // Chiude il dropdown
    closeDropdown() {
      this.showDropdown = false
      this.$emit('close')
    },

    // Esegue la ricerca tramite la funzione asincrona loadOptions
    async performSearch(query) {
      const trimmedQuery = query.trim()
      if (trimmedQuery.length < this.minSearchLength) {
        this.options = []
        return
      }
      this.isLoading = true
      this.$emit('search', trimmedQuery)
      try {
        const results = await this.loadOptions(trimmedQuery)
        this.options = Array.isArray(results) ? results : []
        this.$emit('load-options', { query: trimmedQuery, results: this.options })
      } catch {
        this.options = []
        this.showDropdown = false
      } finally {
        this.isLoading = false
      }
    },

    // Seleziona un elemento, aggiungendolo nell’array selezionati
    selectItem(item) {
      if (this.isSelected(item) || this.isDisabled(item)) return
      if (!this.multiple) this.selectedItems = []
      this.selectedItems.push(item)
      this.updateModelValue()
      this.$emit('select', item)
      if (this.clearSearchOnSelect) this.searchQuery = ''
      if (!this.keepOpen) this.closeDropdown()
      else this.options = this.options.filter(opt => this.getItemKey(opt) !== this.getItemKey(item))
      this.$nextTick(() => this.$refs.searchInput?.focus())
    },

    // Rimuove un elemento selezionato
    removeItem(item) {
      const i = this.selectedItems.findIndex(sel => this.getItemKey(sel) === this.getItemKey(item))
      if (i > -1) {
        this.selectedItems.splice(i, 1)
        this.updateModelValue()
        this.$emit('remove', item)
      }
    },

    // Aggiorna il valore legato al v-model esterno
    updateModelValue() {
      this.$emit('update:modelValue', [...this.selectedItems])
    },

    // Verifica se elemento è selezionato
    isSelected(item) {
      return this.selectedItems.some(sel => this.getItemKey(sel) === this.getItemKey(item))
    },

    // Verifica se elemento è disabilitato
    isDisabled(item) {
      return item && typeof item === 'object' ? !!item[this.optionDisabled] : false
    },

    // Ottiene la chiave univoca di un elemento
    getItemKey(item) {
      return item && typeof item === 'object'
        ? item[this.optionValue] ?? item.id ?? JSON.stringify(item)
        : item
    },

    // Ottiene il testo da mostrare per un elemento
    getDisplayText(item) {
      return item && typeof item === 'object'
        ? item[this.optionLabel] ?? item.name ?? item.title ?? String(item)
        : String(item)
    },

    // Naviga nell’elenco opzioni con tastiera
    navigateOptions(direction) {
      if (!this.showDropdown || !this.filteredOptions.length) return
      const newIndex = this.highlightedIndex + direction
      if (newIndex >= 0 && newIndex < this.filteredOptions.length) {
        this.highlightedIndex = newIndex
        this.scrollToHighlighted()
      }
    },

    // Seleziona l’opzione evidenziata da tastiera
    selectHighlighted() {
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredOptions.length)
        this.selectItem(this.filteredOptions[this.highlightedIndex])
    },

    // Scrolla la lista per far vedere l’elemento evidenziato
    scrollToHighlighted() {
      this.$nextTick(() => {
        const el = this.$refs.optionsList?.children?.[this.highlightedIndex]
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  }
}
</script>

<style scoped>
.multi-select-wrapper {
  position: relative;
  width: 100%;
}

.dropdown-wrapper {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px; 
  position: absolute;
  left: 0;
  right: 0; 

  z-index: 1000;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
/*   max-height: 300px;
 overflow: hidden; */

    z-index: 5000;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  padding:8px;
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.selected-items {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  margin-bottom: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px;  
  align-items: center;
}

.selected-items-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 40px;
  width: 100%
}

.selected-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.selected-item-expand {
  flex-grow: 1;
}

.selected-item-content {
  margin-right: 6px;
}

.remove-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 12px;
  transition: color 0.2s ease;
}

.remove-button:hover {
  color: #ef4444;
}

.dropdown {
  margin-top: 4px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.option-item {
  padding: 4px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item:hover,
.option-item.highlighted {
  background-color: #f9fafb;
}

.option-item.selected {
  background-color: #e0f2fe;
  color: #0369a1;
}

.option-item.disabled {
  color: #9ca3af;
  cursor: not-allowed;
  background-color: #f9fafb;
}

.option-content {
  display: block;
  width: 100%;
}

.no-results {
  padding: 12px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 4px;
}

.dropdown-arrow {
  font-size: 150%;
  margin-left: auto;
  color: var(--color-text-secondary);
  transition: transform var(--duration-fast) var(--ease-standard);
}

.dropdown-arrow--active {
  transform: rotate(180deg);
}

/* Loading spinner */
.options-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
  gap: 8px;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid gray;
  border-radius: 50%;
  border-top-color: blue;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsività */
@media (max-width: 640px) {
  .selected-items {
    gap: 4px;
  }
  
  .selected-item {
    font-size: 12px;
    padding: 2px 6px;
  }
  
  .search-input {
    font-size: 16px; /* Previene zoom su iOS */
  }
}
</style>
