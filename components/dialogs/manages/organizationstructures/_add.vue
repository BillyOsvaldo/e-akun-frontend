<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddOrganizationStructures" persistent scrollable max-width="480">
      <v-card v-if="dialogAddOrganizationStructures">
        <v-card-title class="headline">Tambah Daftar Struktur Organisasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
               <v-select
                  label="Pilih Organisasi"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_organizations"
                  item-text="organization"
                  :search-input.sync="searchOrganization"
                  v-validate="'required'"
                  data-vv-name="organization"
                  :error-messages="errors.collect('organization')"
                  v-model="organization"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-select
                  label="Pilih Struktur"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_structures"
                  item-text="structure"
                  :search-input.sync="searchStructure"
                  v-validate="'required'"
                  data-vv-name="structure"
                  :error-messages="errors.collect('structure')"
                  v-model="structure"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field
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
                  :search-input.sync="searchParent"
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
                  :search-input.sync="searchAltParent"
                  v-model="alt_parent"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="roles"
                  label="Roles"
                  multiple
                  chips
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
      dialogAddOrganizationStructures: false,
      loading: false,
      searchOrganization: null,
      searchStructure: null,
      searchParent: null,
      searchAltParent: null,
      organization: null,
      structure: null,
      parent: null,
      alt_parent: null,
      name: null,
      roles: null,
      status: false
    }
  },
  computed: {
    ...mapState({
      organizationstructuresmanagement: 'organizationstructuresmanagement'
    }),
    ...mapGetters({
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
    itemsRoles () {
      let _output = []
      if (this.rolesselect.length > 0) {
        this.rolesselect.forEach((role) => {
          _output.push(role.name)
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
    }
  },
  watch: {
    organization (val) {
      if (val) {
        this.onChangeOrganization(val)
      }
    }
  },
  methods: {
    onChangeOrganization (val) {
      if (val) {
        this.$store.commit('structureparentselect/clearAll')
        let params = {
          query: {
            id: val._id
          }
        }
        this.$store.dispatch('structureparentselect/find', params)
      }
    },
    statusOrgStructur (data) {
      if (data) {
        return 'Status: Aktif'
      } else {
        return 'Status: Tidak Aktif'
      }
    },
    closeDialogButton () {
      this.dialogAddOrganizationStructures = !this.dialogAddOrganizationStructures
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              organization: this.organization._id,
              structure: this.structure._id,
              name: this.name,
              parent: this.parent,
              alt_parent: this.alt_parent,
              role: this.roleList,
              status: this.status
            }
            this.$store.commit('organizationstructuresmanagement/clearCreateError')
            this.$store.dispatch('organizationstructuresmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddOrganizationStructures = false
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
    resetAll () {
      this.$store.commit('organizationstructuresmanagement/clearCreateError')
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
    this.$root.$on('openDialogAddOrganizationstructures', () => {
      this.dialogAddOrganizationStructures = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>