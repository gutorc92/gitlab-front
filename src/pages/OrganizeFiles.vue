<template lang="pug">
  div
    q-card-section(v-if="commits.length > 0")
      a(id="download" style="display: none;" :href="url" download='catalogo.txt')| Download
      q-toolbar.bg-primary.text-white.rounded-borders
        q-toolbar-title Arquivos
        q-field(dark borderless)
          template(v-slot:control)
            div(class="self-center no-outline" tabindex="0") Total de pontos: {{total}}
        q-btn(flat round dense icon="add_circle" @click="addTask")
        q-btn(flat round dense icon="remove_circle" @click="removeTask")
        q-btn(flat round dense icon="save_alt" @click="genereteFile")
      q-splitter(v-model="splitterModel")
        template(v-slot:before)
          div(v-for="index in qtde" :key="index")
            HeaderOF.col-12(
              v-model="teste"
              ref="header"
              @updatetotal="onUpdateTotal"
              )
        template(v-slot:after)
          q-scroll-area(style="height: 900px;")
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
                  q-chip(v-if="file.status === 'added'" color="green") {{file.status}}
                  q-chip(v-else-if="file.status === 'modified'" color="yellow") {{file.status}}
                  q-chip(v-else-if="file.status === 'removed'" color="red") {{file.status}}
                  span {{file.blob_url}}
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
      splitterModel: 50,
      qtde: 1,
      url: '',
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
    genereteFile (e) {
      event.preventDefault()
      let text = ''
      for (let i = 0; i < this.$refs.header.length; i++) {
        let task = `
- Tarefa: ${this.$refs.header[i].completeDesc.task.label}
- Descrição/Objeto: ${this.$refs.header[i].completeDesc.task.desc}
- Complexidade: ${this.$refs.header[i].completeDesc.complexity.label}
- Quantidade: ${this.$refs.header[i].completeDesc.files.length}
- Total USTIBB: ${this.$refs.header[i].total}
- Artefatos:`
        for (let j = 0; j < this.$refs.header[i].completeDesc.files.length; j++) {
          task += `\n    - ${this.$refs.header[i].completeDesc.files[j]}`
        }
        console.log('task', task)
        text += task
      }
      console.log('text', text)
      this.url = window.URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
      let a = document.getElementById('download')
      a.click()
    },
    onUpdateTotal () {
      let total = this.$refs.header.map(elem => elem.total)
      this.total = total.reduce((a, b) => a + b, 0)
    },
    addTask () {
      this.qtde = this.qtde + 1
    },
    removeTask () {
      this.qtde = this.qtde - 1
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
