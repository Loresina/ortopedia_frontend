import { createApp } from 'vue'
import App from './App.vue'
import 'vue-material-design-icons/Menu.vue'
import './assets/main.css'

import Vu3PhoneNumberInput from 'vue3-phone-number-input'
import 'vue3-phone-number-input/dist/vue3-phone-number-input.css'

// import MyComponent from '@/MyComponent.vue'

const app = createApp(App);
app.component('vue-phone-number-input', Vu3PhoneNumberInput);
app.mount('#app');
app.use(Vu3PhoneNumberInput);

