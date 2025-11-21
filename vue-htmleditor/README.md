# Vue HTML Editor

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Editor WYSIWYG moderno e completo per Vue 3, con architettura modulare e componibile.

---

## 🚀 Funzionalità

- **Formattazione**: Bold, Italic, Underline, Strikethrough
- **Testo**: Apice/Pedice, Maiuscolo/Minuscolo, Font, Dimensione, Colori
- **Layout**: Allineamento (sinistra, centro, destra, giustificato), Titoli H1-H6
- **Liste**: Puntate/Numerate, Rientro
- **Link**: Inserimento link ipertestuali
- **Placeholder**: Dinamici a due livelli (opzionale)
- **Modalità**: HTML source view, Readonly
- **Shortcut**: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline)

---

## 📦 Installazione

```bash
# Copia la cartella vue-htmleditor nel tuo progetto
```

### Uso Base

```vue
<template>
  <HtmlEditor v-model="content" :placeholders="placeholders" />
</template>

<script>
import HtmlEditor from './vue-htmleditor/HtmlEditor.vue';

export default {
  components: { HtmlEditor },
  data() {
    return {
      content: '<p>Testo iniziale</p>',
      placeholders: [
        {
          label: "Dati utente",
          items: [
            { label: "Nome", value: "[[nome]]" },
            { label: "Cognome", value: "[[cognome]]" }
          ]
        }
      ]
    };
  }
};
</script>
```

---

## 🛠️ Props

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `modelValue` | String | `''` | Contenuto HTML (v-model) |
| `placeholders` | Array | `[]` | Placeholder dinamici |
| `readonly` | Boolean | `false` | Modalità sola lettura |
| `editorStyle` | String | `''` | Stili CSS custom |
| `toolbar` | Array | `[...]` | Strumenti da mostrare |

### Toolbar Options

```javascript
toolbar: [
  'font',        // Selettore font
  'heading',     // Titoli H1-H6
  'fontsize',    // Dimensione font
  'color',       // Colori testo/sfondo
  'bold',        // Grassetto
  'italic',      // Corsivo
  'underline',   // Sottolineato
  'strikethrough', // Barrato
  'superscript', // Apice
  'subscript',   // Pedice
  'switchcase',  // Maiuscolo/Minuscolo
  'alignment',   // Allineamento
  'clear',       // Rimuovi formattazione
  'list',        // Liste
  'indent',      // Rientro
  'link',        // Link
  'placeholder', // Placeholder
  'html'         // Vista HTML
]
```

---

## 📡 Eventi

| Evento | Payload | Descrizione |
|--------|---------|-------------|
| `update:modelValue` | `String` | Contenuto modificato |
| `show-notification` | `String` | Notifica da mostrare |
| `show-message` | `Object` | Messaggio strutturato |
| `request-link` | `Function` | Richiesta URL per link |

---

## 🏗️ Architettura

Il componente è strutturato in modo modulare per massima manutenibilità:

```
vue-htmleditor/
├── HtmlEditor.vue          # Componente principale
├── components/
│   ├── EditorToolbar.vue   # Barra strumenti
│   ├── EditorContent.vue   # Area editabile
│   └── HtmlSourceView.vue  # Vista HTML
└── composables/
    ├── useSelection.js     # Gestione selezione
    ├── useFormatting.js    # Formattazione testo
    ├── useTextAlignment.js # Allineamento
    ├── useListManagement.js # Liste
    └── useLinkManagement.js # Link
```

### Composables

I composables possono essere riutilizzati in altri progetti:

```javascript
import { useFormatting } from './vue-htmleditor/composables/useFormatting';

const { applyFont, applyColor, formatText } = useFormatting(emit);
```

**Disponibili:**
- `useSelection()` - Salva/ripristina selezione
- `useFormatting(emit)` - Formattazione completa
- `useTextAlignment()` - Allineamento e heading
- `useListManagement()` - Liste e indentazione
- `useLinkManagement(emit)` - Gestione link

---

## 🎯 Esempi Avanzati

### Modalità Readonly

```vue
<HtmlEditor v-model="content" :readonly="true" />
```

### Toolbar Personalizzata

```vue
<HtmlEditor 
  v-model="content" 
  :toolbar="['bold', 'italic', 'underline', 'color']"
/>
```

### Gestione Link Custom

```vue
<template>
  <HtmlEditor 
    v-model="content" 
    @request-link="handleLinkRequest"
  />
</template>

<script>
export default {
  methods: {
    handleLinkRequest(callback) {
      // Mostra dialog custom
      const url = prompt('Inserisci URL:');
      callback(url);
    }
  }
};
</script>
```

### Accesso Programmatico

```javascript
// Ottenere contenuto
const html = this.$refs.editor.getContent();

// Reset editor
this.$refs.editor.resetContent();
```

---

## 🎨 Personalizzazione Stili

```vue
<HtmlEditor 
  v-model="content"
  editor-style="min-height: 400px; font-family: 'Georgia';"
/>
```

Oppure con CSS globale:

```css
.html-editor-container {
  border: 2px solid #3b82f6;
}

.editor {
  min-height: 500px;
  font-size: 16px;
}
```

---

## 🧪 Testing

I composables sono facilmente testabili:

```javascript
import { useFormatting } from './composables/useFormatting';

describe('useFormatting', () => {
  it('should apply bold formatting', () => {
    const { formatText } = useFormatting();
    // Test logic
  });
});
```

---

## 📊 Performance

- **Bundle size**: ~15KB (gzipped)
- **Rendering**: Ottimizzato con composables
- **Memory**: Cleanup automatico eventi

---

## 🖥 Compatibilità

- ✅ Chrome, Firefox, Edge, Safari
- ✅ Opera, Brave
- ✅ Vue 3.x

---

## 🤝 Contribuire

1. Mantieni composables puri (no side effects)
2. Documenta con JSDoc
3. Aggiungi test per nuove funzionalità
4. Mantieni file sotto 300 righe

---

## 📄 Licenza

MIT License

---

**Sviluppato con ❤️ per Vue 3**
