<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogPassword" persistent scrollable max-width="360">
      <v-card v-if="dialogPassword">
        <v-card-title class="headline">Ubah Kata Sandi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="password"
                  type="password"
                  v-validate="'required|min:8'"
                  data-vv-name="password"
                  label="Kata Sandi Baru"
                  :error-messages="this.errors.collect('password')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="confirmpassword"
                  type="password"
                  v-validate="'required|confirmedpass:password'"
                  data-vv-name="confirmpassword"
                  label="Ulangi Kata Sandi Baru"
                  :error-messages="this.errors.collect('confirmpassword')"></v-text-field>
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
        password: {
          required: 'Kata Sandi harus diisi.',
          min: 'Kata Sandi minimal 8 karakter.'
        },
        confirmpassword: {
          required: 'Ulangi Kata Sandi harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        dialogPassword: false,
        password: null,
        confirmpassword: null
      }
    },
    computed: {
      ...mapGetters({
        user: 'usersmanagement/current'
      })
    },
    methods: {
      closeDialogButton () {
        this.dialogPassword = !this.dialogPassword
        this.resetAll()
      },
      postUpdate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let data = {
                password: this.password,
                update: 'account'
              }
              let params = {}
              this.$store.commit('usersmanagement/clearPatchError')
              this.$store.dispatch('usersmanagement/patch', [this.user._id, data, params])
                .then(response => {
                  if (response) {
                    this.dialogPassword = false
                    this.resetAll()
                  }
                })
            }
          })
      },
      resetAll () {
        this.password = null
        this.confirmpassword = null
        this.$store.commit('usersmanagement/clearPatchError')
        this.$store.commit('usersmanagement/clearCurrent')
        this.$validator.reset()
      }
    },
    created () {
      this.$root.$on('openDialogManagePassword', () => {
        this.dialogPassword = true
      })
      this.$validator.localize(customHelptext)
      this.$validator.extend('confirmedpass', {
        getMessage: (field, [args]) => {
          return 'Kata sandi tidak cocok.'
        },
        validate: (field, [args]) => {
          return this[args] === field
        }
      })
    }
  }
</script>
