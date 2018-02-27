<template>
  <v-layout row justify-center>
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
  import {mapState, mapGetters} from 'vuex'
  const customHelptext = {
    en: {
      custom: {
        email: {
          required: 'Alamat Email harus diisi.',
          email: 'Format Email harus benar.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        dialogEmail: false,
        email: null
      }
    },
    computed: {
      ...mapState({
        checkuser: 'checkuser'
      }),
      ...mapGetters({
        organization: 'organizations/current'
      }),
      loadDataEmail () {
        if (this.dialogEmail) {
          this.$validator.reset()
          this.email = this.organization.email
        }
      },
      errorMessageEmail () {
        if (this.checkuser.errorOnFind !== null) {
          return 'Email telah digunakan.'
        } else {
          return this.errors.collect('email')
        }
      }
    },
    watch: {
      email (val) {
        if (val !== null && val.length === 0) {
          this.$store.commit('checkuser/clearFindError')
        }
      }
    },
    methods: {
      checkEmail () {
        this.$store.commit('checkuser/clearFindError')
        if (this.email && this.email !== this.organization.email) {
          let params = {
            query: {
              email: this.email
            }
          }
          console.log(params)
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
            if (result && this.checkuser.errorOnFind === null) {
              let data = {
                email: this.email
              }
              let params = {}
              this.$store.commit('organizationsmanagement/clearPatchError')
              this.$store.dispatch('organizationsmanagement/patch', [this.organization._id, data, params])
                .then(response => {
                  if (response) {
                    this.dialogEmail = false
                    this.resetAll()
                  }
                })
            }
          })
      },
      resetAll () {
        this.password = null
        this.$store.commit('organizationsmanagement/clearPatchError')
        this.$validator.reset()
      }
    },
    created () {
      this.$root.$on('openDialogOrgEmail', () => {
        this.dialogEmail = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
