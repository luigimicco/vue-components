<template>
  <div class="html-editor-container" :class="{ 'readonly': readonly }">
    <!-- Readonly indicator -->
    <div v-if="readonly" class="readonly-indicator">📖 Modalità sola lettura</div>

    <!-- Toolbar -->
    <EditorToolbar
      v-if="!readonly"
      :toolbar="toolbar"
      :selected-font="selectedFont"
      :selected-color="selectedColor"
      :selected-font-size="selectedFontSize"
      :highlight-color="highlightColor"
      :selected-heading="selectedHeading"
      :selected-placeholder="selectedPlaceholder"
      :placeholders="placeholders"
      :html-mode="htmlMode"
      @apply-font="handleApplyFont"
      @apply-color="handleApplyColor"
      @apply-highlight="handleApplyHighlight"
      @apply-font-size="handleApplyFontSize"
      @apply-heading="handleApplyHeading"
      @align="handleAlign"
      @format="handleFormat"
      @format-sup-sub="handleFormatSupSub"
      @toggle-case="handleToggleCase"
      @remove-formatting="handleRemoveFormatting"
      @toggle-list="handleToggleList"
      @indent="handleIndent"
      @insert-link="handleInsertLink"
      @insert-placeholder="handleInsertPlaceholder"
      @toggle-html="toggleHtmlMode"
    />

    <!-- Editor and HTML view wrapper -->
    <div class="editor-preview-wrapper">
      <!-- Editor Content -->
      <EditorContent
        v-if="!htmlMode"
        ref="editorContent"
        :content="content"
        :readonly="readonly"
        :editor-style="editorStyle"
        @update="onInput"
        @click="onEditorClick"
        @format="handleFormat"
      />

      <!-- HTML Source View -->
      <HtmlSourceView
        v-if="htmlMode || readonly"
        :content="content"
        :readonly="readonly"
        :html-mode="htmlMode"
        :editor-style="editorStyle"
        @update="onTextareaInput"
      />
    </div>
  </div>
</template>

<script>
import EditorToolbar from './components/EditorToolbar.vue';
import EditorContent from './components/EditorContent.vue';
import HtmlSourceView from './components/HtmlSourceView.vue';
import { useSelection } from './composables/useSelection';
import { useFormatting } from './composables/useFormatting';
import { useTextAlignment } from './composables/useTextAlignment';
import { useListManagement } from './composables/useListManagement';
import { useLinkManagement } from './composables/useLinkManagement';

