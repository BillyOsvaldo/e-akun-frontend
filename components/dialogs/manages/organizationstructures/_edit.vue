<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditOrganizationStructures" persistent scrollable max-width="480">
      <v-card v-if="dialogEditOrganizationStructures">
        <v-card-title class="headline">Ubah Daftar Struktur Organisasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
               <v-select
                  label="Pilih Organisasi"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_organizations"
                  item-value="_id"
                  item-text="organization"
                  :search-input.sync="search"
                  v-validate="'required'"
                  data-vv-name="organization"
                  :error-messages="errors.collect('organization')"
                  v-model="organization"
                  disabled
                ></v-select>
              </v-flex>
              <v-flex>
                <v-select
                  label="Pilih Struktur"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_structures"
                  item-value="_id"
                  item-text="structure"
                  :search-input.sync="search"
                  v-validate="'required'"
                  data-vv-name="structure"
                  :error-messages="errors.collect('structure')"
                  v-model="structure"
                  disabled
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  disabled
                  v-model="name"
                  label="Nama dalam Struktur"></v-text-field>
              </v-flex>
              <v-flex>
                <v-select
                  label="Pilih Parent"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_parents"
                  item-value="_id"
                  item-text="parent"
                  :search-input.sync="search"
                  v-model="parent"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-select
                  label="Pilih Alternatif Parent"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_parents"
                  item-value="_id"
                  item-text="parent"
                  :search-input.sync="search"
                  v-model="alt_parent"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="roles"
                  label="Roles"
                  multiple
                  chips
                  tags
                  :items="itemsRoles">
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-switch
                  color="primary"
                  :label="statusOrgStructur(status)"
                  v-model="status"
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">ubah</v-btn>
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
      organization: {
        required: 'Pilih Organisasi harus di isi'
      },
      structure: {
        required: 'Pilih Struktur harus di isi'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogEditOrganizationStructures: false,
      loading: false,
      search: null,
      organization: null,
      structure: null,
      name: null,
      parent: null,
      alt_parent: null,
      roles: null,
      status: false
    }
  },
  computed: {
    ...mapState({
      organizationstructuresmanagement: 'organizationstructuresmanagement'
    }),
    ...mapGetters({
      organizationstructures: 'organizationstructuresmanagement/current',
      organizationsselect: 'organizationsselect/list',
      structuresselect: 'structuresselect/list',
      structureparentselect: 'structureparentselect/list',
      rolesselect: 'rolesselect/list'
    }),
    item_organizations () {
      let _output = []
      if (this.organizationsselect.length > 0) {
        this.organizationsselect.forEach((item) => {
          let data = {
            _id: item._id,
            organization: item.name
          }
          _output.push(data)
        })
      }
      return _output
    },
    item_structures () {
      let _output = []
      if (this.structuresselect.length > 0) {
        this.structuresselect.forEach((item) => {
          let data = {
            _id: item._id,
            structure: item.name
          }
          _output.push(data)
        })
      }
      return _output
    },
    item_parents () {
      let _output = []
      if (this.structureparentselect.length > 0) {
        this.structureparentselect.forEach((item) => {
          let data = {
            _id: item._id,
            parent: (item.structure[0].name + (item.name === null ? '' : ' ' + item.name))
          }
          if (item.structure[0]._id !== this.structure) {
            _output.push(data)
          }
        })
      }
      return _output
    },
    itemsRoles () {
      let _output = []
      if (this.rolesselect.length > 0) {
        this.rolesselect.forEach((role) => {
          _output.push(role.name)
        })
      }
      return _output
    }
  },
  methods: {
    onChangeOrganization (val) {
      if (val) {
        this.$store.commit('structureparentselect/clearAll')
        let params = {
          query: {
            id: val
          }
        }
        this.$store.dispatch('structureparentselect/find', params)
          .then(response => {
            console.log(response)
          })
      }
    },
    statusOrgStructur (data) {
      if (data) {
        return 'Status: Aktif'
      } else {
        return 'Status: Tidak Aktif'
      }
    },
    loadData () {
      if (this.dialogEditOrganizationStructures) {
        this.$validator.reset()
        this.organization = (typeof this.organizationstructures.organization === 'undefined') ? '' : this.selectFilter(this.organizationstructures.organization)
        if (this.organization) {
          this.onChangeOrganization(this.organization)
        }
        this.structure = (typeof this.organizationstructures.structure === 'undefined') ? '' : this.selectFilter(this.organizationstructures.structure)
        this.parent = (typeof this.organizationstructures.parent === 'undefined') ? '' : this.organizationstructures.parent
        this.alt_parent = (typeof this.organizationstructures.alt_parent === 'undefined') ? '' : this.organizationstructures.alt_parent
        this.name = (typeof this.organizationstructures.name === 'undefined') ? '' : this.organizationstructures.name
        this.roles = (typeof this.organizationstructures.role === 'undefined') ? '' : this.rolesFilter(this.organizationstructures.role)
        this.status = (typeof this.organizationstructures.status === 'undefined') ? false : this.organizationstructures.status
      }
    },
    closeDialogButton () {
      this.dialogEditOrganizationStructures = !this.dialogEditOrganizationStructures
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              organization: this.organization,
              structure: this.structure,
              name: this.name,
              parent: this.parent,
              alt_parent: this.alt_parent,
              role: this.roleList,
              status: this.status
            }
            let params = {}
            this.$store.commit('organizationstructuresmanagement/clearPatchError')
            this.$store.dispatch('organizationstructuresmanagement/patch', [this.organizationstructures._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogEditOrganizationStructures = false
                  this.resetAll()
                }
              })
          }
        })
    },
    roleList () {
      let output = []
      this.roles.forEach((name) => {
        let role = this.rolesselect.find((item) => item.name === name)
        output.push(role._id)
      })
      return output
    },
    selectFilter (select) {
      return select._id
    },
    rolesFilter (roles) {
      let output = []
      if (roles !== null) {
        if (roles.length > 1) {
          roles.forEach((r) => {
            let role = this.rolesselect.find((item) => item._id === r._id)
            output.push(role.name)
          })
        } else {
          let role = this.rolesselect.find((item) => item._id === roles._id)
          output.push(role.name)
        }
      }
      return output
    },
    resetAll () {
      this.$store.commit('organizationstructuresmanagement/clearPatchError')
      this.$validator.reset()
      this.organization = null
      this.structure = null
      this.parent = null
      this.alt_parent = null
      this.name = null
      this.roles = null
      this.status = false
    }
  },
  created () {
    this.$root.$on('openDialogEditOrganizationstructures', () => {
      this.dialogEditOrganizationStructures = true
      this.loadData()
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>