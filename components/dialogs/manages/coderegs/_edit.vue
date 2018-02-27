<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEdit" persistent scrollable max-width="360">
      <v-card v-if="dialogEdit">
        <v-card-title class="headline">Ubah Kode Registrasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataEdit">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="email"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  label="Alamat Email"
                  v-on:blur="checkEmail"
                  :error-messages="errorMessageEmail"
                  v-on:keyup.enter="postPatched"
                  ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closedialogEditButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postPatched">Simpan</v-btn>
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
      dialogEdit: false,
      email: null
    }),
    computed: {
      ...mapState({
        checkuser: 'checkuser'
      }),
      ...mapGetters({
        codereg: 'coderegsmanagement/current'
      }),
      loadDataEdit () {
        if (this.dialogEdit) {
          this.$validator.reset()
          this.email = this.codereg.email
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
        if (val.length === 0) {
          this.$store.commit('checkuser/clearFindError')
        }
      }
    },
    methods: {
      checkEmail () {
        this.$store.commit('checkuser/clearFindError')
        if (this.email && this.codereg.email) {
          let params = {
            query: {
              email: this.email
            }
          }
          this.$store.dispatch('checkuser/find', params)
        }
      },
      closedialogEditButton () {
        this.dialogEdit = !this.dialogEdit
        this.resetAll()
      },
      postPatched () {
        this.$validator.validateAll()
          .then((result) => {
            if (result && this.checkuser.errorOnFind === null) {
              let editCodeReg = {
                email: this.email
              }
              let params = {}
              this.$store.dispatch('coderegsmanagement/patch', [this.codereg._id, editCodeReg, params])
                .then(response => {
                  if (response) {
                    this.dialogEdit = false
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
      }
    },
    created () {
      this.$root.$on('openDialogEditCodeRegs', () => {
        this.dialogEdit = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
