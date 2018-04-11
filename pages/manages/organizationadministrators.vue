<template>
  <div class="administratorsorganization-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="administratorsorganization"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item.profile.name.first_name + ' ' + props.item.profile.name.last_name }}</td>
        <td style="font-weight: 500;">{{ props.item.username }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td style="font-weight: 500;">
        <ul>
          <li v-for="permission in props.item.permissions">
            {{ (permission.app === null) ? 'Semua Aplikasi' : permission.app.name }}
          </li>
        </ul>
        </td>
         <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
                slot="activator" icon class="mx-0" @click.native="EditItem(props.item)">
                <v-icon color="grey darken-1">edit</v-icon>
              </v-btn>
              <span>Ubah Data</span>
            </v-tooltip>
          </div>
        </td>
      </template>
      <template slot="no-data">
        <span>Belum ada data.</span>
      </template>
    </v-data-table>
    <v-fab-transition>
      <v-btn
        color="red"
        dark
        fixed
        bottom
        right
        fab
        @click.native="$root.$emit('opendialogAddAdministratorsOrganizations')"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <dialogAdd/>
    <dialogEdit/>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/manages/organizationadministrators/_add'
import dialogEdit from '~/components/dialogs/manages/organizationadministrators/_edit'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
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
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'Username', align: 'left', value: 'username' },
      { text: 'Email', value: 'email', sortable: false, align: 'left' },
      { text: 'Nama Aplikasi', align: 'left', value: 'permissions' },
      { text: '', align: 'left', value: '' },
      { text: '', value: 'name', sortable: false, class: 'action' }
    ],
    pagination: {
      sortBy: 'name',
      rowsPerPage: -1,
      descending: true
    },
    items: [],
    doResendEmail: false,
    snackbarView: false,
    textSnackbar: ''
  }),
  components: {
    dialogAdd,
    dialogEdit
  },
  computed: {
    ...mapState({
      administratorsorganization: 'administratorsorganizationsmanagement'
    }),
    ...mapGetters({
      adminorganizationList: 'administratorsorganizationsmanagement/list'
    }),
    loadData () {
      if (typeof this.adminorganizationList !== 'undefined') {
        this.items = this.adminorganizationList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'administratorsorganization', this.items.length)
        }
      }
    },
    loadNextPage () {
      this.getNextPage()
    }
  },
  created () {
    this.$store.commit('administratorsorganizationsmanagement/clearAll')
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
              $sort: this.sortValue
            }
          }
          this.$store.dispatch('administratorsorganizationsmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'administratorsorganization')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('administratorsorganizationsmanagement/find', params)
      let paramsforDialogs = {
        query: {}
      }
      this.$store.dispatch('appsselect/find', paramsforDialogs)
      this.$store.dispatch('permissionsadminorganizationsselect/find', paramsforDialogs)
      this.$store.dispatch('administratorsselect/find', paramsforDialogs)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.administratorsorganization.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.administratorsorganization.pagination.default.total) {
          skipValue = this.administratorsorganization.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('administratorsorganizationsmanagement/find', params)
      }
    },
    EditItem (item) {
      this.$store.commit('administratorsorganizationsmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditAdministratorOrganization')
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Manajemen Administrator Organization')
    generateTable(this, window, 'administratorsorganization')
  }
}
</script>

<style lang="sass">
  .administratorsorganization
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
