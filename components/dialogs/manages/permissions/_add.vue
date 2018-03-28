<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddPermissions" persistent scrollable max-width="480">
      <v-card v-if="dialogAddPermissions">
        <v-card-title class="headline">Tambah Daftar Izin Aplikasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
               <v-select
                  label="Nama Aplikasi"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_app"
                  item-text="app"
                  :search-input.sync="search"
                  v-model="app"
                  v-validate="'required'"
                  data-vv-name="app"
                  :error-messages="errors.collect('app')"
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
                  v-validate="'required'"
                  data-vv-name="administrator"
                  :error-messages="errorMessageAdmin"
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
      app: {
        required: 'Nama Aplikasi harus di isi'
      },
      administrator: {
        required: 'Jenis Pengguna harus di isi'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddPermissions: false,
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
      permissionsmanagement: 'permissionsmanagement'
    }),
    ...mapGetters({
      idadmin: 'permissionsmanagement/list',
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
    errorMessageAdmin () {
      if (this.permissionsmanagement.errorOnCreate !== null) {
        return 'Administrator Sudah Digunakan.'
      } else {
        return this.errors.collect('administrator')
      }
    }
  },
  methods: {
    appOnChange (val) {
      this.appSelected = val
    },
    closeDialogButton () {
      this.dialogAddPermissions = !this.dialogAddPermissions
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              app: this.app._id,
              administrator: this.administrator._id
            }
            this.$store.commit('permissionsmanagement/clearCreateError')
            this.$store.dispatch('permissionsmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddPermissions = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('permissionsmanagement/clearCreateError')
      this.$validator.reset()
      this.app = null
      this.administrator = null
    }
  },
  created () {
    this.$root.$on('openDialogAddPermissions', () => {
      this.dialogAddPermissions = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>