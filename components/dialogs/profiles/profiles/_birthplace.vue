<template>
  <v-layout row justify-center v-if="account" v-bind="closeDialog">
    <v-dialog v-model="dialogBirthplace" persistent scrollable max-width="360">
      <v-card v-if="dialogBirthplace">
        <v-card-title class="headline">Ubah Tempat lahir</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataBirthplace">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="birthplace"
                  v-validate="'required'"
                  data-vv-name="birthplace"
                  label="Tempat Lahir"
                  :error-messages="errors.collect('birthplace')"></v-text-field>
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
        birthplace: {
          required: 'Tempat Lahir harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        birthplace: null,
        dialogBirthplace: false,
        doPost: false
      }
    },
    computed: {
      ...mapGetters([
        'userapp/current'
      ]),
      account: function () {
        return this['userapp/current']
      },
      loadDataBirthplace () {
        if (this.dialogBirthplace) {
          this.$validator.reset()
          this.birthplace = this.account.profile.birth.place
        }
      },
      closeDialog: function () {
        if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch === null) {
          this.doPost = false
          this.dialogBirthplace = false
          this.resetAll()
        } else if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch !== null) {
          this.doPost = false
          this.$validator.reset()
        }
      }
    },
    methods: {
      closeDialogButton () {
        this.dialogBirthplace = !this.dialogBirthplace
      },
      postUpdate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let data = {
                id: this.account.profile._id,
                birth: {
                  place: this.birthplace,
                  day: this.account.profile.birth.day
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
      this.$root.$on('openDialogBirthplace', () => {
        this.dialogBirthplace = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
