<template>
  <div class="organizationusers-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="organizationusers"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
      item-key="_id"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ formatName(props.item.profile.name) }}</td>
        <td>{{ (props.item.profile.nip) ? props.item.profile.nip : '-' }}</td>
        <td>{{ props.item.organizationuser.organization.name }}</td>
        <td>{{ (props.item.position) ? (props.item.position.structure.nameOfPosition + (props.item.position.name === null ? '' : ' ' + props.item.position.name)) : '' }}</td>
        <td class="text-xs-center">{{ formatDate(props.item.organizationuser.startDate) }}</td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
                slot="activator" icon class="mx-0" @click.native="expandItem(props)">
                <v-icon color="grey darken-1">{{ (props.expanded) ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
              </v-btn>
              <span>Lihat Detail</span>
            </v-tooltip>
          </div>
        </td>
      </template>
      <template slot="expand" slot-scope="props" style="display:none">
        <v-data-table
          :headers="expandheaders"
          :items="expandFilter(props.item)"
          hide-actions>
            <template slot="items" slot-scope="props">
              <td style="font-weight: 500;">{{ props.item.organization_name }}</td>
              <td><span v-html="props.item.positions"></span></td>
              <td>{{ formatDate(props.item.startDate) + ' - ' + formatDate(props.item.endDate) }}</td>
            </template>
            <template slot="no-data">
              <span>Belum ada data.</span>
            </template>
        </v-data-table>
      </template>
      <template slot="no-data">
        <span>Belum ada data.</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import {generateTable, resizeTable, loadData, expandRow} from '~/utils/datatable'
import {nameFormat, defaultDateFormat} from '~/utils/format'
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
      { text: 'Nama', align: 'left', value: 'profile.name' },
      { text: 'NIP', align: 'left', value: 'profile.nip' },
      { text: 'Organisasi', align: 'left', value: 'organizationuser.organization.name' },
      { text: 'Jabatan', align: 'left', value: 'position' },
      { text: 'Tanggal Mulai', sortable: false, align: 'center', value: 'startDate' },
      { text: '', value: 'name', sortable: false, class: 'action' }
    ],
    pagination: {
      sortBy: 'profile.name',
      rowsPerPage: -1,
      descending: false
    },
    items: [],
    doResendEmail: false,
    snackbarView: false,
    textSnackbar: '',
    expandAllItems: [],
    expandheaders: [
      { text: 'Organisasi', sortable: false, align: 'left', value: 'organization.name' },
      { text: 'Jabatan', sortable: false, align: 'left', value: 'positions' },
      { text: 'Masa Kerja', sortable: false, align: 'left', value: 'startDate' }
    ],
    itemAdded: []
  }),
  computed: {
    ...mapState({
      organizationusers: 'organizationusersmanagement'
    }),
    ...mapGetters({
      organizationusersList: 'organizationusersmanagement/list'
    }),
    loadData () {
      if (typeof this.organizationusersList !== 'undefined') {
        this.items = this.organizationusersList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'organizationusers', this.items.length)
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
    this.$store.commit('organizationusersmanagement/clearAll')
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
          this.$store.dispatch('organizationusersmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'organizationusers')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('organizationusersmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('organizationusersmanagement').on('created', (doc) => {
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

      if (this.scrollBottom && !this.nextPage && this.items.length < this.organizationusers.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.organizationusers.pagination.default.total) {
          skipValue = this.organizationusers.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('organizationusersmanagement/find', params)
      }
    },
    editItem (item) {
      this.$store.commit('organizationusersmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditorganizationusers')
    },
    expandItem (props) {
      props.expanded = !props.expanded
      expandRow(this, 'organizationusers', props.index, 6)
      let params = {
        query: {
          user: props.item._id
        }
      }
      this.$store.dispatch('organizationusersexpand/find', params)
        .then(response => {
          let _data = []
          response.data.forEach((item) => {
            let i = {
              _id: props.item._id,
              organization_name: item.organization.name,
              positions: this.positionList(item.positions),
              startDate: item.startDate,
              endDate: item.endDate
            }
            _data.push(i)
          })
          let output = {
            _id: props.item._id,
            data: _data
          }
          this.expandAllItems.push(output)
          this.expandFilter(props.item)
        })
    },
    expandFilter (item) {
      let output = []
      let data = this.expandAllItems.find((i) => i._id === item._id)
      if (typeof data !== 'undefined') {
        output = data.data
      }
      return output
    },
    positionList (positions) {
      let output = '<ul>'
      positions.forEach((item) => {
        let list = (item.organizationstructure.structure.nameOfPosition + (item.organizationstructure.name === null ? '' : ' ' + item.organizationstructure.name))
        let startDate = this.formatDate(item.startDate)
        let endDate = this.formatDate(item.endDate)
        output += '<li>' + list + ' (' + startDate + ' - ' + endDate + ')</li>'
      })
      output += '</ul>'
      return output
    },
    formatName (item) {
      return nameFormat(item)
    },
    formatDate (item) {
      if (typeof item !== 'undefined') {
        return defaultDateFormat(item)
      } else {
        return 'Sekarang'
      }
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Penempatan / Jabatan')
    generateTable(this, window, 'organizationusers')
  }
}
</script>

<style lang="sass">
  .organizationusers
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
  .datatable__expand-row
    display: block
  .datatable__expand-content
    .datatable.table
      background: #f7f7f7
</style>
