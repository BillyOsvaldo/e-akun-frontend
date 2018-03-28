<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditAdministratorPermissions" persistent scrollable max-width="480">
      <v-card v-if="dialogEditAdministratorPermissions">
        <v-card-title class="headline">Ubah Izin Adminstrator</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadData">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Aplikasi"
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
      dialogEditAdministratorPermissions: false,
      name: null,
      tag: null
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
      administratorpermissions: 'administratorpermissionsmanagement/current'
    }),
    loadData () {
      if (this.dialogEditAdministratorPermissions) {
        this.$validator.reset()
        this.name = (typeof this.administratorpermissions.name === 'undefined') ? '' : this.administratorpermissions.name
        this.tag = (typeof this.administratorpermissions.tag === 'undefined') ? '' : this.administratorpermissions.tag
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogEditAdministratorPermissions = !this.dialogEditAdministratorPermissions
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
            this.$store.commit('administratorpermissionsmanagement/clearPatchError')
            this.$store.dispatch('administratorpermissionsmanagement/patch', [this.administratorpermissions._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogEditAdministratorPermissions = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('administratorpermissionsmanagement/clearPatchError')
      this.$validator.reset()
    }
  },
  created () {
    this.$root.$on('openDialogEditAdministratorPermissions', () => {
      this.dialogEditAdministratorPermissions = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
