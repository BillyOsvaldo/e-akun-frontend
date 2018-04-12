<template>
  <div class="apps-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="apps"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item._id }}</td>
        <td style="font-weight: 500;">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.url }}</td>
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
        @click.native="$root.$emit('openDialogAddApps')"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <dialogAdd/>
    <dialogEdit/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/manages/apps/_add'
import dialogEdit from '~/components/dialogs/manages/apps/_edit'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
import {appStatusFormat} from '~/utils/format'
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
      { text: 'ID Aplikasi', align: 'left', value: '_id' },
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'URL', value: 'url', sortable: false, align: 'left' },
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
    textSnackbar: '',
    tempAdded: []
  }),
  components: {
    dialogAdd,
    dialogEdit
  },
  computed: {
    ...mapState({
      apps: 'appsmanagement'
    }),
    ...mapGetters({
      appsList: 'appsmanagement/list'
    }),
    loadData () {
      if (typeof this.appsList !== 'undefined') {
        this.items = this.appsList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'apps', this.items.length)
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
    this.$store.commit('appsmanagement/clearAll')
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
          this.$store.dispatch('appsmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'apps')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('appsmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('appsmanagement').on('created', (doc) => {
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

      if (this.scrollBottom && !this.nextPage && this.items.length < this.apps.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.apps.pagination.default.total) {
          skipValue = this.apps.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('appsmanagement/find', params)
      }
    },
    statusFormat (item) {
      return appStatusFormat(item)
    },
    editItem (item) {
      this.$store.commit('appsmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditApps')
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Manajemen Aplikasi')
    generateTable(this, window, 'apps')
  }
}
</script>

<style lang="sass">
  .apps
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
