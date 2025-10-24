<template>
  <div class="container">
    <div v-if="$slots.mode" >
      <slot name="mode"></slot>
    </div>

    <div class="canvas">
      <canvas
        ref="canvas"
        :width="width"
        :height="height"
        :style="{  touchAction: 'none', border: '1px solid #ddd', borderRadius: '5px' }"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="startDrawingTouch"
        @touchmove="drawTouch"
        @touchend="stopDrawing"
      ></canvas>
      <div v-if="$slots.tools" >
          <slot name="tools"></slot>
      </div>
    </div>

<!--     <div v-if="imageUrl" style="margin-top:10px;">
      <img :src="imageUrl" :width="width/2" :height="height/2" alt="Disegno salvato" />
    </div> -->
  </div>
</template>

<script>
import { debounce } from 'lodash';

export default {
  emits: ["update:modelValue", "clear"],
  name: 'CanvasPad',
  props: {
    modelValue: { type: String, default: null },    
    width: { type: Number, default: 600 },
    height: { type: Number, default: 400 },
    backgroundColor: { type: String, default: '' },
    strokeWidth: { type: Number, default: 3, validator: v => v > 0 && v <= 50 }
  },
  data() {
    return {
      image: this.modelValue, // inizializza col valore

      ctx: null,
      drawing: false,
      lastPoint: { x: 0, y: 0 },
      currentColor: '#000',
      imageUrl: null,
      backgroundPixel : 0,
      polling: null,
      percent: 0,
      minPercent: 2,
    };
  },

  async mounted() {
    this.ctx = this.$refs.canvas.getContext('2d',{ willReadFrequently: true });
    if (this.modelValue) {
      // carica l'immagine presente nel modelValue
      var image = new Image();
      image.onload = () => { this.ctx.drawImage(image, 0, 0) }
      image.src = this.modelValue;
    } else {
      this.clearCanvas();
    }

   },
  watch: {
    backgroundColor(newColor) {
      this.clearCanvas();
    },
    modelValue(newValue) {
      this.image = newValue
    },     
  },
  created() {
    this.debouncedUpdatePercent = debounce(this.updatePercent, 300);
  },
  methods: {

    getCanvasCoords(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();

      const coords = event.touches
        ? event.touches[0]
        : event;

      return {        
        x: coords.clientX - rect.left,
        y: coords.clientY - rect.top,
      };
    },
    startDrawing(event) {
      this.drawing = true;
      const { x, y } = this.getCanvasCoords(event);
      this.lastPoint = { x, y };
    },
    startDrawingTouch(event) {
      event.preventDefault();
      this.startDrawing(event);
    },
    draw(event) {
      if (!this.drawing) return;
      const { x, y } = this.getCanvasCoords(event);
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.strokeWidth; // Usa la prop
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.lastPoint = { x, y };
    },
    drawTouch(event) {
      event.preventDefault();
      this.draw(event);
    },
    stopDrawing() {
      this.drawing = false;
      this.percent = this.getFillPercentage();
    },




    updatePercent() {
      this.percent = this.getFillPercentage()
    },

    drawText(text, font) {
      this.clearCanvas();
      this.ctx.font = `${this.height / 2.5}px "${font}", cursive`
      this.ctx.fillStyle = this.currentColor
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText(text, this.width / 2, this.height / 2)
      this.debouncedUpdatePercent();
    },



    clearCanvas() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      if (this.backgroundColor) {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
      const tempCtx = this.ctx;
      const pixelBuffer = new Uint32Array(
        tempCtx.getImageData(0, 0, this.width, this.height).data.buffer
      );
      this.backgroundPixel = pixelBuffer[0];
      this.percent = 0;
      this.image = null;
      this.$emit('update:modelValue', null) // v-model compatibilità
      this.$emit('clear')
    },

    getImageData() {
      return this.$refs.canvas.toDataURL('image/png');
    },

    getFillPercentage() {
      if ( !this.ctx) return 0;
      
      const dataUrl = this.getImageData()
      const tempCtx = this.ctx;
      const pixelBuffer = new Uint32Array(
        tempCtx.getImageData(0, 0, this.width, this.height).data.buffer
      );

      let usedPixels = 0; 
      const maxPixels = this.width * this.height;
      const limit = maxPixels * (this.minPercent + 1) / 100;
      for (let index = 0; index < pixelBuffer.length; index++) {
        if (pixelBuffer[index] !== this.backgroundPixel) usedPixels++;
        if (usedPixels > limit) break;
      }
      const percent = (usedPixels/maxPixels)*100

      if (percent >= this.minPercent) {
        this.image = dataUrl;
      } else {
        this.image = null;
      }
      this.$emit('update:modelValue', this.image); // v-model compatibilità
      return percent;

    }    
  }
};
</script>

<style lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Allura|Homemade+Apple|Cedarville+Cursive|Great+Vibes|Dancing+Script|Satisfy|Carattere|Cookie|Yellowtail|Alex+Brush|Mr+Dafoe|Sacramento&display=swap');

  .container {
    width: 100%;
    text-align: center;

  }

  .canvas {
    display: flex;
    gap: 5px;
    justify-content: center;
  }
</style>
