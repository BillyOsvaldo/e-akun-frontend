<template>
  <div class="organization-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="organization"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.email }}</td>
        <td class="text-xs-center">{{ statusFormat(props.item.status) }}</td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
                slot="activator" icon class="mx-0" @click.native="editItem(props.item)">
                <v-icon color="grey darken-1">edit</v-icon>
              </v-btn>
              <span>Ubah</span>
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
        @click.native="$root.$emit('openDialogAddOrg')"
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
import dialogAdd from '~/components/dialogs/manages/organizations/_add'
import dialogEdit from '~/components/dialogs/manages/organizations/_edit'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
import {organizationStatusFormat} from '~/utils/format'
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
      { text: 'Email', value: 'email', align: 'center', sortable: false },
      { text: 'Status', value: 'status', sortable: false, align: 'center' },
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
      oraganization: 'oraganizationsmanagement'
    }),
    ...mapGetters({
      organizationsList: 'organizationsmanagement/list'
    }),
    loadData () {
      if (typeof this.organizationsList !== 'undefined') {
        this.items = this.organizationsList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'organization', this.items.length)
        }
      }
    },
    loadNextPage () {
      this.getNextPage()
    }
  },
  created () {
    this.$store.commit('organizationsmanagement/clearAll')
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
          this.$store.dispatch('organizationsmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'organization')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('organizationsmanagement/find', params)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.organizations.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.organizations.pagination.default.total) {
          skipValue = this.organizations.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('organizationsmanagement/find', params)
      }
    },
    statusFormat (item) {
      return organizationStatusFormat(item)
    },
    editItem (item) {
      this.$store.commit('organizationsmanagement/setCurrent', item)
      this.$store.dispatch('postcodes/get', item.address.postcode)
        .then(response => {
          this.$root.$emit('openDialogEditOrg')
        })
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Manajemen Organisasi')
    generateTable(this, window, 'organization')
  }
}
</script>

<style lang="sass">
  .organization
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>