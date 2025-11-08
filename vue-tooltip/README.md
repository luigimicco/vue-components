# Tooltip Directive per Vue 3

---
Una direttiva custom per Vue 3 che aggiunge tooltip dinamici e ben posizionati a qualsiasi elemento. Il testo del tooltip si aggiorna automaticamente in tempo reale quando il valore binding cambia.

## Indice

1. [Caratteristiche principali](#caratteristiche-principali)
2. [Installazione](#installazione)
3. [Utilizzo](#utilizzo)
4. [Opzioni e personalizzazione](#opzioni-e-personalizzazione)
5. [Esempio completo](#esempio-completo)
6. [Note tecniche](#note-tecniche)

## Caratteristiche principali

---
- Tooltip sempre visibile sopra gli altri elementi (alto z-index).
- Stile personalizzato (colore, bordo, ombra, freccia di posizionamento).
- Posizionamento automatico intelligente (top, right, bottom, left).
- Aggiornamento in tempo reale del testo via `binding.value`.
- Supporto per argomenti di posizione (`v-tooltip:right`, ecc.).

## Installazione

---
Copia il file `tooltip.js` nella cartella delle direttive del tuo progetto Vue.

```
import tooltip from './tooltip.js';

export default {
  directives: {
    tooltip,
  },
};

```

## Utilizzo

---
Aggiungi la direttiva a qualsiasi elemento nel template Vue.

```
<button v-tooltip="'Testo del tooltip dinamico'">
  Hover me!
</button>
```

Per aggiornare in tempo reale, usa una variabile reattiva:

```
<button v-tooltip="descrizioneTooltip">
  Hover me!
</button>
```

## Opzioni e personalizzazione

---
- **Testo dinamico:** basta cambiare la variabile associata per vedere il testo aggiornarsi.
- **Posizione:** puoi specificare la posizione preferita come argomento:  
  `v-tooltip:right`, `v-tooltip:bottom`, `v-tooltip:left`, `v-tooltip:top`  
- **Stile:** puoi modificare la direttiva per aggiungere tema, colori, animazioni, ecc.

## Esempio completo

---
```
<template>
  <div>
    <input
      v-model="descrizioneTooltip"
      placeholder="Scrivi qui il tooltip testo"
    >
    <button v-tooltip="descrizioneTooltip">
      Hover for tooltip
    </button>
  </div>
</template>
<script>
import tooltip from './tooltip.js';

export default {
  directives: {
    tooltip,
  },
  data() {
    return {
      descrizioneTooltip: 'Tooltip iniziale',
    };
  },
};
</script>
```

## Note tecniche

---
- Il tooltip viene creato, posizionato e rimosso automaticamente dal DOM.
- Per l’aggiornamento live, la direttiva implementa anche il metodo `updated`, che aggiorna il testo ogni volta che cambia il valore associato.

