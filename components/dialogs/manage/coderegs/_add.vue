<template>
  <v-layout row justify-center v-bind="closedialogAdd">
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
                  :error-messages="errorMessageEmail"></v-text-field>
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
  import {mapGetters} from 'vuex'
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
      doPostAdd: false,
      hasCheckEmail: false,
      email: null
    }),
    computed: {
      ...mapGetters([
        'userapp/current'
      ]),
      account: function () {
        return this['userapp/current']
      },
      errorMessageEmail () {
        if (this.$store.state.checkuser.errorOnFind !== null) {
          return 'Email telah digunakan.'
        } else {
          if (this.email !== null) {
            return this.errors.collect('email')
          }
        }
      },
      closedialogAdd: function () {
        if (this.doPostAdd && !this.$store.state.coderegs.isCreatePending && this.$store.state.coderegs.errorOnCreate === null) {
          this.doPostAdd = false
          this.dialogAdd = false
          this.resetAll()
          this.email = null
        } else if (this.doPostAdd && !this.$store.state.coderegs.isCreatePending && this.$store.state.coderegs.errorOnCreate !== null) {
          this.doPostAdd = false
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
            if (result && this.hasCheckEmail && this.$store.state.checkuser.errorOnFind === null) {
              let newCodeReg = {
                email: this.email,
                opd: this.account.opd._id
              }
              this.$store.dispatch('coderegs/create', newCodeReg)
              this.doPostAdd = true
            }
          })
      },
      resetAll () {
        this.$store.commit('checkuser/clearFindError')
        this.$store.commit('coderegs/clearPatchError')
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
