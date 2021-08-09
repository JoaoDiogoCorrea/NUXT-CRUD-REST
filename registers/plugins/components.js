import Vue from 'vue'
import Snackbar from '@/components/Snackbar'
import { mask } from 'vue-the-mask'

Vue.component('GSnackbar', Snackbar)
Vue.directive('mask', mask)