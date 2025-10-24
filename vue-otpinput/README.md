# OtpInput
A flexible and customizable One-Time Password (OTP) input component for Vue 3 applications. This component provides a clean, accessible interface for entering verification codes, PINs, and other multi-digit inputs.

## Features

- ✅ **Flexible digit count**: Configure any number of input fields
- ✅ **Character validation**: Support for digits, letters, uppercase, lowercase, or custom regex patterns
- ✅ **Auto-focus navigation**: Automatic focus movement between fields
- ✅ **Paste support**: Smart paste functionality with validation
- ✅ **Backspace handling**: Intuitive deletion and navigation
- ✅ **Vue 3 Composition**: Full v-model support with two-way data binding
- ✅ **Accessibility**: Built-in autocomplete and focus management
- ✅ **Responsive design**: Clean, modern styling with focus states

## Installation

1. Copy the `OtpInput.vue` component to your project's components directory
2. Import and register the component in your Vue application

## Usage

### Basic Example

```vue
<template>
  <div>
    <h3>Enter your verification code</h3>
    <OtpInput v-model="otpCode" />
    <p>Current value: {{ otpCode }}</p>
  </div>
</template>

<script>
import OtpInput from './components/OtpInput.vue'

export default {
  components: {
    OtpInput
  },
  data() {
    return {
      otpCode: ''
    }
  }
}
</script>
```

### Advanced Examples

#### Custom Number of Digits
```vue
<template>
  <OtpInput v-model="pinCode" :digits="4" />
</template>

<script>
export default {
  data() {
    return {
      pinCode: ''
    }
  }
}
</script>
```

#### Letters Only
```vue
<template>
  <OtpInput v-model="letterCode" :digits="5" allowed-chars="letters" />
</template>
```

#### Uppercase Letters Only
```vue
<template>
  <OtpInput v-model="upperCode" :digits="3" allowed-chars="uppercase" />
</template>
```

#### Custom Regex Pattern
```vue
<template>
  <!-- Allow only hexadecimal characters (0-9, A-F) -->
  <OtpInput v-model="hexCode" :digits="8" allowed-chars="^[0-9A-F]$" />
</template>
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `modelValue` | `String` | `""` | The current value of the OTP input (use with v-model) |
| `digits` | `Number` | `6` | Number of input fields to display |
| `allowedChars` | `String` | `"digits"` | Character validation rule (see allowed values below) |

### Allowed Characters

| Value | Description | Pattern |
|-------|-------------|---------|
| `"digits"` | Numbers only (0-9) | `/^[0-9]$/` |
| `"letters"` | Letters only (a-z, A-Z) | `/^[A-Za-z]$/` |
| `"uppercase"` | Uppercase letters only (A-Z) | `/^[A-Z]$/` |
| `"lowercase"` | Lowercase letters only (a-z) | `/^[a-z]$/` |
| Custom regex | Any valid regex pattern | User-defined |

## Events

| Event | Description |
|-------|-------------|
| `update:modelValue` | Emitted when the OTP value changes (for v-model support) |

## Styling

The component comes with default styling that can be customized by overriding the CSS classes:

- `.otp-inputs`: Container for all input fields
- `.otp-box`: Individual input field styling

### Custom Styling Example

```css
/* Override default styles */
.otp-inputs {
  gap: 8px; /* Reduce spacing between inputs */
}

.otp-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

.otp-box:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}
```

## Accessibility Features

- **Autocomplete**: Sets `autocomplete="one-time-code"` for better mobile experience
- **Auto-focus**: First input is automatically focused on mount
- **Keyboard navigation**: Supports Tab, Backspace, and arrow key navigation
- **Screen reader friendly**: Uses semantic HTML input elements

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support with native OTP autocomplete

## License

MIT License - feel free to use in your projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


print("...")