export default {
  name: 'HtmlEditor',
  
  components: {
    EditorToolbar,
    EditorContent,
    HtmlSourceView
  },
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholders: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editorStyle: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      default: () => ['font', 'heading', 'switchcase', 'fontsize', 'color', 'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'alignment', 'clear', 'list', 'indent', 'link', 'placeholder', 'html']
    }
  },
  
  emits: [
    'update:modelValue',
    'show-notification',
    'show-message',
    'request-link'
  ],
  
  setup(props, { emit }) {
    // Composables
    const { saveSelection, restoreSelection } = useSelection();
    const formatting = useFormatting(emit);
    const { alignText, formatBlock } = useTextAlignment();
    const { toggleList, indent } = useListManagement();
    const { insertLink } = useLinkManagement(emit);
    
    return {
      // Selection
      saveSelection,
      restoreSelection,
      // Formatting
      ...formatting,
      // Alignment
      alignText,
      formatBlock,
      // Lists
      toggleList,
      indent,
      // Links
      insertLink
    };
  },
  
  data() {
    return {
      content: this.modelValue,
      selectedFont: 'Arial',
      selectedColor: '#000000',
      selectedFontSize: '',
      highlightColor: '#ffff00',
      selectedHeading: '',
      selectedPlaceholder: '',
      htmlMode: false
    };
  },
  
  watch: {
    content: {
      handler(newVal) {
        this.$emit('update:modelValue', newVal);
      },
      deep: true
    },
    readonly(newVal) {
      if (newVal && this.htmlMode) {
        this.htmlMode = false;
      }
    },
    modelValue(newVal) {
      if (newVal !== this.content) {
        this.content = newVal;
      }
    }
  },
  
  methods: {
    onInput(newContent) {
      this.content = newContent;
      this.cleanEmptyTags();
    },
    
    onTextareaInput() {
      // Il v-model si occupa dell'aggiornamento
    },
    
    onEditorClick() {
      this.saveSelection();
    },
    
    handleApplyFont() {
      this.applyFont(this.selectedFont);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleApplyColor() {
      this.applyColor(this.selectedColor);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleApplyHighlight() {
      this.applyHighlight(this.highlightColor);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleApplyFontSize(size) {
      this.applyFontSize(size);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleApplyHeading(heading) {
      if (!heading) {
        this.formatBlock('p');
      } else {
        this.formatBlock(heading);
      }
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleAlign(alignment) {
      this.saveSelection();
      this.$refs.editorContent.focus();
      this.restoreSelection();
      this.alignText(alignment, this.$refs.editorContent.$refs);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleFormat(command) {
      this.formatText(command);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleFormatSupSub(command) {
      this.formatSupSub(command);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleToggleCase() {
      this.toggleCase();
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleRemoveFormatting() {
      this.removeFormatting(this.$refs.editorContent.$refs);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleToggleList(listType) {
      this.saveSelection();
      this.$refs.editorContent.focus();
      this.restoreSelection();
      this.toggleList(listType, this.$refs.editorContent.$refs);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleIndent(direction) {
      this.saveSelection();
      this.$refs.editorContent.focus();
      this.restoreSelection();
      this.indent(direction, this.$refs.editorContent.$refs);
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleInsertLink() {
      this.insertLink();
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    handleInsertPlaceholder(placeholder) {
      this.saveSelection();
      this.$refs.editorContent.focus();
      this.restoreSelection();
      
      let selection = window.getSelection();
      if (!selection.rangeCount) {
        this.$refs.editorContent.focus();
        const range = document.createRange();
        range.selectNodeContents(this.$refs.editorContent.$refs.editable);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      const range = selection.getRangeAt(0);
      const textNode = document.createTextNode(placeholder);
      
      range.deleteContents();
      range.insertNode(textNode);
      
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      this.onInput(this.$refs.editorContent.$refs.editable.innerHTML);
    },
    
    toggleHtmlMode() {
      if (!this.htmlMode) {
        this.content = this.$refs.editorContent.$refs.editable.innerHTML;
      }
      
      this.htmlMode = !this.htmlMode;
      
      if (!this.htmlMode) {
        this.$nextTick(() => {
          this.$refs.editorContent.$refs.editable.innerHTML = this.content;
        });
      }
    },
    
    cleanEmptyTags() {
      if (this.htmlMode) return;
      
      const editable = this.$refs.editorContent?.$refs.editable;
      if (!editable) return;
      
      const emptyTags = editable.querySelectorAll('b:empty, i:empty, u:empty, strong:empty, em:empty, span:empty, a:empty');
      emptyTags.forEach(tag => {
        tag.parentNode.removeChild(tag);
      });
      
      this.content = editable.innerHTML;
    },
    
    getContent() {
      return this.content;
    },
    
    resetContent() {
      this.content = '<p>Scrivi qui...</p>';
      this.selectedFont = 'Arial';
      this.selectedColor = '#000000';
      this.selectedHeading = '';
      this.selectedPlaceholder = '';
      this.htmlMode = false;
      if (this.$refs.editorContent) {
        this.$refs.editorContent.$refs.editable.innerHTML = this.content;
      }
    }
  }
};
</script>

<style scoped>
.html-editor-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

.html-editor-container.readonly {
  border-color: #d0d0d0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.readonly-indicator {
  background: linear-gradient(135deg, #f0f0f0, #e8e8e8);
  border-bottom: 1px solid #d0d0d0;
  padding: 8px 12px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
  text-align: center;
}

.editor-preview-wrapper {
  display: flex;
  flex: 1;
  min-height: 280px;
}
</style>
