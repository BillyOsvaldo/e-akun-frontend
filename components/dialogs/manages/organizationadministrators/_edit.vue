<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditAdministratorsOrganizations" persistent scrollable max-width="600">
      <v-card v-if="dialogEditAdministratorsOrganizations">
        <v-card-title class="headline">Ubah Administrator Organisasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadData">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="user"
                  v-validate="'required'"
                  data-vv-name="user"
                  label="Nama Pengguna"
                  disabled
                  :error-messages="errors.collect('user')"></v-text-field>
              </v-flex>
               <v-flex xs12>
                <v-select
                  v-model="permissions"
                  label="Permissions"
                  multiple
                  chips
                  tags
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
      user: {
        required: 'Nama harus di isi'
      }
    }
  }
}
export default {
  data () {
    return {
      dialogEditAdministratorsOrganizations: false,
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
      adminorganizationList: 'administratorsorganizationsmanagement/current',
      usersselect: 'usersselect/list',
      organizationusersList: 'organizationusersdraftmanagement/list',
      permissionsselect: 'permissionsadminorganizationsselect/list'
    }),
    loadData () {
      if (this.dialogEditAdministratorsOrganizations) {
        this.$validator.reset()
        this.user = (typeof this.adminorganizationList.profile.name.first_name === 'undefined') ? '' : this.adminorganizationList.profile.name.first_name + ' '
        this.user += (typeof this.adminorganizationList.profile.name.last_name === 'undefined') ? '' : this.adminorganizationList.profile.name.last_name
        this.permissions = (typeof this.adminorganizationList.permissions === 'undefined') ? '' : this.permissionsFilter(this.adminorganizationList.permissions)
      }
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
      this.dialogEditAdministratorsOrganizations = !this.dialogEditAdministratorsOrganizations
      this.resetAll()
    },
    permissionsFilter (permissions) {
      let output = []
      if (permissions !== null) {
        permissions.forEach((p) => {
          let permission = this.permissionsselect.find((item) => item._id === p._id)
          output.push(permission.app.name)
        })
      }
      return output
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
            this.$store.dispatch('administratorsorganizationsmanagement/patch', [this.adminorganizationList._id, data, params])
              .then(response => {
                if (response) {
                  if (response.permissions.length === 0) {
                    this.$store.commit('administratorsorganizationsmanagement/removeItem', response._id)
                  }
                  this.dialogEditAdministratorsOrganizations = false
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
    this.$root.$on('openDialogEditAdministratorOrganization', () => {
      this.dialogEditAdministratorsOrganizations = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>
<style lang="sass">
</style>