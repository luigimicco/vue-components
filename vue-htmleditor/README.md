# Vue HTML Editor Avanzato

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Editor WYSIWYG moderno e completo per Vue 3, con toolbar ricca e interattiva, progettato per integrarsi rapidamente in qualsiasi applicazione SPA o gestionale.

---

## 🚀 Funzionalità Principali

- **Bold, Italic, Underline, ~Strikethrough~**
- Apice (X²) e Pedice (H₂)
- Maiuscolo/minuscolo
- Selettore font e dimensione font personalizzata
- Color picker testo e evidenziatore/sfondo testo
- Allineamento: sinistra, centro, destra, giustificato
- Selettore Titoli H1–H6
- Liste puntate/numerate
- Rientro sinistra/destra
- Link ipertestuali
- Placeholder dinamici a due livelli (opzionale)
- Pulizia/rimozione avanzata di ogni formattazione
- Modifica codice HTML diretta
- Modalità di sola lettura (readonly)
- Toolbar responsive e moderna
- Anteprima real-time
- Supporto completo a tastiera (shortcut: **bold**, _italic_, __underline__)

---

## 📦 Installazione

**1. Copia il file `HtmlEditor.vue` nella cartella `components`** del tuo progetto Vue 3

**2. Importa il componente** dove ti serve:

```

<template>
  <HtmlEditor
    ref="editor"
    :placeholders="placeholderData"
    :readonly="isReadonly"
  />
</template>
<script>
import HtmlEditor from './components/HtmlEditor.vue';

export default {
  components: { HtmlEditor },
  data() {
    return {
      placeholderData: [
        {
          label: "Dati utente",
          items: [
            { label: "Nome", value: "[[nome]]" },
            { label: "Cognome", value: "[[cognome]]" }
          ]
        }
      ],
      isReadonly: false
    }
  }
};
</script>
```

---

## 🛠️ Props

| Prop           | Tipo    | Default | Descrizione                                            |
|----------------|---------|---------|--------------------------------------------------------|
| `placeholders` | Array   | `[]`    | Placeholder dinamici a due livelli per inserimento rapido |
| `readonly`     | Boolean | `false` | Blocca ogni editing e nasconde la toolbar              |

---

## 🎛️ Toolbar - Pulsanti Supportati

- **B** | Grassetto (Ctrl+B)
- **I** | Corsivo (Ctrl+I)
- **U** | Sottolineato (Ctrl+U)
- **S** | Barrato (strikethrough)
- **X²** | Apice
- **H₂** | Pedice
- **Aa** | Toggle maiuscolo/minuscolo
- **Font** | Selettore tra Arial, Times New Roman, Courier New
- **Dimensione** | Dimensione font personalizzata
- **Colore testo** | Picker colore testo
- **🖍** | Evidenziatore/sfondo
- **⬅️ ↔️ ➡️ ⬌** | Allinea a sinistra / centro / destra / giustificato
- **H1–H6** | Selettore titoli
- **≡ ≣** | Liste puntate e numerate
- **⬅ ➡** | Rientro sinistra/destra
- **🔗** | Inserisci link nel testo selezionato
- **🧹** | Rimuove ogni formattazione (reset stile)
- **</>** | Toggle modalità codice HTML
- **Placeholder** | Menu a gruppi (se configurato)

---

## 🎨 Personalizzazione Rapida

- **Colore/evidenziatore:** seleziona testo → scegli colore
- **Maiuscolo/minuscolo:** seleziona testo → clic Aa
- **Dimensione font:** seleziona testo → scegli taglia
- **Allineamento:** posiziona o seleziona paragrafo → clicca direzione

---

## 📋 API e Accesso Programmatico

- `this.$refs.editor.content` → contenuto HTML corrente
- `this.$refs.editor.htmlMode` → in modalita' codice?
- `this.$refs.editor.readonly` → readonly attivo?

Esempio reset:
```

resetEditor() {
  this.$refs.editor.content = "<p>Testo qui...</p>";
  this.$refs.editor.$refs.editable.innerHTML = "<p>Testo qui...</p>";
  this.$refs.editor.htmlMode = false;
  this.$refs.editor.lastSelection = null;
}

```

---

## 🧩 Esempi extra

**Selettore placeholder gerarchico:**
```

[
  {
    label: "Dati Contratto",
    items: [
      {label: "Data", value: "[[data_contratto]]"},
      {label: "Importo", value: "[[importo_contratto]]"}
    ]
  }
]

```
Tutti i placeholder possono essere formattati come normale testo.

---

## 🖥 Compatibilità browser

- Chrome, Firefox, Edge, Safari — completamente supportati
- Opera, Brave ecc. — nessuna limitazione nota

---

## 📄 Licenza

MIT License

---

**Sviluppato con ❤️ in Vue 3**  
Per suggerimenti, fork, bug o richieste: crea una Issue o una Pull Request!



