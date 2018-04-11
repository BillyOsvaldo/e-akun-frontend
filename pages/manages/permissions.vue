<template>
  <div class="permissions-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="permissions"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;" class="text-xs-left">{{ props.item._id }}</td>
        <td style="font-weight: 500;">{{ (props.item.app === null) ? 'Semua Aplikasi' : props.item.app.name }}</td>
        <td class="text-xs-left">{{ props.item.administrator.name }}</td>
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
        @click.native="$root.$emit('openDialogAddPermissions')"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <dialogAdd/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/manages/permissions/_add'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
export default {
  data: () => ({
    dialog: false,
    tableCreated: false,
    scrollBottom: false,
    nextPage: false,
    sortValue: {},
    skipPage: 0,
    total: 0,
    windowSize: {
      x: 0,
      y: 0
    },
    headers: [
      { text: 'ID Permissions', align: 'left', value: 'app._id' },
      { text: 'Aplikasi', align: 'left', value: 'app.name' },
      { text: 'Administrator', value: 'administrator.name', sortable: false, align: 'left' }
    ],
    pagination: {
      sortBy: 'app.name',
      rowsPerPage: -1,
      ascending: true
    },
    items: [],
    doResendEmail: false,
    snackbarView: false,
    textSnackbar: '',
    itemAdded: []
  }),
  components: {
    dialogAdd
  },
  computed: {
    ...mapState({
      permissionsmanagement: 'permissionsmanagement'
    }),
    ...mapGetters({
      permissionsList: 'permissionsmanagement/list'
    }),
    loadData () {
      if (typeof this.permissionsList !== 'undefined') {
        this.items = this.permissionsList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'permissions', this.items.length)
        }
        if (this.tempAdded) {
          let total = this.total + this.tempAdded.length
          this.$store.dispatch('setNavigationCount', total)
        }
      }
    },
    loadNextPage () {
      this.getNextPage()
    }
  },
  created () {
    this.$store.commit('permissionsmanagement/clearAll')
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
          this.$store.dispatch('permissionsmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'permissions')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('permissionsmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('permissionsmanagement').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
      this.$store.dispatch('appsselect/find', params)
      this.$store.dispatch('administratorsselect/find', params)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }
      if (this.scrollBottom && !this.nextPage && this.items.length < this.permissionsmanagement.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.permissionsmanagement.pagination.default.total) {
          skipValue = this.permissionsmanagement.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('permissionsmanagement/find', params)
      }
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Daftar Izin Aplikasi')
    generateTable(this, window, 'permissions')
  }
}
</script>

<style lang="sass">
  .permissions
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
