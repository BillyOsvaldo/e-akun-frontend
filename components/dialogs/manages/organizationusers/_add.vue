<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddOrganizationUsers" persistent scrollable max-width="480">
      <v-card v-if="dialogAddOrganizationUsers">
        <v-card-title class="headline">Tambah Penempatan / Jabatan</v-card-title>
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
              <v-flex>
                <v-select
                  label="Pilih Organisasi"
                  autocomplete
                  :loading="loading"
                  :items="item_organizations"
                  item-text="organization"
                  :search-input.sync="search"
                  v-validate="'required'"
                  data-vv-name="organization"
                  :error-messages="errors.collect('organization')"
                  v-model="organization"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-select
                  label="Pilih Jabatan"
                  autocomplete
                  :loading="loading"
                  :items="item_organizationstructures"
                  item-text="organizationstructure"
                  :search-input.sync="search"
                  v-model="organizationStructure"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-select
                  label="Pilih Penempatan dalam Organisasi"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_insides"
                  item-text="inside"
                  item-value="_id"
                  :search-input.sync="search"
                  v-model="inside"
                  v-validate="'required'"
                  data-vv-name="inside"
                  :error-messages="errors.collect('inside')"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu_startDate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Mulai Tanggal Penempatan/Jabatan"
                    v-model="startDate"
                    v-validate="'required'"
                    data-vv-name="startDate"
                    data-vv-as="startDate"
                    prepend-icon="event"
                    validate-on-blur
                    readonly
                    @blur="onBlur('startDate')"
                    :error-messages="errors.collect('startDate')"
                  ></v-text-field>
                  <v-date-picker
                    locale="id"
                    v-model="date_for_startDate"
                    @input="startDate = formatDate($event)"
                    no-title scrollable actions>
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
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
import moment from 'moment'
import {formatFormDate, parseFormDate} from '~/utils/format'
moment.locale('id')
const customHelptext = {
  en: {
    custom: {
      user: {
        required: 'Pilih Pengguna harus di isi'
      },
      organization: {
        required: 'Pilih Organisasi harus di isi'
      },
      startDate: {
        required: 'Tanggal Mulai harus diisi.'
      },
      inside: {
        required: 'Penempatan dalam Organisasi harus dipilih.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddOrganizationUsers: false,
      loading: false,
      cacheItems: true,
      tempItems: [],
      searchUser: null,
      search: null,
      user: null,
      organization: null,
      menu_startDate: false,
      date_for_startDate: null,
      startDate: null,
      organizationStructure: null,
      inside: null
    }
  },
  computed: {
    ...mapState({
      organizationusersdraftmanagement: 'organizationusersdraftmanagement'
    }),
    ...mapGetters({
      usersselect: 'usersselect/list',
      organizationsselect: 'organizationsselect/list',
      organizationstructuresselect: 'organizationstructuresselect/list',
      organizationusersList: 'allorganizationusersdraft/list'
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
    item_organizationstructures () {
      let _output = []
      if (this.organizationstructuresselect.length > 0) {
        this.organizationstructuresselect.forEach((item) => {
          let data = {
            _id: item._id,
            organizationstructure: (item.structure.nameOfPosition + (item.name === null ? '' : ' ' + item.name))
          }
          _output.push(data)
        })
      }
      return _output
    },
    item_insides () {
      let _output = []
      if (this.organizationstructuresselect.length > 0) {
        this.organizationstructuresselect.forEach((item) => {
          let data = {
            _id: item._id,
            inside: (item.structure.name + (item.name === null ? '' : ' ' + item.name))
          }
          if ((item.structure.name.search(/(sub|seksi)/i)) === -1) {
            _output.push(data)
          }
        })
      }
      return _output
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
    organization (val) {
      if (val) {
        this.onChangeOrganization(val._id)
      }
    },
    organizationStructure (val) {
      if (val) {
        this.onChangeOrganizationStructure(val)
      }
    }
  },
  methods: {
    onChangeOrganization (_id) {
      if (_id) {
        this.$store.commit('organizationstructuresselect/clearAll')
        let params = {
          query: {
            organization: _id
          }
        }
        this.$store.dispatch('organizationstructuresselect/find', params)
      }
    },
    onChangeOrganizationStructure (val) {
      if (val) {
        if ((val.organizationstructure.search(/(sub|seksi)/i)) === -1) {
          this.inside = val._id
        } else {
          let orgStructurSelDoc = this.organizationstructuresselect.find((item) => item._id === val._id)
          this.inside = orgStructurSelDoc.parent
        }
        if (this.startDate) {
          this.organizationStructureStartDate = this.startDate
        }
      }
    },
    formatDate (value) {
      return formatFormDate(value)
    },
    onBlur (field) {
      setTimeout(() => this.$validator.validate(field), 500)
    },
    closeDialogButton () {
      this.dialogAddOrganizationUsers = !this.dialogAddOrganizationUsers
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              user: this.user,
              organization: this.organization._id,
              inside: this.inside,
              startDate: parseFormDate(this.startDate)
            }
            if (this.organizationStructure) {
              data.organizationStructure = this.organizationStructure._id
              data.organizationStructureStartDate = parseFormDate(this.startDate)
            }
            this.$store.commit('organizationusersdraftmanagement/clearCreateError')
            this.$store.dispatch('organizationusersdraftmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddOrganizationUsers = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('organizationusersdraftmanagement/clearCreateError')
      this.$validator.reset()
      this.organization = null
      this.user = null
      this.date_for_startDate = null
      this.startDate = null
      this.organizationStructure = null
      this.menu_organizationStructureStartDate = false
      this.date_for_organizationStructureStartDate = null
      this.organizationStructureStartDate = null
      this.inside = null
    }
  },
  created () {
    this.$root.$on('openDialogAddOrganizationUsers', () => {
      this.dialogAddOrganizationUsers = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>