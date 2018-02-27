<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAdd" persistent scrollable max-width="360">
      <v-card v-if="dialogAdd">
        <v-card-title class="headline">Tambah Kode Registrasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="email"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  label="Alamat Email"
                  v-on:blur="checkEmail"
                  :error-messages="errorMessageEmail"
                  v-on:keyup.enter="postCreated"
                  ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closedialogAddButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postCreated">Tambah</v-btn>
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
    data: () => ({
      dialogAdd: false,
      hasCheckEmail: false,
      email: null
    }),
    computed: {
      ...mapState({
        checkuser: 'checkuser'
      }),
      ...mapGetters({
        user: 'users/current'
      }),
      errorMessageEmail () {
        if (this.checkuser.errorOnFind !== null) {
          return 'Email telah digunakan.'
        } else {
          if (this.email !== null) {
            return this.errors.collect('email')
          }
        }
      }
    },
    watch: {
      email (val) {
        if (typeof val !== 'undefined' && val !== null) {
          if (val.length === 0) {
            this.$store.commit('checkuser/clearFindError')
          }
        }
      }
    },
    methods: {
      checkEmail () {
        this.$store.commit('checkuser/clearFindError')
        if (this.email) {
          let params = {
            query: {
              email: this.email
            }
          }
          this.$store.dispatch('checkuser/find', params)
          this.$nextTick(() => {
            this.hasCheckEmail = true
          })
        }
      },
      closedialogAddButton () {
        this.dialogAdd = !this.dialogAdd
        this.resetAll()
      },
      postCreated () {
        this.$validator.validateAll()
          .then((result) => {
            if (result && this.hasCheckEmail && this.checkuser.errorOnFind === null) {
              let newCodeReg = {
                email: this.email,
                organization: this.user.organization
              }
              this.$store.dispatch('coderegsmanagement/create', newCodeReg)
                .then(response => {
                  if (response) {
                    this.dialogAdd = false
                    this.resetAll()
                  }
                })
            }
          })
      },
      resetAll () {
        this.$store.commit('checkuser/clearFindError')
        this.$store.commit('coderegsmanagement/clearPatchError')
        this.$validator.reset()
        this.hasCheckEmail = false
        this.email = null
      }
    },
    created () {
      this.$root.$on('openDialogAddCodeRegs', () => {
        this.dialogAdd = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
