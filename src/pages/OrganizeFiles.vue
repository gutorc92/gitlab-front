<template lang="pug">
  div
    q-card-section(v-if="commits.length > 0")
      q-toolbar.bg-primary.text-white.rounded-borders
        q-toolbar-title Arquivos
        q-field(dark borderless)
          template(v-slot:control)
            div(class="self-center no-outline" tabindex="0") Total de pontos: {{total}}
        q-btn(flat round dense icon="add_circle" @click="addTask")
      div
        div(v-for="index in qtde" :key="index")
          HeaderOF(
            v-model="teste"
            @updatetotal="onUpdateTotal"
            )
        q-item
          div(
            v-mutation="handler2"
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @dragover="onDragOver"
            @drop="onDrop"
            class="drop-target rounded-borders overflow-hidden"
          )
            div(v-for="(commit, index) in commits" :key="commit.sha")
              div.box(
                v-for="(file, indexFile) in commit.files"
                :id="index + '-' + indexFile"
                :key="index + '-' + indexFile"
                draggable="true"
                @dragstart="onDragStart"
              )
                span {{file.name}}
                span {{file.raw_url}}
</template>

<script>
import HeaderOF from '../components/HeaderOF'
export default {
  name: 'OrganizeFiles',
  components: {
    HeaderOF
  },
  data () {
    return {
      qtde: 1,
      total: 0,
      teste: '',
      status2: []
    }
  },
  computed: {
    commits () {
      return this.$store.getters['repository/getCommits']
    }
  },
  methods: {
    onUpdateTotal (value) {
      console.log('value', value)
      if (value.op === 'add') {
        this.total += value.total
      } else {
        this.total -= value.total
      }
    },
    addTask () {
      this.qtde = this.qtde + 1
    },
    handler2 (mutationRecords) {
      this.status2 = []
      for (const index in mutationRecords) {
        const record = mutationRecords[index]
        console.log('record 2', record)
        const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`
        this.status2.push(info)
      }
    },

    // store the id of the draggable element
    onDragStart (e) {
      e.dataTransfer.setData('text', e.target.id)
      e.dataTransfer.dropEffect = 'move'
    },

    onDragEnter (e) {
      // don't drop on other draggables
      if (e.target.draggable !== true) {
        e.target.classList.add('drag-enter')
      }
    },

    onDragLeave (e) {
      e.target.classList.remove('drag-enter')
    },

    onDragOver (e) {
      e.preventDefault()
    },

    onDrop (e) {
      e.preventDefault()

      // don't drop on other draggables
      if (e.target.draggable === true) {
        return
      }

      const draggedId = e.dataTransfer.getData('text')
      const draggedEl = document.getElementById(draggedId)

      // check if original parent node
      if (draggedEl.parentNode === e.target) {
        e.target.classList.remove('drag-enter')
        return
      }

      // make the exchange
      draggedEl.parentNode.removeChild(draggedEl)
      e.target.appendChild(draggedEl)
      e.target.classList.remove('drag-enter')
    }
  }
}
</script>

<style lang="css" scoped>
.projectsScroll{
  height: calc(100vh - 50px);
  width: 100%;
}
.box {
  border: 1px solid #ccc!important;
  border-radius: 16px;
  padding: 5px;
  margin: 3px 0 3px 0;
}
</style>
