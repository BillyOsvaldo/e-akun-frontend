<template>
  <v-layout row justify-center v-if="account" v-bind="closeDialog">
    <v-dialog v-model="dialogFullname" persistent scrollable max-width="360">
      <v-card v-if="dialogFullname">
        <v-card-title class="headline">Ubah Nama Lengkap</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadFullname">
              <v-flex xs12 sm6>
                <v-text-field
                  v-model="first_title"
                  label="Gelar Depan"
                  autofocus></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  v-model="last_title"
                  label="Gelar Belakang"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="first_name"
                  v-validate="'required'"
                  data-vv-name="first_name"
                  label="Nama Depan"
                  :error-messages="errors.collect('first_name')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="last_name"
                  v-validate="'required'"
                  data-vv-name="last_name"
                  label="Nama Belakang"
                  :error-messages="errors.collect('last_name')"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import {mapGetters} from 'vuex'
  const customHelptext = {
    en: {
      custom: {
        first_name: {
          required: 'Nama Depan harus diisi.'
        },
        last_name: {
          required: 'Nama Belakang harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        dialogFullname: false,
        doPost: false,
        first_title: null,
        last_title: null,
        first_name: null,
        last_name: null
      }
    },
    computed: {
      ...mapGetters([
        'userapp/current'
      ]),
      account: function () {
        return this['userapp/current']
      },
      loadFullname () {
        if (this.dialogFullname) {
          this.$validator.reset()
          this.first_title = this.account.profile.name.first_title
          this.last_title = this.account.profile.name.last_title
          this.first_name = this.account.profile.name.first_name
          this.last_name = this.account.profile.name.last_name
        }
      },
      closeDialog: function () {
        if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch === null) {
          this.doPost = false
          this.dialogFullname = false
          this.resetAll()
        } else if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch !== null) {
          this.doPost = false
          this.$validator.reset()
        }
      }
    },
    methods: {
      closeDialogButton () {
        this.dialogFullname = !this.dialogFullname
      },
      postUpdate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let data = {
                id: this.account.profile._id,
                name: {
                  first_title: this.first_title,
                  last_title: this.last_title,
                  first_name: this.first_name,
                  last_name: this.last_name
                },
                update: 'profile'
              }
              let params = {}
              this.$store.commit('userapp/clearPatchError')
              this.$store.dispatch('userapp/patch', [this.account._id, data, params])
              this.doPost = true
            }
          })
      },
      resetAll () {
        this.$store.commit('userapp/clearPatchError')
        this.$validator.reset()
      }
    },
    created () {
      this.$root.$on('openDialogFullname', () => {
        this.dialogFullname = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
