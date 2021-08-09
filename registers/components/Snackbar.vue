<template>
  <v-snackbar v-model="show" :color="color">
    <v-icon class="white--text mr-3">{{ iconName }}</v-icon>
    <span class="white--text mr-3 v-JetBrains" v-html="message"></span>
    <v-btn class="white--text v-JetBrains" text @click="show = false">FECHAR</v-btn>
  </v-snackbar>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      color: ''
    }
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.show = true
      }
    })
  },
  computed: {
    iconName () {
      switch(this.color) {
        case "info":
          return "mdi-alert-circle"
        case "success":
          return "mdi-check-circle"
        case "warning":
          return "mdi-alert"
        case "error":
          return "mdi-close-circle"
      }
    }
  }
}
</script>
