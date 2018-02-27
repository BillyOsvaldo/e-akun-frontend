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
        <td class="text-xs-center">{{ props.item.role.name }}</td>
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
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
                slot="activator" icon class="mx-0" @click="resendEmail(props.item)">
                <v-icon color="grey darken-1">group_work</v-icon>
              </v-btn>
              <span>Ubah Role</span>
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
import {mapGetters} from 'vuex'
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
    skipPage: 0,
    windowSize: {
      x: 0,
      y: 0
    },
    headers: [
      { text: 'Nama', align: 'left', value: 'profile.name.first_name' },
      { text: 'ID Akun', value: 'username', align: 'center', sortable: false },
      { text: 'Email', value: 'email', align: 'center', sortable: false },
      { text: 'Role', value: 'role.name', align: 'center', sortable: false },
      { text: '', value: 'name', sortable: false, class: 'action' },
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
    textSnackbar: ''
  }),
  components: {
    dialogPassword,
    dialogEmail,
    dialogNIP
  },
  computed: {
    ...mapGetters({
      organization: 'organizations/current',
      usersmanagementList: 'usersmanagement/list'
    }),
    loadData () {
      if (typeof this.usersmanagementList !== 'undefined') {
        // console.log(this.usersmanagementList)
        this.items = this.usersmanagementList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'users', this.items.length)
        }
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
              organization: this.organization._id,
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
          organization: this.organization._id
        }
      }
      this.$store.dispatch('usersmanagement/find', params)
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
            organization: this.organization._id,
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
    },
    resendEmail (item) {}
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Semua Pengguna')
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
