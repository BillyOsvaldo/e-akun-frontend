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
                  label="Nama Aplikasi"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_app"
                  item-text="app"
                  :search-input.sync="search"
                  v-model="app"
                  @change="appOnChange"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-select
                  label="Jenis Pengguna"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_admin"
                  item-text="admin"
                  :search-input.sync="search"
                  v-model="administrator"
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
      app: null,
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
      appList: 'appsselect/list'
    }),
    item_app: function () {
      let _output = []
      if (this.appList.length > 0) {
        let datadefault = {
          _id: null,
          app: 'Semua Aplikasi'
        }
        _output.push(datadefault)
        this.appList.forEach((post) => {
          let item = post.name
          let _data = {
            _id: post._id,
            app: item
          }
          _output.push(_data)
          this.tempItemsApp.push(post)
        })
      } else {
        _output = []
      }
      return _output
    },
    item_admin: function () {
      if (!this.adminList.length) return []
      if (this.appSelected === null) return []

      let _output = []
      this.adminList.forEach((post) => {
        let _data = { _id: post._id, admin: post.name }
        const isSemuaAplikasi = this.appSelected._id === null
        const isNotSemuaAplikasi = this.appSelected._id !== null
        if (isSemuaAplikasi && post.name === 'Super Admin') {
          _output.push(_data)
        } else if (isSemuaAplikasi && post.name === 'Kepala Daerah') {
          _output.push(_data)
        } else if (isNotSemuaAplikasi && post.name === 'Admin Aplikasi') {
          _output.push(_data)
        } else if (isNotSemuaAplikasi && post.name === 'Admin Organisasi') {
          _output.push(_data)
        }
      })
      return _output
    },
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
              app: this.app._id,
              administrator: this.administrator._id
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
      this.app = null
      this.administrator = null
    }
  },
  created () {
    this.$root.$on('opendialogAddAdministrators', () => {
      this.dialogAddAdministrators = true
    })
    let params = {
      query: {}
    }
    this.$store.dispatch('appsselect/find', params)
    this.$store.dispatch('administratorsselect/find', params)
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>