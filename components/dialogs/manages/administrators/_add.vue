<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddAdministrators" persistent scrollable max-width="600">
      <v-card v-if="dialogAddAdministrators">
        <v-card-title class="headline">Tambah Administrator</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-on:blur="checkUsername"
                  v-model="username"
                  v-validate="'required'"
                  data-vv-name="username"
                  label="Username"
                  :error-messages="errorMessageUsername">
                  </v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-on:blur="checkEmail"
                  v-model="email"
                  v-validate="'required'"
                  data-vv-name="email"
                  label="Email"
                  :error-messages="errorMessageEmail"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  type="password"
                  v-model="password"
                  v-validate="'required'"
                  data-vv-name="password"
                  label="Password"
                  :error-messages="errors.collect('password')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="permissions"
                  autocomplate
                  label="Permissions"
                  :items="itemsPermissions">
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Tambah</v-btn>
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
      username: {
        required: 'Username harus di isi'
      },
      email: {
        required: 'Email harus di isi'
      },
      password: {
        required: 'Password harus di isi'
      },
      permission: {
        required: 'Permission harus di isi'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddAdministrators: false,
      username: null,
      email: null,
      password: null,
      loading: false,
      search: null,
      tempItemsApp: [],
      tempItemsAdmin: [],
      permissions: null,
      administrator: null,
      id: null,
      appSelected: null
    }
  },
  computed: {
    ...mapState({
      checkusername: 'checkusername',
      checkemail: 'checkemail',
      administratorsmanagement: 'administratorsmanagement'
    }),
    ...mapGetters({
      adminList: 'administratorsselect/list',
      appList: 'appsselect/list',
      permissionsselect: 'permissionsselect/list'
    }),
    errorMessageUsername () {
      if (this.checkusername.errorOnFind !== null) {
        return 'Username Sudah Digunakan.'
      } else {
        return this.errors.collect('username')
      }
    },
    errorMessageEmail () {
      if (this.checkemail.errorOnFind !== null) {
        return 'Email Sudah Digunakan.'
      } else {
        return this.errors.collect('email')
      }
    },
    itemsPermissions () {
      let _output = []
      if (this.permissionsselect.length > 0) {
        this.permissionsselect.forEach((permission) => {
          _output.push(permission.administrator.name + ((permission.app === null) ? '' : ': ' + permission.app.name))
        })
      }
      return _output
    },
    permissionList () {
      let names = this.permissions.split(': ')
      if (names.length > 1) {
        let permission = this.permissionsselect.find((item) => (item.administrator.name === names[0] && item.app.name === names[1]))
        return permission._id
      } else {
        let permission = this.permissionsselect.find((item) => item.administrator.name === name)
        return permission._id
      }
    }
  },
  watch: {
    username (val) {
      if (val !== null && val.length === 0) {
        this.$store.commit('checkusername/clearFindError')
      }
    },
    email (val) {
      if (val !== null && val.length === 0) {
        this.$store.commit('checkemail/clearFindError')
      }
    }
  },
  methods: {
    checkUsername () {
      this.$store.commit('checkusername/clearFindError')
      if (this.username) {
        let params = {
          query: {
            username: this.username
          }
        }
        this.$store.dispatch('checkusername/find', params)
      }
    },
    checkEmail () {
      this.$store.commit('checkemail/clearFindError')
      if (this.email) {
        let params = {
          query: {
            email: this.email
          }
        }
        this.$store.dispatch('checkemail/find', params)
      }
    },
    onBlur (field) {
      setTimeout(() => this.$validator.validate(field), 500)
    },
    appOnChange (val) {
      this.appSelected = val
    },
    closeDialogButton () {
      this.dialogAddAdministrators = !this.dialogAddAdministrators
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              username: this.username,
              email: this.email,
              password: this.password,
              permissions: this.permissionList
            }
            this.$store.commit('administratorsmanagement/clearCreateError')
            this.$store.dispatch('administratorsmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddAdministrators = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('administratorsmanagement/clearCreateError')
      this.$store.commit('checkemail/clearFindError')
      this.$store.commit('checkusername/clearFindError')
      this.$validator.reset()
      this.username = null
      this.email = null
      this.password = null
      this.permissions = null
    }
  },
  created () {
    this.$root.$on('opendialogAddAdministrators', () => {
      this.dialogAddAdministrators = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>