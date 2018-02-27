<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogNIP" persistent scrollable max-width="360">
      <v-card v-if="dialogNIP">
        <v-card-title class="headline">Ubah NIP</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataNIP">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-on:keyup.enter="postUpdate"
                  v-model="nip"
                  v-validate="'required'"
                  data-vv-name="nip"
                  :mask="maskNIP"
                  label="NIP"
                  :error-messages="errorMessageNIP"></v-text-field>
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
        nip: {
          required: 'NIP harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        dialogNIP: false,
        maskNIP: '######## ###### # ###',
        nip: null
      }
    },
    computed: {
      ...mapGetters({
        user: 'userapp/current'
      }),
      account: function () {
        if (typeof this.user !== 'undefined' || this.user !== null) {
          return this.user
        }
      },
      loadDataNIP () {
        if (this.dialogNIP) {
          this.$validator.reset()
          this.nip = this.account.profile.nip
        }
      },
      errorMessageNIP () {
        return this.errors.collect('nip')
      }
    },
    methods: {
      closeDialogButton () {
        this.dialogNIP = !this.dialogNIP
        this.resetAll()
      },
      postUpdate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result && this.$store.state.checkuser.errorOnFind === null) {
              let data = {
                nip: this.nip,
                update: 'profile'
              }
              let params = {}
              this.$store.commit('userapp/clearPatchError')
              this.$store.dispatch('userapp/patch', [this.account._id, data, params])
                .then(response => {
                  if (response) {
                    this.dialogNIP = false
                    this.resetAll()
                  }
                })
            }
          })
      },
      resetAll () {
        this.password = null
        this.$store.commit('userapp/clearPatchError')
        this.$store.commit('userapp/clearCurrent')
        this.$validator.reset()
      }
    },
    created () {
      this.$root.$on('openDialogManageNIP', () => {
        this.dialogNIP = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
