import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'

import Multiselect from 'vue-multiselect'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser,
  faUserPlus,
  faUserMinus,
  faLock,
  faEnvelope,
  faCaretDown,
  faCaretUp,
  faEdit,
  faCheck,
  faTimes,
  faAngleLeft,
  faAngleRight,
  faCode,
  faSignOutAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VuePersianDatetimePicker from 'vue3-persian-datetime-picker'

const app = createApp(App)

// js-cookie-backed replacement for vue-cookie's global `$cookie`
// (preserves the get/set/delete API used in component scripts and templates)
app.config.globalProperties.$cookie = {
  get: name => Cookies.get(name),
  set: (name, value, expires) =>
    expires ? Cookies.set(name, value, { expires }) : Cookies.set(name, value),
  delete: name => Cookies.remove(name)
}

app.use(VuePersianDatetimePicker, {
  name: 'custom-date-picker',
  props: {
    inputFormat: 'YYYY-MM-DD HH:mm',
    format: 'jYYYY-jMM-jDD HH:mm',
    editable: false,
    inputClass: 'form-control my-custom-class-name',
    placeholder: 'Please select a date',
    altFormat: 'YYYY-MM-DD HH:mm',
    color: '#00acc1',
    autoSubmit: false
    // ...
    // ... And whatever you want to set as default
    // ...
  }
})

library.add(faUser)
library.add(faLock)
library.add(faEnvelope)
library.add(faCaretDown)
library.add(faCaretUp)
library.add(faEdit)
library.add(faCheck)
library.add(faTimes)
library.add(faAngleLeft)
library.add(faAngleRight)
library.add(faUserPlus)
library.add(faUserMinus)
library.add(faCode)
library.add(faSignOutAlt)
library.add(faTrash)

app.component('font-awesome-icon', FontAwesomeIcon)
// register multiselect
app.component('multiselect', Multiselect)

// replacement for vue-clickaway's v-on-clickaway directive
app.directive('click-outside', {
  beforeMount (el, binding) {
    el.__clickOutsideHandler__ = event => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    setTimeout(() => {
      document.documentElement.addEventListener('click', el.__clickOutsideHandler__, false)
    }, 0)
  },
  unmounted (el) {
    document.documentElement.removeEventListener('click', el.__clickOutsideHandler__, false)
  }
})

app.use(router)
app.use(store)
app.mount('#app')
