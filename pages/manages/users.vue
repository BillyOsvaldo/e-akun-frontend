<template>
  <div class="users-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="users"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ (props.item.profile.name.first_name + ' ' + props.item.profile.name.last_name) }}</td>
        <td class="text-xs-center">{{ props.item.username }}</td>
        <td class="text-xs-center">{{ props.item.email }}</td>
        <td class="text-xs-center">{{ (props.item.organizationuser) ? (props.item.organizationuser.inside.structure.name + (props.item.organizationuser.inside.name === null ? '' : ' ' + props.item.organizationuser.inside.name)) : '' }}</td>
        <td class="text-xs-center">{{ (props.item.position) ? (props.item.position.structure.nameOfPosition + (props.item.position.name === null ? '' : ' ' + props.item.position.name)) : '' }}</td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top>
              <v-btn
                slot="activator" icon class="mx-0" @click.native="editPassword(props.item)">
                <v-icon color="grey darken-1">security</v-icon>
              </v-btn>
              <span>Ubah Kata Sandi</span>
            </v-tooltip>
          </div>
        </td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top>
              <v-btn
                slot="activator" icon class="mx-0" @click="editEmail(props.item)">
                <v-icon color="grey darken-1">email</v-icon>
              </v-btn>
              <span>Ubah Email</span>
            </v-tooltip>
          </div>
        </td>
      </template>
      <template slot="no-data">
        <span>Belum ada data.</span>
      </template>
    </v-data-table>
    <dialogPassword/>
    <dialogEmail/>
    <dialogNIP/>
    <v-snackbar
      v-bind="showSnackbar"
      top
      v-model="snackbarView"
      >
      {{ textSnackbar }}
      <v-btn flat color="pink" @click.native="snackbarView = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogPassword from '~/components/dialogs/manages/users/_password'
import dialogEmail from '~/components/dialogs/manages/users/_email'
import dialogNIP from '~/components/dialogs/manages/users/_nip'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
import {createdAtFormat, coderegStatusFormat} from '~/utils/format'
export default {
  data: () => ({
    dialog: false,
    tableCreated: false,
    scrollBottom: false,
    nextPage: false,
    sortValue: {},
    total: 0,
    skipPage: 0,
    windowSize: {
      x: 0,
      y: 0
    },
    headers: [
      { text: 'Nama', align: 'left', value: 'profile.name.first_name' },
      { text: 'ID Akun', value: 'username', align: 'center', sortable: false },
      { text: 'Email', value: 'email', align: 'center', sortable: false },
      { text: 'Penempatan', value: 'organizationusers.inside', align: 'center', sortable: false },
      { text: 'Jabatan', value: 'position', align: 'center', sortable: false },
      { text: '', value: 'name', sortable: false, class: 'action' },
      { text: '', value: 'name', sortable: false, class: 'action' }
    ],
    pagination: {
      sortBy: 'profile.name.first_name',
      rowsPerPage: -1,
      descending: false
    },
    items: [],
    snackbarView: false,
    textSnackbar: '',
    tempAdded: []
  }),
  components: {
    dialogPassword,
    dialogEmail,
    dialogNIP
  },
  computed: {
    ...mapState({
      usersmanagement: 'usersmanagement'
    }),
    ...mapGetters({
      organization: 'organizations/current',
      usersmanagementList: 'usersmanagement/list'
    }),
    loadData () {
      if (typeof this.usersmanagementList !== 'undefined') {
        // console.log(this.usersmanagementList)
        if (this.tempAdded) {
          let total = this.total + this.tempAdded.length
          this.$store.dispatch('setNavigationCount', total)
        }
        this.items = this.usersmanagementList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'users', this.items.length)
        }
        // console.log(this.usersmanagementList)
      }
    },
    loadNextPage () {
      this.getNextPage()
    },
    showSnackbar () {}
  },
  created () {
    this.$store.commit('usersmanagement/clearAll')
    this.initialize()
  },
  watch: {
    pagination: {
      handler (val) {
        if (val.sortBy !== null) {
          let sortBy = val.sortBy.replace('_timestamp', '')
          this.sortValue = {
            [sortBy]: (val.descending === true) ? -1 : 1
          }
          let params = {
            query: {
              'organizationusers.organization': this.organization._id,
              $sort: this.sortValue
            }
          }
          this.$store.dispatch('usersmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'users')
    },
    initialize () {
      let params = {
        query: {
          'organizationusers.organization': this.organization._id
        }
      }
      this.$store.dispatch('usersmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('usersmanagement').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.$store.state.usersmanagement.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.$store.state.usersmanagement.pagination.default.total) {
          skipValue = this.$store.state.usersmanagement.pagination.default.total
        }
        let params = {
          query: {
            'organizationusers.organization': this.organization._id,
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('usersmanagement/find', params)
      }
    },
    createdFormat (item) {
      return createdAtFormat(item)
    },
    statusFormat (item) {
      return coderegStatusFormat(item)
    },
    editItem (item) {
      this.$store.commit('usersmanagement/setCurrent', item)
    },
    editEmail (item) {
      this.$store.commit('usersmanagement/setCurrent', item)
      this.$root.$emit('openDialogManageEmail')
    },
    editNIP (item) {
      this.$store.commit('usersmanagement/setCurrent', item)
      this.$root.$emit('openDialogManageNIP')
    },
    editPassword (item) {
      this.$store.commit('usersmanagement/setCurrent', item)
      this.$root.$emit('openDialogManagePassword')
    }
  },
  mounted () {
    generateTable(this, window, 'users')
  }
}
</script>

<style lang="sass">
  .users
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
