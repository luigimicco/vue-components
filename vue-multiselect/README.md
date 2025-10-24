# Vue 3 MultiSelect Component

Un componente MultiSelect avanzato per Vue 3 con ricerca asincrona, supporto per selezione singola/multipla e navigazione da tastiera.

## Caratteristiche

- ✅ **Ricerca asincrona** con funzione `loadOptions` personalizzabile
- ✅ **Selezione multipla e singola** configurabile 
- ✅ **Navigazione da tastiera** (frecce, Enter, Esc)
- ✅ **Slot personalizzabili** per elementi selezionati e opzioni
- ✅ **Debouncing** integrato per ottimizzare le chiamate API
- ✅ **Click outside** per chiudere il dropdown
- ✅ **Loading states** e gestione errori
- ✅ **Accessibilità** e responsività mobile
- ✅ **TypeScript friendly** con emissioni tipizzate

## Installazione

```bash
npm install vue3-multiselect-async
# oppure
yarn add vue3-multiselect-async
```

## Utilizzo Base

```vue
<template>
  <MultiSelect
    v-model="selectedItems"
    :load-options="loadUsers"
    option-label="name"
    option-value="id"
    search-placeholder="Cerca utenti..."
  />
</template>

<script>
import MultiSelect from 'vue3-multiselect-async'

export default {
  components: { MultiSelect },
  data() {
    return {
      selectedItems: []
    }
  },
  methods: {
    async loadUsers(query) {
      const response = await fetch(`/api/users?search=${query}`)
      return response.json()
    }
  }
}
</script>
```

## Proprietà (Props)

| Proprietà | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `modelValue` | `Array` | `[]` | Array degli elementi selezionati (v-model) |
| `multiple` | `Boolean` | `true` | Abilita selezione multipla |
| `loadOptions` | `Function` | **required** | Funzione asincrona per caricare opzioni `(query: string) => Promise<Array>` |
| `optionLabel` | `String` | `'label'` | Proprietà da usare come etichetta visualizzata |
| `optionValue` | `String` | `'value'` | Proprietà da usare come valore univoco |
| `optionDisabled` | `String` | `'disabled'` | Proprietà per disabilitare opzioni |
| `searchPlaceholder` | `String` | `'Cerca...'` | Placeholder del campo ricerca |
| `debounceDelay` | `Number` | `300` | Ritardo debounce in millisecondi |
| `minSearchLength` | `Number` | `1` | Caratteri minimi per iniziare la ricerca |
| `maxOptions` | `Number` | `100` | Numero massimo di opzioni da mostrare |
| `keepOpen` | `Boolean` | `false` | Mantiene aperto il dropdown dopo la selezione |
| `clearSearchOnSelect` | `Boolean` | `false` | Pulisce il campo ricerca dopo la selezione |

## Eventi

| Evento | Parametri | Descrizione |
|--------|-----------|-------------|
| `update:modelValue` | `Array` | Emesso quando cambia la selezione |
| `search` | `String` | Emesso quando l'utente digita nella ricerca |
| `select` | `Object` | Emesso quando viene selezionato un elemento |
| `remove` | `Object` | Emesso quando viene rimosso un elemento |
| `load-options` | `{query: String, results: Array}` | Emesso dopo il caricamento delle opzioni |
| `open` | - | Emesso all'apertura del dropdown |
| `close` | - | Emesso alla chiusura del dropdown |

## Slot

### `selected-item` (modalità multipla)
Personalizza la visualizzazione degli elementi selezionati:

```vue
<MultiSelect v-model="selected" :load-options="loadOptions">
  <template #selected-item="{ item, remove }">
    <div class="custom-tag">
      <img :src="item.avatar" class="avatar" />
      {{ item.name }}
      <button @click="remove(item)">×</button>
    </div>
  </template>
</MultiSelect>
```

### `selected-item-single` (modalità singola)
Per la modalità selezione singola:

