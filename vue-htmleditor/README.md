# Vue HTML Editor

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](https://www.typescriptlang.org/)

Un editor HTML WYSIWYG moderno e completo per Vue 3, costruito con Selection e Range API native del browser (senza `document.execCommand` deprecato).

---

## 🚀 Caratteristiche

### ✨ Formattazione Testo
- **Grassetto**, **Corsivo**, **Sottolineato**
- Scorciatoie da tastiera: `Ctrl+B`, `Ctrl+I`, `Ctrl+U`
- Rimozione completa della formattazione con un click

### 🎨 Stili Avanzati
- Selettore font (Arial, Times New Roman, Courier New)
- Color picker per il colore del testo
- Font coerenti tra editor e anteprima

### 📄 Struttura Documento
- Titoli H1-H6 con menu a tendina
- Liste puntate e numerate
- Gestione rientri (aumenta/riduci)
- Link esterni con `target="_blank"`

### 🔧 Funzionalità Avanzate
- **Modalità HTML** per editing diretto del codice
- **Modalità di sola lettura** per visualizzazione
- **Anteprima in tempo reale**
- **Placeholder personalizzabili** gerarchici a due livelli
- Pulizia automatica dei tag vuoti
- Manipolazione DOM diretta con API moderne

### 🎯 Design Moderno
- Toolbar elegante con separatori visivi
- Effetti hover e transizioni smooth
- Responsive design
- Icone intuitive e tooltips

---

## 📦 Installazione

### Download Diretto
1. Scarica il file `HtmlEditor.vue` dalla cartella `src/components/`
2. Copialo nella tua cartella `components`
3. Importa e usa il componente

### NPM (quando sarà pubblicato)
```

npm install vue-html-editor

```

---

## 🛠️ Utilizzo Rapido

### Esempio Base
```

<template>
  <div>
    <HtmlEditor ref="editor" />
    <button @click="getContent">Ottieni Contenuto</button>
  </div>
</template>
<script>
import HtmlEditor from './components/HtmlEditor.vue';

export default {
  components: { HtmlEditor },
  methods: {
    getContent() {
      console.log(this.$refs.editor.content);
    }
  }
}
</script>
```

### Esempio con Placeholder
```

<template>
  <HtmlEditor :placeholders="myPlaceholders" />
</template>
<script>
import HtmlEditor from './components/HtmlEditor.vue';

export default {
  components: { HtmlEditor },
  data() {
    return {
      myPlaceholders: [
        {
          label: "Anagrafica",
          items: [
            { label: "nome", value: "[[nome]]" },
            { label: "cognome", value: "[[cognome]]" }
          ]
        },
        {
          label: "Contratto",
          items: [
            { label: "data", value: "[[data_contratto]]" },
            { label: "importo", value: "[[importo_contratto]]" }
          ]
        }
      ]
    }
  }
}
</script>
```

### Modalità Sola Lettura
```

<template>
  <div>
    <HtmlEditor :readonly="true" />
    <HtmlEditor :readonly="isReadonly" />
    <button @click="isReadonly = !isReadonly">Toggle Readonly</button>
  </div>
</template>
<script>
export default {
  data() {
    return { isReadonly: false }
  }
}
</script>
```

---

## 📋 Props API

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `placeholders` | `Array` | `[]` | Array gerarchico di placeholder personalizzabili |
| `readonly` | `Boolean` | `false` | Imposta l'editor in modalità di sola lettura |

### Struttura Placeholder
```

[
  {
    label: "Nome Gruppo",
    items: [
      {
        label: "Nome Campo",
        value: "[[placeholder]]"
      }
    ]
  }
]

```

---

## 🎮 API del Componente

### Proprietà Accessibili (via ref)
```

// Accesso al contenuto
const htmlContent = this.\$refs.editor.content;

// Impostazione contenuto

this.$refs.editor.content = "<p>Nuovo contenuto</p>";

this.$refs.editor.$refs.editable.innerHTML = "<p>Nuovo contenuto</p>";

// Verifica modalità
const isHtmlMode = this.$refs.editor.htmlMode;
const isReadonly = this.$refs.editor.readonly;

```

### Metodi Utili
```

// Reset completo dell'editor
resetEditor() {
  const editor = this.\$refs.editor;
  editor.content = "<p>Scrivi qui...</p>";
  editor.$refs.editable.innerHTML = "<p>Scrivi qui...</p>";
  editor.htmlMode = false;
  editor.lastSelection = null;
}

// Copia contenuto negli appunti
async copyContent() {
  try {
    await navigator.clipboard.writeText(this.\$refs.editor.content);
    alert('Contenuto copiato!');
  } catch (err) {
    console.error('Errore copia:', err);
  }
}

```

---

## 🎯 Toolbar - Funzionalità

### Formattazione
| Pulsante | Funzione | Scorciatoia |
|----------|----------|-------------|
| **B** | Grassetto | `Ctrl+B` |
| **I** | Corsivo | `Ctrl+I` |
| **U** | Sottolineato | `Ctrl+U` |

### Stili
- **Font Selector**: Arial, Times New Roman, Courier New
- **Color Picker**: Selettore colore

### Azioni
| Pulsante | Funzione |
|----------|----------|
| 🧹 | Rimuove **tutta** la formattazione |
| `</>` | Attiva/disattiva modalità HTML |

### Struttura Documento
- **Titoli H1–H6**
- **≡**: Elenco puntato
- **≣**: Elenco numerato  
- **⬅ ➡**: Rientri

### Inserimenti
- **🔗**: Aggiunge un link
- **Placeholder**: Selettore gerarchico (se configurato)

---

## 🔧 Personalizzazione

### Font Disponibili
```

<select v-model="selectedFont" @change="applyFont">
<option value="Arial">Arial</option>
<option value="Helvetica">Helvetica</option>
<option value="Verdana">Verdana</option>
</select>

```

### Altezza Personalizzata
```

<HtmlEditor style="height: 500px;" />
```

### Colori Toolbar
```

<style>
.toolbar {
  background: linear-gradient(to bottom, #yourcolor1, #yourcolor2);
}
</style>
```

---

## 🧩 Esempi Avanzati

### Editor con Validazione
```

<template>
  <HtmlEditor 
    ref="editor" 
    @input="validateContent"
    :readonly="!isValid"
  />
  <div v-if="!isValid" class="error">
    ⚠️ Contenuto non valido
  </div>
</template>
<script>
export default {
  data() {
    return { isValid: true }
  },
  methods: {
    validateContent() {
      const content = this.$refs.editor.content;
      this.isValid = content.length > 10;
    }
  }
}
</script>
```

### Multi-Istanza
```

<template>
  <div>
    <HtmlEditor ref="editor1" :readonly="false" />
    <HtmlEditor ref="editor2" :readonly="true" />
  </div>
</template>
```

---

## 📊 Compatibilità Browser

| Browser | Versione | Supporto |
|----------|-----------|----------|
| Chrome | 80+ | ✅ |
| Firefox | 75+ | ✅ |
| Safari | 13+ | ✅ |
| Edge | 80+ | ✅ |

---

## 🤝 Contribuire

1. Esegui il fork
2. Crea un branch feature (`git checkout -b feature/nuova-funzionalita`)
3. Commit (`git commit -m 'Aggiunta nuova funzionalità'`)
4. Push (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

---

## 🐛 Segnalare un Bug
Apri una [Issue](https://github.com/yourusername/vue-html-editor/issues) con:
- Descrizione del problema
- Passaggi per riprodurlo
- Screenshot (se utile)
- Informazioni su browser e versione di Vue

---

## 📄 Licenza

**MIT License**  
Vedi il file `LICENSE` per i dettagli.


