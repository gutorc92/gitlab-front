<template lang="pug">
    div
      q-item
        q-item-main
          q-field(label="Groupos")
      q-item
        q-item-main
          q-select(v-if="groups.length > 0" v-model="groupSelected" :options="groups")
</template>

<style>
</style>

<script>
export default {
  name: 'Groups',
  props: {
    value: {
      defualt: '',
      required: true
    }
  },
  data () {
    return {
      groups: [],
      groupSelected: ''
    }
  },
  created () {
    console.log('create group')
    this.groupSelected = this.value
    if (this.personalToken !== '') {
      this.loadGroups()
    }
  },
  computed: {
    personalToken () {
      return this.$store.getters['credentials/getPersonalToken']
    }
  },
  watch: {
    groupSelected () {
      this.$emit('input', this.groupSelected)
    },
    personalToken () {
      this.loadGroups()
    }
  },
  methods: {
    async loadGroups (newVal) {
      let groups = this.groups
      if (this.personalToken === '') {
        return 0
      }
      this.$axios.get(`https://gitlab.com/api/v4/groups`,
        {
          headers: {
            'Private-Token': this.personalToken
          }
        }).then(function (response) {
        for (let group of response.data) {
          groups.push({value: group.id.toString(), label: group.name})
        }
      })
    }
  }
}
</script>
