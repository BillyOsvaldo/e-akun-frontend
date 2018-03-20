<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditStructures" persistent scrollable max-width="480">
      <v-card v-if="dialogEditStructures">
        <v-card-title class="headline">Ubah Struktur</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadData">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Struktur"
                  :error-messages="errors.collect('name')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="desc"
                  v-validate="'required'"
                  data-vv-name="desc"
                  label="Deskripsi Struktur"
                  :error-messages="errors.collect('desc')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="nameOfPosition"
                  v-validate="'required'"
                  data-vv-name="nameOfPosition"
                  label="Nama Jabatan"
                  :error-messages="errors.collect('nameOfPosition')"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Ubah</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
const customHelptext = {
  en: {
    custom: {
      name: {
        required: 'Nama Struktur harus diisi'
      },
      desc: {
        required: 'Deskripsi Struktur harus diisi.'
      },
      nameOfPosition: {
        required: 'Nama Jabatan harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogEditStructures: false,
      name: null,
      desc: null,
      nameOfPosition: null
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
      structures: 'structuresmanagement/current'
    }),
    loadData () {
      if (this.dialogEditStructures) {
        this.$validator.reset()
        this.name = (typeof this.structures.name === 'undefined') ? '' : this.structures.name
        this.desc = (typeof this.structures.desc === 'undefined') ? '' : this.structures.desc
        this.nameOfPosition = (typeof this.structures.nameOfPosition === 'undefined') ? '' : this.structures.nameOfPosition
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogEditStructures = !this.dialogEditStructures
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              name: this.name,
              desc: this.desc,
              nameOfPosition: this.nameOfPosition
            }
            let params = {}
            this.$store.commit('structuresmanagement/clearPatchError')
            this.$store.dispatch('structuresmanagement/patch', [this.structures._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogEditStructures = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('structuresmanagement/clearPatchError')
      this.$validator.reset()
      this.name = null
      this.desc = null
      this.nameOfPosition = null
    }
  },
  created () {
    this.$root.$on('openDialogEditStructures', () => {
      this.dialogEditStructures = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
