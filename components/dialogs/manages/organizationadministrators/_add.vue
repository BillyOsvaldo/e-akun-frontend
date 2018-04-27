<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddAdministratorsOrganizations" persistent scrollable max-width="600">
      <v-card v-if="dialogAddAdministratorsOrganizations">
        <v-card-title class="headline">Tambah Administrator Organisasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select
                  autofocus
                  label="Pilih Pengguna"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_users"
                  item-text="user"
                  :search-input.sync="searchUser"
                  v-validate="'required'"
                  data-vv-name="user"
                  :error-messages="errors.collect('user')"
                  :cache-items="cacheItems"
                  v-model="user"
                ></v-select>
              </v-flex>
               <v-flex xs12>
                <v-select
                  v-model="permissions"
                  label="Permissions"
                  multiple
                  chips
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
      user: {
        required: 'Nama harus di isi'
      },
      permission: {
        required: 'Permissions harus di isi'
      }
    }
  }
}
export default {
  data () {
    return {
      dialogAddAdministratorsOrganizations: false,
      cacheItems: true,
      user: null,
      searchUser: null,
      loading: false,
      search: null,
      tempItems: [],
      tempItemsApp: [],
      permissions: [],
      administrator: null,
      id: null,
      userSelected: null
    }
  },
  computed: {
    ...mapState({
      administratorsorganization: 'administratorsorganizationsmanagement'
    }),
    ...mapGetters({
      administratorsorganizationList: 'administratorsorganizationsmanagement/list',
      adminorganizationList: 'administratorsorganizationsmanagement/current',
      usersselect: 'usersselect/list',
      organizationusersList: 'organizationusersdraftmanagement/list',
      permissionsselect: 'permissionsadminorganizationsselect/list'
    }),
    item_users () {
      let _output = []
      if (this.usersselect.length > 0) {
        this.usersselect.forEach((item) => {
          if (typeof this.organizationusersList.find((i) => i.user._id === item._id) !== 'object') {
            let data = {
              _id: item._id,
              user: ((item.profile.name.first_title === '' ? '' : item.profile.name.first_title + '.')) + item.profile.name.first_name + ' ' + item.profile.name.last_name + ((item.profile.name.last_title === '' ? '' : ', ' + item.profile.name.last_title)) + (item.profile.nip ? ' - ' + item.profile.nip : '')
            }
            _output.push(data)
            this.tempItems.push(item)
          }
        })
      }
      return _output
    },
    itemsPermissions () {
      let _output = []
      if (this.permissionsselect.length > 0) {
        this.permissionsselect.forEach((permission) => {
          _output.push(permission.app.name)
        })
      }
      return _output
    },
    permissionList () {
      let output = []
      this.permissions.forEach((name) => {
        let permission = this.permissionsselect.find((item) => item.app.name === name)
        output.push(permission._id)
      })
      return output
    }
  },
  watch: {
    searchUser (val) {
      this.cacheItems = false
      this.$store.commit('usersselect/clearAll')
      if (this.user !== null && typeof this.user === 'object') {
        let item = this.tempItems.find((item) => item._id === this.user._id)
        if (item !== undefined) {
          let value = ((item.profile.name.first_title === '' ? '' : item.profile.name.first_title + '.')) + item.profile.name.first_name + ' ' + item.profile.name.last_name + ((item.profile.name.last_title === '' ? '' : ', ' + item.profile.name.last_title)) + (item.profile.nip ? ' - ' + item.profile.nip : '')
          let _data = {
            _id: item._id,
            user: value
          }
          this.user = _data
          this.item_users.push(_data)
        }
      }
      if (val && val.length >= 3) {
        let params = {
          query: {
            $first_name_or_last_name: val
          }
        }
        this.$store.dispatch('usersselect/find', params)
      }
    },
    user (val) {
      if (val) {
        this.userOnChange(val)
      }
    }
  },
  methods: {
    userOnChange (val) {
      if (val) {
        let select = this.usersselect.find((item) => item._id === val._id)
        if (select && select.permissions) {
          this.permissions = []
          select.permissions.forEach((item) => {
            this.permissions.push(item.app.name)
          })
        }
      }
    },
    onBlur (field) {
      setTimeout(() => this.$validator.validate(field), 500)
    },
    closeDialogButton () {
      this.dialogAddAdministratorsOrganizations = !this.dialogAddAdministratorsOrganizations
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              permissions: this.permissionList
            }
            let params = {}
            this.$store.commit('administratorsorganizationsmanagement/clearCreateError')
            this.$store.dispatch('administratorsorganizationsmanagement/patch', [this.user._id, data, params])
              .then(response => {
                if (response) {
                  if (this.administratorsorganizationList.find((item) => item._id !== response._id)) {
                    this.$store.commit('administratorsorganizationsmanagement/addItem', response)
                  }
                  this.dialogAddAdministratorsOrganizations = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('administratorsorganizationsmanagement/clearCreateError')
      this.$validator.reset()
      this.name = null
      this.app = null
      this.administrator = null
      this.user = null
      this.permissions = []
    }
  },
  created () {
    this.$root.$on('opendialogAddAdministratorsOrganizations', () => {
      this.dialogAddAdministratorsOrganizations = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>
<style lang="sass">
</style>