<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditPassword" persistent scrollable max-width="480">
      <v-card v-if="dialogEditPassword">
        <v-card-title class="headline">Ubah Password Administrator</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadData">
              <v-flex xs12>
                <v-text-field
                  v-model="password"
                  v-validate="'required'"
                  data-vv-name="password"
                  label="Password"
                  type="password"
                  :error-messages="errors.collect('password')"></v-text-field>
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
      password: {
        required: 'Password Harus diisi'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogEditPassword: false,
      password: null
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
      admin: 'administratorsmanagement/current'
    }),
    loadData () {
      if (this.dialogEditPassword) {
        this.$validator.reset()
        this.password = (typeof this.admin.password === 'undefined') ? '' : this.admin.password
      }
    }
  },
  methods: {
    appOnChange (val) {
      this.appSelected = val
    },
    closeDialogButton () {
      this.dialogEditPassword = !this.dialogEditPassword
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              password: this.password
            }
            let params = {}
            this.$store.commit('administratorsmanagement/clearPatchError')
            this.$store.dispatch('administratorsmanagement/patch', [this.admin._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogEditPassword = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('administratorsmanagement/clearPatchError')
      this.$validator.reset()
    }
  },
  created () {
    this.$root.$on('openDialogEditPassword', () => {
      this.dialogEditPassword = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
