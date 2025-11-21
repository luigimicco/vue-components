<template>
  <div
    ref="editable"
    class="editor"
    role="textbox"
    :aria-label="readonly ? 'Editor di testo in sola lettura' : 'Editor di testo modificabile'"
    :aria-readonly="readonly"
    :aria-multiline="true"
    :contenteditable="!readonly"
    @input="handleInput"
    @mousedown="handleClick"
    spellcheck="false"
    :class="{ 'readonly': readonly }"
    :style="editorStyle"
    @keydown.ctrl.b.prevent="!readonly && $emit('format', 'bold')"
    @keydown.ctrl.i.prevent="!readonly && $emit('format', 'italic')"
    @keydown.ctrl.u.prevent="!readonly && $emit('format', 'underline')"
  ></div>
</template>

<script>
export default {
  name: 'EditorContent',
  props: {
    content: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editorStyle: {
      type: String,
      default: ''
    }
  },
  emits: ['update', 'click', 'format'],
  
  mounted() {
    // Imposta il contenuto iniziale
    this.$refs.editable.innerHTML = this.content;
  },
  
  watch: {
    content(newVal) {
      // Aggiorna solo se diverso dal contenuto corrente
      if (this.$refs.editable.innerHTML !== newVal) {
        this.$refs.editable.innerHTML = newVal;
      }
    }
  },
  
  methods: {
    handleInput() {
      this.$emit('update', this.$refs.editable.innerHTML);
    },
    
    handleClick() {
      this.$emit('click');
    },
    
    focus() {
      this.$refs.editable.focus();
    }
  }
};
</script>

<style scoped>
.editor {
  flex: 1;
  padding: 8px;
  outline: none;
  background-color: white;
  overflow-y: auto;
  line-height: 1.6;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.editor:focus {
  background-color: #fafbfc;
}

.editor.readonly {
  background-color: #f8f9fa;
  cursor: default;
  user-select: text;
}

.editor.readonly:focus {
  background-color: #f8f9fa;
}
</style>
