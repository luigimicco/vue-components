# CanvasPad
Un componente Vue 3 per disegnare e firmare su canvas con supporto touch e mouse.

## Caratteristiche

- ✅ Disegno con mouse e touch
- ✅ Supporto v-model per binding bidirezionale
- ✅ Slot personalizzabili per modalità e strumenti
- ✅ Validazione automatica del riempimento canvas
- ✅ Supporto per testo con font Google personalizzati
- ✅ Sfondo personalizzabile
- ✅ Responsive e accessibile

## Installazione

1. Copia il componente nel tuo progetto Vue 3
2. Installa lodash se non già presente:
```bash
npm install lodash
```

## Proprietà (Props)

| Proprietà | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `modelValue` | String | `null` | Valore v-model contenente l'immagine in formato base64 |
| `width` | Number | `600` | Larghezza del canvas in pixel |
| `height` | Number | `400` | Altezza del canvas in pixel |
| `backgroundColor` | String | `''` | Colore di sfondo del canvas (es: '#f0f0f0') |
| `strokeWidth` | Number | `3` | Spessore del tratto (1-50 pixel) |

## Eventi

| Evento | Payload | Descrizione |
|--------|---------|-------------|
| `update:modelValue` | String/null | Emesso quando l'immagine cambia (compatibilità v-model) |
| `clear` | - | Emesso quando il canvas viene pulito |

## Slot

| Nome | Descrizione |
|------|-------------|
| `mode` | Slot per inserire controlli della modalità (es: penna/testo) |
| `tools` | Slot per inserire strumenti aggiuntivi (es: bottoni pulisci/salva) |

## Esempio Base

```vue
<template>
  <div>
    <CanvasPad 
      v-model="signature"
      :width="500"
      :height="300"
      :stroke-width="2"
      background-color="#fafafa"
      @clear="handleClear"
    />
    
    <div v-if="signature">
      <h3>Anteprima:</h3>
      <img :src="signature" alt="Firma" style="max-width: 250px;" />
    </div>
  </div>
</template>

<script>
import CanvasPad from './components/CanvasPad.vue'

export default {
  components: {
    CanvasPad
  },
  data() {
    return {
      signature: null
    }
  },
  methods: {
    handleClear() {
      console.log('Canvas pulito!')
    }
  }
}
</script>
```

## Esempio con Slot

```vue
<template>
  <CanvasPad 
    v-model="signature"
    :width="600"
    :height="400"
  >
    <!-- Slot mode per controlli modalità -->
    <template #mode>
      <div class="mode-controls">
        <button @click="setDrawMode" :class="{active: mode === 'draw'}">
          ✏️ Disegna
        </button>
        <button @click="setTextMode" :class="{active: mode === 'text'}">
          📝 Testo
        </button>
      </div>
    </template>

    <!-- Slot tools per strumenti -->
    <template #tools>
      <div class="tools">
        <button @click="clearCanvas" class="clear-btn">
          🗑️ Pulisci
        </button>
        <button @click="downloadImage" :disabled="!signature" class="download-btn">
          💾 Scarica
        </button>
      </div>
    </template>
  </CanvasPad>
</template>

<script>
import CanvasPad from './components/CanvasPad.vue'

export default {
  components: {
    CanvasPad
  },
  data() {
    return {
      signature: null,
      mode: 'draw'
    }
  },
  methods: {
    setDrawMode() {
      this.mode = 'draw'
    },
    setTextMode() {
      this.mode = 'text'
    },
    clearCanvas() {
      this.$refs.canvasPad.clearCanvas()
    },
    downloadImage() {
      if (this.signature) {
        const link = document.createElement('a')
        link.download = 'signature.png'
        link.href = this.signature
        link.click()
      }
    }
  }
}
</script>

<style scoped>
.mode-controls {
  margin-bottom: 10px;
}

.mode-controls button {
  margin: 0 5px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.mode-controls button.active {
  background: #007bff;
  color: white;
}

.tools {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 10px;
}

.tools button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.clear-btn:hover {
  background: #dc3545;
  color: white;
}

.download-btn:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## Metodi Pubblici

Puoi accedere ai seguenti metodi tramite template ref:

```vue
<template>
  <CanvasPad ref="canvasPad" v-model="signature" />
</template>

<script>
export default {
  methods: {
    // Pulisce completamente il canvas
    clearCanvas() {
      this.$refs.canvasPad.clearCanvas()
    },
    
    // Ottiene l'immagine come base64
    getImageData() {
      return this.$refs.canvasPad.getImageData()
    },
    
    // Disegna testo con font personalizzato
    drawText(text, font = 'Dancing Script') {
      this.$refs.canvasPad.drawText(text, font)
    },
    
    // Ottiene la percentuale di riempimento
    getFillPercentage() {
      return this.$refs.canvasPad.getFillPercentage()
    }
  }
}
</script>
```

## Font Supportati

Il componente include automaticamente i seguenti font Google:
- Allura
- Homemade Apple
- Cedarville Cursive
- Great Vibes
- Dancing Script
- Satisfy
- Carattere
- Cookie
- Yellowtail
- Alex Brush
- Mr Dafoe
- Sacramento

## Validazione Automatica

Il componente valida automaticamente il contenuto del canvas:
- Se il riempimento è superiore al 2% (minPercent), l'immagine viene salvata in v-model
- Se il riempimento è inferiore, v-model viene impostato a `null`
- Questo previene il salvataggio di canvas "vuoti" o con contenuto minimo

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile (Android 6+)

## Dipendenze

- Vue 3
- lodash (per il debounce)

## Licenza

MIT License