```vue
<MultiSelect v-model="selected" :multiple="false" :load-options="loadOptions">
  <template #selected-item-single="{ item }">
    <strong>{{ item.title }}</strong>
  </template>
</MultiSelect>
```

### `option`
Personalizza le opzioni nel dropdown:

```vue
<MultiSelect v-model="selected" :load-options="loadOptions">
  <template #option="{ option, selected }">
    <div class="custom-option" :class="{ active: selected }">
      <img :src="option.avatar" />
      <div>
        <div class="name">{{ option.name }}</div>
        <div class="email">{{ option.email }}</div>
      </div>
    </div>
  </template>
</MultiSelect>
```

### `no-results`
Messaggio quando non ci sono risultati:

```vue
<MultiSelect v-model="selected" :load-options="loadOptions">
  <template #no-results>
    <div class="custom-no-results">
      <i class="icon-search"></i>
      Nessun risultato trovato
    </div>
  </template>
</MultiSelect>
```

## Esempi Avanzati

### Selezione Singola con API

```vue
<template>
  <MultiSelect
    v-model="selectedUser"
    :multiple="false"
    :load-options="searchUsers"
    option-label="fullName"
    option-value="id"
    :min-search-length="2"
    :debounce-delay="500"
    search-placeholder="Cerca un utente..."
    @select="onUserSelect"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedUser: []
    }
  },
  methods: {
    async searchUsers(query) {
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        return data.users || []
      } catch (error) {
        console.error('Errore ricerca utenti:', error)
        return []
      }
    },
    onUserSelect(user) {
      console.log('Utente selezionato:', user)
    }
  }
}
</script>
```

### Con Validazione e Gestione Errori

```vue
<template>
  <div>
    <MultiSelect
      v-model="selectedTags"
      :load-options="loadTags"
      option-label="name"
      option-value="id"
      option-disabled="inactive"
      :max-options="50"
      multiple
      @load-options="onLoadOptions"
    />
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTags: [],
      error: null
    }
  },
  methods: {
    async loadTags(query) {
      this.error = null
      try {
        const response = await fetch(`/api/tags?search=${query}`)
        if (!response.ok) throw new Error('Errore nel caricamento')
        return await response.json()
      } catch (err) {
        this.error = 'Impossibile caricare i tag'
        throw err
      }
    },
    onLoadOptions({ query, results }) {
      console.log(`Caricati ${results.length} risultati per "${query}"`)
    }
  }
}
</script>
```

## Navigazione da Tastiera

- **Freccia Su/Giù**: Naviga tra le opzioni
- **Enter**: Seleziona l'opzione evidenziata  
- **Esc**: Chiude il dropdown
- **Tab**: Esce dal componente

## Styling e CSS

Il componente include stili CSS scoped. Per personalizzazioni avanzate, puoi sovrascrivere le classi CSS:

```css
/* Personalizza il wrapper principale */
.multi-select-wrapper {
  /* tuoi stili */
}

/* Personalizza gli elementi selezionati */
.selected-item {
  background-color: #e3f2fd;
  border-radius: 4px;
  padding: 4px 8px;
}

/* Personalizza le opzioni */
.option-item:hover {
  background-color: #f5f5f5;
}
```

## Compatibilità

- **Vue 3.0+**
- **Browsers moderni** (supporta ES6+)
- **TypeScript** supportato
- **SSR/Nuxt** compatibile

## Sviluppo

```bash
# Clona il repository
git clone https://github.com/tu-username/vue3-multiselect-async.git

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Run tests
npm run test
```

## Contribuire

I contributi sono benvenuti! Per favore:

1. Fai fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Distribuito sotto licenza MIT.

## Supporto

Se trovi questo progetto utile, considera di dargli una ⭐ su GitHub!

Per bug report e richieste di feature, apri una [issue](https://github.com/tu-username/vue3-multiselect-async/issues).

