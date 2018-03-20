<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddRoles" persistent scrollable max-width="480">
      <v-card v-if="dialogAddRoles">
        <v-card-title class="headline">Tambah Peran Pengguna</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Peran Pengguna"
                  :error-messages="errors.collect('name')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="tag"
                  v-validate="'required'"
                  data-vv-name="tag"
                  label="Tag Peran Pengguna"
                  :error-messages="errors.collect('tag')"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Tambah</v-btn>
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
        required: 'Nama Peran Pengguna harus diisi'
      },
      tag: {
        required: 'Tag Peran Pengguna harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddRoles: false,
      name: null,
      tag: null
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
    })
  },
  methods: {
    closeDialogButton () {
      this.dialogAddRoles = !this.dialogAddRoles
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              name: this.name,
              tag: this.tag
            }
            this.$store.commit('rolesmanagement/clearCreateError')
            this.$store.dispatch('rolesmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddRoles = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('rolesmanagement/clearCreateError')
      this.$validator.reset()
      this.name = null
      this.tag = null
    }
  },
  created () {
    this.$root.$on('openDialogAddRoles', () => {
      this.dialogAddRoles = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
