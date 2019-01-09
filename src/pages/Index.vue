<template lang="pug">
  q-page(class="flex flex-center")
    div
      // token(v-model="tokenUser")
      p| Meu toba
</template>

<style>
</style>

<script>
// import Token from '../components/Token'
export default {
  name: 'PageIndex',
  data () {
    return {
      thetas: [],
      firstTime: true,
      groupSelected: '',
      loading: true,
      errorLoading: false
    }
  },
  computed: {
    personalToken: {
      get () {
        return this.$store.state.credentials.personalToken
      }
    }
  },
  created () {
    if (this.personalToken !== '') {
      this.tokenUser = this.personalToken
    }
  }
}
