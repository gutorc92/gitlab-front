<template lang="pug">
    q-expansion-item(:label="expansionLabel")
      div.fields.q-pa-sm
        div
          div.row
            q-select.col-5.q-ma-sm(v-model="completeDesc.task" :options="options" :option-label="opt => opt ? `${opt.value} ${opt.desc}` : ''" label="Tarefa")
            //- div.q-ma-sm(v-if='completeDesc.task') {{completeDesc.task.desc}}
            q-select.col-5.q-ma-sm(v-model="completeDesc.complexity" :options="completeDesc.task ? completeDesc.task.complexity : []" label="Complexidade")
          div.row
            q-field.col-5.q-ma-sm(rounded standout disable)
              template(v-slot:control)
                div(class="self-center no-outline" tabindex="0") Quatidade: {{completeDesc.files.length}}
            q-field.col-5.q-ma-sm(rounded standout disable)
              template(v-slot:control)
                div(class="self-center no-outline" tabindex="0") Total USTIBB: {{total}}
        div.box(
          :style="minHeight"
          v-mutation="handler"
          @dragenter="onDragEnter"
          @dragleave="onDragLeave"
          @dragover="onDragOver"
          @drop="onDrop"
        )
</template>
<style scoped>
.fields {
  padding: 5px;
  margin: 3px 0 3px 0;
  border: 1px solid #ccc!important;
  border-radius: 16px;
}
.box {
  border: 1px solid #ccc!important;
  border-radius: 16px;
  padding: 5px;
  margin: 3px 0 3px 0;
  min-height: 60px;
}
</style>

<script>
import optionsData from './json/data.json' // eslint-disable-line
export default {
  name: 'HeaderOF',
  props: {
    value: {
      defualt: '',
      required: true
    }
  },
  data () {
    return {
      completeDesc: {
        task: '',
        desc: '',
        complexity: '',
        files: [],
        total: 0
      },
      total: 0,
      status: [],
      task: '',
      options: optionsData,
      complexity: '',
      complexityOptions: [
        {
          value: 2,
          label: 'Baixa - 2'
        }
      ]
    }
  },
  computed: {
    expansionLabel () {
      let text = 'Tarefa'
      if (typeof (this.completeDesc.task) !== 'string' && 'desc' in this.completeDesc.task) {
        text += ` ${this.completeDesc.task.desc}`
      }
      return text
    },
    minHeight () {
      let pxs = this.completeDesc.files.length > 1 ? this.completeDesc.files.length * 60 + 20 : 80
      return `min-height: ${pxs}px!important;`
    }
  },
  watch: {
    completeDesc: {
      deep: true,
      handler: 'handlerCompleteDesc'
    }
  },
  created () {
  },
  methods: {
    handlerCompleteDesc () {
      let multi = this.completeDesc.complexity === '' ? 0 : 'value' in this.completeDesc.complexity ? this.completeDesc.complexity.value : 0
      let total = this.completeDesc.files.length * multi
      this.total = total
      this.$emit('updatetotal')
    },
    handler (mutationRecords) {
      this.status = []
      let uniqueStatus = new Set()
      for (const index in mutationRecords) {
        const record = mutationRecords[index]
        console.log('record 1', record)
        const info = record.target.innerText
        console.log('info 1', info.replace(/↵|\n/ig, ' ').split(' '))
        info.replace(/↵|\n/ig, ' ').split(' ').map((text) => {
          if (text !== 'modified' && text !== 'added' && text !== 'removed') {
            uniqueStatus.add(text)
          }
        })
      }
      console.log('uniqueStatus', uniqueStatus)
      this.completeDesc.files = [...uniqueStatus]
    },
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
