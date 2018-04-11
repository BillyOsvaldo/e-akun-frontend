<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditOrganizationUsers" persistent scrollable max-width="480">
      <v-card v-if="dialogEditOrganizationUsers">
        <v-card-title class="headline">Ubah Penempatan / Jabatan</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md v-bind="doLoadingData">
            <div style="text-align:center" v-if="!hasLoadedData">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <v-layout wrap v-if="hasLoadedData">
              <v-flex xs12>
                <v-select
                  autofocus
                  label="Pilih Pengguna"
                  autocomplete
                  :loading="loading"
                  v-bind:items="item_users"
                  item-text="user"
                  :search-input.sync="searchUser"
                  :cache-items="cacheItems"
                  v-model="user"
                  v-validate="'required'"
                  data-vv-name="user"
                  disabled
                ></v-select>
              </v-flex>
              <v-flex>
                <v-select
                  label="Pilih Organisasi"
                  autocomplete
                  :loading="loading"
                  :items="item_organizations"
                  item-text="organization"
                  item-value="_id"
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
                  item-value="_id"
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
                  item-value="_id"
                  item-text="inside"
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
                    label="Mulai Tanggal"
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
          <v-btn flat
            :disabled="!hasLoadedData"
            color="blue darken-1"
            @click.native="postUpdate">Ubah</v-btn>
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
      organization: {
        required: 'Pilih Organisasi harus di isi'
      },
      user: {
        required: 'Pilih Pengguna harus di isi'
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
      dialogEditOrganizationUsers: false,
      loading: false,
      hasLoadedData: false,
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
    ...mapState({}),
    ...mapGetters({
      organizationusersdraftmanagement: 'organizationusersdraftmanagement/current',
      usersselect: 'usersselect/list',
      organizationsselect: 'organizationsselect/list',
      organizationstructuresselect: 'organizationstructuresselect/list'
    }),
    doLoadingData () {
      if (this.organizationstructuresselect) {
        if (this.organizationstructuresselect.length > 0) {
          this.hasLoadedData = true
        }
      } else {
        this.hasLoadedData = false
      }
    },
    item_users () {
      let _output = []
      if (this.usersselect.length > 0) {
        this.usersselect.forEach((item) => {
          let data = {
            _id: item._id,
            user: ((item.profile.name.first_title === '' ? '' : item.profile.name.first_title + '.')) + item.profile.name.first_name + ' ' + item.profile.name.last_name + ((item.profile.name.last_title === '' ? '' : ', ' + item.profile.name.last_title)) + (item.profile.nip ? ' - ' + item.profile.nip : '')
          }
          _output.push(data)
          this.tempItems.push(item)
        })
      } else {
        _output = []
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
    dialogEditOrganizationUsers (val) {
      if (val) {
        setTimeout(() => {
          this.loadData()
        }, 500)
      }
    },
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
        this.onChangeOrganization(val)
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
    onChangeOrganizationStructure (id) {
      if (id) {
        let orgStructurDoc = this.item_organizationstructures.find((item) => item._id === id)
        if ((orgStructurDoc.organizationstructure.search(/(sub|seksi)/i)) === -1) {
          this.inside = id
        } else {
          let orgStructurSelDoc = this.organizationstructuresselect.find((item) => item._id === id)
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
      this.dialogEditOrganizationUsers = !this.dialogEditOrganizationUsers
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              user: this.user._id,
              organization: this.organization,
              inside: this.inside,
              startDate: parseFormDate(this.startDate)
            }
            if (this.organizationStructure) {
              data.organizationStructure = this.organizationStructure
              data.organizationStructureStartDate = parseFormDate(this.startDate)
            }
            console.log(data)
            let params = {}
            this.$store.commit('organizationusersdraftmanagement/clearPatchError')
            this.$store.dispatch('organizationusersdraftmanagement/patch', [this.organizationusersdraftmanagement._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogEditOrganizationUsers = false
                  this.resetAll()
                }
              })
          }
        })
    },
    selectFilter (select) {
      return select._id
    },
    filterUser (item) {
      let output = {
        _id: item._id,
        user: ((item.profile.name.first_title === '' ? '' : item.profile.name.first_title + '.')) + item.profile.name.first_name + ' ' + item.profile.name.last_name + ((item.profile.name.last_title === '' ? '' : ', ' + item.profile.name.last_title)) + (item.profile.nip ? ' - ' + item.profile.nip : '')
      }
      this.item_users.push(output)
      return output
    },
    loadData () {
      if (this.dialogEditOrganizationUsers) {
        this.$validator.reset()
        this.user = (typeof this.organizationusersdraftmanagement.user === 'undefined') ? '' : this.filterUser(this.organizationusersdraftmanagement.user)
        this.organization = (typeof this.organizationusersdraftmanagement.organization === 'undefined') ? '' : this.selectFilter(this.organizationusersdraftmanagement.organization)
        let params = {
          query: {
            organization: this.organization
          }
        }
        this.$store.dispatch('organizationstructuresselect/find', params)
          .then(response => {
            this.organizationStructure = (typeof this.organizationusersdraftmanagement.organizationstructuresusers.organizationstructure === 'undefined') ? '' : this.selectFilter(this.organizationusersdraftmanagement.organizationstructuresusers.organizationstructure)
          })
        this.date_for_startDate = moment(this.organizationusersdraftmanagement.startDate).format('YYYY-MM-DD')
        this.startDate = formatFormDate(moment(this.organizationusersdraftmanagement.startDate).format('YYYY-MM-DD'))
      }
    },
    resetAll () {
      this.$store.commit('organizationusersdraftmanagement/clearPatchError')
      this.$store.commit('organizationstructuresselect/clearAll')
      this.hasLoadedData = false
      this.$validator.reset()
      this.organization = null
      this.menu_startDate = false
      this.date_for_startDate = null
      this.startDate = null
      this.organizationStructure = null
      this.inside = null
    }
  },
  created () {
    this.$root.$on('openDialogEditorganizationusers', () => {
      this.dialogEditOrganizationUsers = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>