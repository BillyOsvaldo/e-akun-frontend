<template>
  <v-layout row justify-center v-if="account" v-bind="closeDialog">
    <v-dialog v-model="dialogEmail" persistent scrollable max-width="360">
      <v-card v-if="dialogEmail">
        <v-card-title class="headline">Ubah Alamat Email</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataEmail">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-on:blur="checkEmail"
                  v-on:keyup.enter="postUpdate"
                  v-model="email"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  label="Alamat Email"
                  :error-messages="errorMessageEmail"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-on:keyup.enter="postUpdate"
                  v-model="password"
                  type="password"
                  v-validate="'required'"
                  data-vv-name="password"
                  label="Kata Sandi"
                  :error-messages="errorMessagePassword"></v-text-field>
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
  import {setValueText} from '~/utils/format'
  const customHelptext = {
    en: {
      custom: {
        email: {
          required: 'Alamat Email harus diisi.',
          email: 'Format Email harus benar.'
        },
        password: {
          required: 'Kata Sandi harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        dialogEmail: false,
        email: null,
        password: null,
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
      loadDataEmail () {
        if (this.dialogEmail) {
          this.$validator.reset()
          this.email = this.account.email
        }
      },
      errorMessageEmail () {
        if (this.$store.state.checkuser.errorOnFind !== null) {
          return 'Email telah digunakan.'
        } else {
          return this.errors.collect('email')
        }
      },
      errorMessagePassword: function () {
        if (this.$store.state.userapp.errorOnPatch !== null) {
          return 'Kata Sandi tidak benar.'
        } else {
          return this.errors.collect('password')
        }
      },
      closeDialog: function () {
        if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch === null) {
          this.doPost = false
          this.dialogEmail = false
          this.resetAll()
        } else if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch !== null) {
          this.doPost = false
          this.$validator.reset()
        }
      }
    },
    watch: {
      email (val) {
        if (val.length === 0) {
          this.$store.commit('checkuser/clearFindError')
        }
      }
    },
    methods: {
      checkEmail () {
        this.$store.commit('checkuser/clearFindError')
        if (this.email && this.email !== setValueText(this.account, 'email', false)) {
          let params = {
            query: {
              email: this.email
            }
          }
          this.$store.dispatch('checkuser/find', params)
        }
      },
      closeDialogButton () {
        this.dialogEmail = !this.dialogEmail
        this.resetAll()
      },
      postUpdate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result && this.$store.state.checkuser.errorOnFind === null) {
              let data = {
                email: this.email,
                comparepassword: this.password,
                update: 'account'
              }
              let params = {}
              this.$store.commit('userapp/clearPatchError')
              this.$store.dispatch('userapp/patch', [this.account._id, data, params])
              this.doPost = true
            }
          })
      },
      resetAll () {
        this.password = null
        this.$store.commit('userapp/clearPatchError')
        this.$validator.reset()
      }
    },
    created () {
      this.$root.$on('openDialogEmail', () => {
        this.dialogEmail = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
