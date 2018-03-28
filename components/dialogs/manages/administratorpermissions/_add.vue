<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddAdministratorPermissions" persistent scrollable max-width="480">
      <v-card v-if="dialogAddAdministratorPermissions">
        <v-card-title class="headline">Tambah Daftar Izin Administator</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Administator"
                  :error-messages="errors.collect('name')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="tag"
                  v-validate="'required'"
                  data-vv-name="tag"
                  label="Nama Tag"
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
        required: 'Nama Aplikasi harus diisi'
      },
      tag: {
        required: 'Nama Tag harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddAdministratorPermissions: false,
      loading: false,
      cacheItems: true,
      tempItems: [],
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
      this.dialogAddAdministratorPermissions = !this.dialogAddAdministratorPermissions
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
            this.$store.commit('administratorpermissionsmanagement/clearCreateError')
            this.$store.dispatch('administratorpermissionsmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddAdministratorPermissions = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('administratorpermissionsmanagement/clearCreateError')
      this.$validator.reset()
    }
  },
  created () {
    this.$root.$on('openDialogAddAdministratorPermissions', () => {
      this.dialogAddAdministratorPermissions = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
