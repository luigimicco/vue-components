<template>
  
    <div 
      class="otp-inputs"
      role="group"
      :aria-label="`Inserisci codice di verifica a ${digits} cifre`"
    >
      <input
        v-for="(val, idx) in otp"
        :key="idx"
        ref="inputs"
        v-model="otp[idx]"
        type="text"
        maxlength="1"
        @input="onInput(idx)"
        @keydown.backspace.prevent="onBackspace(idx)"
        @paste="onPaste($event, idx)"
        class="otp-box"
        autocomplete="one-time-code"
        :autofocus="idx === 0"
        :aria-label="`Cifra ${idx + 1} di ${digits}`"
        :aria-invalid="hasError"        
      />
    </div>

</template>

<script>
export default {
  name: "OtpInput",
  props: {
    modelValue: {
      type: String,
      default: ""
    },    
    digits: {
      type: Number,
      default: 6,
    },
    allowedChars: {
      type: String,
      default: "digits", // default will allow only digits
    }, 
    size: { 
      type: String, 
      default: 'medium',
      validator: v => ['small', 'medium', 'large'].includes(v)
    },
    hasError: { type: Boolean, default: false },  
  },    
  emits: ['update:modelValue', 'complete'],
  
  data() {
    return {
      otp: Array.from({ length: this.digits }, (_,i) => this.modelValue[i]), 
      regexMap: {
        digits: /^[0-9]$/,
        letters: /^[A-Za-z]$/,
        uppercase: /^[A-Z]$/,
        lowercase: /^[a-z]$/,
      },      
    };
  },

  computed: {
    allowedRegex() {
      if (this.regexMap[this.allowedChars]) {
        return this.regexMap[this.allowedChars];
      }
      // fallback to user pattern if provided
      try {
        return new RegExp(this.allowedChars);
      } catch {
        // fallback safe regex, accept only digits if invalid regex
        return /^[0-9]$/;
      }
    },
  },  
  methods: {
    onInput(idx) {
      const char = this.otp[idx];
      if (!this.allowedRegex.test(char)) {
        this.otp[idx] =  "";
        return;
      }      
      if (char && idx < this.digits - 1) {
        this.$refs.inputs[idx + 1].focus();
      }
    },
    onBackspace(idx) {
      if (!this.otp[idx] && idx > 0) {
        this.otp[idx-1] =  "";
        this.$refs.inputs[idx - 1].focus();
      } else {
        this.otp[idx] =  "";
      }
    },
    onPaste(event, idx) {
      event.preventDefault();
      let paste = event.clipboardData.getData('text').slice(0, this.digits - idx);
      paste = paste
        .split("")
        .filter((ch) => this.allowedRegex.test(ch))
        .join("");      
      for (let i = 0; i < paste.length; i++) {
        this.otp[idx + i] =  paste[i];
      }
      this.$nextTick(() => {
        const nextIndex = idx + paste.length < this.digits ? idx + paste.length : this.digits - 1;
        this.$refs.inputs[nextIndex].focus();
      });
    },    
  },
  watch: {
    otp: {
      handler(newVal) {
        const code = newVal.join("");
        this.$emit("update:modelValue", code);
        
        if (code.length === this.digits && !code.includes('')) {
          this.$emit('complete', code);
        }
      },
      deep: true
    }
  },
};
</script>

<style scoped>

.otp-inputs {
  --otp-size: 48px;
  --otp-border: #20256d;
  --otp-focus: #377dff;
  --otp-error: #ef4444;

  display: flex;
  gap: 16px;
  margin: 1rem 0 1rem 0;
}
.otp-box {
  width: 48px;
  height: 48px;
  border: 2px solid #20256d;
  border-radius: 12px;
  text-align: center;
  font-size: 2rem;
  outline: none;
  transition: box-shadow 0.2s;
}

.otp-box[aria-invalid="true"] {
  border-color: var(--otp-error);
  animation: shake 0.3s;
}

.otp-box:focus {
  box-shadow: 0 0 10px 2px #bed7ff;
  border-color: #377dff;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

</style>
