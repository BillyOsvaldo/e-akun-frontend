<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditAdministrators" persistent scrollable max-width="480">
      <v-card v-if="dialogEditAdministrators">
        <v-card-title class="headline">Ubah Email Administrator</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadData">
              <v-flex xs12>
                <v-text-field
                  v-on:blur="checkEmail"
                  v-model="email"
                  v-validate="'required'"
                  data-vv-name="email"
                  label="Email"
                  :error-messages="errorMessageEmail"></v-text-field>
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
      email: {
        required: 'Email Harus diisi'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogEditAdministrators: false,
      email: null
    }
  },
  computed: {
    ...mapState({
      checkemail: 'checkemail'
    }),
    ...mapGetters({
      admin: 'administratorsmanagement/current'
    }),
    loadData () {
      if (this.dialogEditAdministrators) {
        this.$validator.reset()
        this.email = (typeof this.admin.email === 'undefined') ? '' : this.admin.email
      }
    },
    errorMessageEmail () {
      if (this.checkemail.errorOnFind !== null) {
        return 'Email Sudah Digunakan.'
      } else {
        return this.errors.collect('email')
      }
    }
  },
  watch: {
    email (val) {
      if (val !== null && val.length === 0) {
        this.$store.commit('checkemail/clearFindError')
      }
    }
  },
  methods: {
    checkEmail () {
      this.$store.commit('checkemail/clearFindError')
      if (this.email && this.email !== this.admin.email) {
        let params = {
          query: {
            email: this.email
          }
        }
        this.$store.dispatch('checkemail/find', params)
      }
    },
    appOnChange (val) {
      this.appSelected = val
    },
    onBlur (field) {
      setTimeout(() => this.$validator.validate(field), 500)
    },
    closeDialogButton () {
      this.dialogEditAdministrators = !this.dialogEditAdministrators
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              email: this.email
            }
            let params = {}
            this.$store.commit('administratorsmanagement/clearPatchError')
            this.$store.dispatch('administratorsmanagement/patch', [this.admin._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogEditAdministrators = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('administratorsmanagement/clearPatchError')
      this.$validator.reset()
      this.$store.commit('checkemail/clearFindError')
    }
  },
  created () {
    this.$root.$on('openDialogEditAdministrators', () => {
      this.dialogEditAdministrators = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
