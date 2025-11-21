<template>
  <div v-if="!readonly" v-show="htmlMode" class="html-source-wrapper">
    <textarea
      v-model="localContent"
      @input="$emit('update', localContent)"
      class="html-source"
      :style="editorStyle"
      spellcheck="false"
    ></textarea>
  </div>
  <div v-else-if="readonly && htmlMode" class="html-source-readonly" v-text="content"></div>
</template>

<script>
export default {
  name: 'HtmlSourceView',
  props: {
    content: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    htmlMode: {
      type: Boolean,
      default: false
    },
    editorStyle: {
      type: String,
      default: ''
    }
  },
  emits: ['update'],
  
  data() {
    return {
      localContent: this.content
    };
  },
  
  watch: {
    content(newVal) {
      this.localContent = newVal;
    }
  }
};
</script>

<style scoped>
.html-source-wrapper {
  flex: 1;
  display: flex;
}

.html-source {
  flex: 1;
  padding: 16px;
  outline: none;
  border: none;
  overflow-y: auto;
  background-color: #f5f5f5;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  resize: none;
  min-height: 100%;
  line-height: 1.5;
  color: #333;
}

.html-source:focus {
  background-color: #f0f0f0;
}

.html-source-readonly {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f8f9fa;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  min-height: 100%;
  line-height: 1.5;
  color: #666;
  white-space: pre-wrap;
  user-select: text;
}
</style>
