<template lang="pug">
  q-scroll-area(style="width: 400px; max-width: 100%; height: 250px").q-px-md.bg-white
    q-item
      q-item-section
        q-field(label="Tempo de atualização")
          q-input(v-model="timeUpdate" type='number')
    q-item
      q-item-section
        q-field(label="Commit Author")
          q-input(v-model="commitAuthor")
    q-item
      q-btn(label="Salvar" @click="saveSettings")
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      timeUpdate: '',
      commitAuthor: ''
    }
  },
  computed: {
    savedTime: {
      get () {
        return this.$store.getters['settings/getUpdateTime']
      },
      set (val) {
        this.$store.commit('settings/setUpdateTime', val)
      }
    },
    savedAuthor: {
      get () {
        return this.$store.getters['settings/getCommitAuthor']
      },
      set (val) {
        this.$store.commit('settings/setCommitAuthor', val)
      }
    }
  },
  created () {
    if (this.savedAuthor !== '') {
      this.commitAuthor = this.savedAuthor
    }
    if (this.savedTime !== 0) {
      this.updateTime = this.savedTime
    }
  },
  methods: {
    saveTimeUpdate () {
      if (this.timeUpdate !== '') {
        this.savedTime = this.timeUpdate
      }
    },
    saveSettings () {
      if (this.timeUpdate !== '') {
        this.updateTime = this.timeUpdate
      }
      if (this.commitAuthor !== '') {
        this.savedAuthor = this.commitAuthor
      }
    }
  }
}
</script>
<style lang="css">

</style>
