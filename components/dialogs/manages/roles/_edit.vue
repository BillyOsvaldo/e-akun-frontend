<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditRoles" persistent scrollable max-width="480">
      <v-card v-if="dialogEditRoles">
        <v-card-title class="headline">Ubah Peran Pengguna</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadData">
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
      dialogEditRoles: false,
      name: null,
      tag: null
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
      roles: 'rolesmanagement/current'
    }),
    loadData () {
      if (this.dialogEditRoles) {
        this.$validator.reset()
        this.name = (typeof this.roles.name === 'undefined') ? '' : this.roles.name
        this.tag = (typeof this.roles.tag === 'undefined') ? '' : this.roles.tag
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogEditRoles = !this.dialogEditRoles
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
            let params = {}
            this.$store.commit('rolesmanagement/clearPatchError')
            this.$store.dispatch('rolesmanagement/patch', [this.roles._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogEditRoles = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('rolesmanagement/clearPatchError')
      this.$validator.reset()
      this.name = null
      this.tag = null
    }
  },
  created () {
    this.$root.$on('openDialogEditRoles', () => {
      this.dialogEditRoles = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
