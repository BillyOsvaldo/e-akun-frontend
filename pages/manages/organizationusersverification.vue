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
        <td style="font-weight: 500;">{{ formatName(props.item.user.profile.name) }}</td>
        <td>{{ (props.item.user.profile.nip) ? props.item.user.profile.nip : '-'  }}</td>
        <td>{{ props.item.organization.name }}</td>
        <td>{{ (props.item.organizationstructuresusers.structure) ? (props.item.organizationstructuresusers.organizationstructure.structure.nameOfPosition + (props.item.organizationstructuresusers.organizationstructure.name === null ? '' : ' ' + props.item.organizationstructuresusers.organizationstructure.name)) : '' }}</td>
        <td class="text-xs-center">{{ formatDate(props.item.startDate) }}</td>
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
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
                slot="activator" icon class="mx-0" @click.native="publishItem(props.item)">
                <v-icon color="grey darken-1">done</v-icon>
              </v-btn>
              <span>Publish</span>
            </v-tooltip>
          </div>
        </td>
      </template>
      <template slot="no-data">
        <span>Belum ada data.</span>
      </template>
    </v-data-table>
    <dialogEdit/>
    <dialogPublish/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogEdit from '~/components/dialogs/manages/organizationusers/_edit'
import dialogPublish from '~/components/dialogs/manages/organizationusers/_publish'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
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
      { text: 'Nama', align: 'left', value: 'user.profile.name' },
      { text: 'NIP', align: 'left', value: 'user.profile.nip' },
      { text: 'Organisasi', align: 'left', value: 'organization.name' },
      { text: 'Jabatan', align: 'left', value: 'organizationstructuresusers' },
      { text: 'Tanggal Mulai', sortable: false, align: 'center', value: 'startDate' },
      { text: 'edit', value: 'name', sortable: false, class: 'action' },
      { text: 'publish', value: 'name', sortable: false, class: 'action' }
    ],
    pagination: {
      sortBy: 'user.profile.name',
      rowsPerPage: -1,
      descending: false
    },
    items: [],
    doResendEmail: false,
    snackbarView: false,
    textSnackbar: '',
    tempAdded: []
  }),
  components: {
    dialogEdit,
    dialogPublish
  },
  computed: {
    ...mapState({
      organizationusers: 'organizationusersdraftmanagement'
    }),
    ...mapGetters({
      organizationusersList: 'organizationusersdraftmanagement/list'
    }),
    loadData () {
      if (typeof this.organizationusersList !== 'undefined') {
        this.items = this.organizationusersList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'organizationusers', this.items.length)
        }
        if (this.total) {
          this.$store.dispatch('setNavigationCount', this.total)
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
    this.$store.commit('organizationusersdraftmanagement/clearAll')
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
          this.$store.dispatch('organizationusersdraftmanagement/find', params)
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
      this.$store.dispatch('organizationusersdraftmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('organizationusersdraftmanagement').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
      api.service('organizationusersdraftmanagement').on('removed', (doc) => {
        if (this.tempAdded.length > 0) {
          this.tempAdded.splice(this.tempAdded[this.tempAdded.indexOf(doc._id)], 1)
        } else {
          this.total--
        }
      })
      this.$store.dispatch('organizationsselect/find', params)
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
        this.$store.dispatch('organizationusersdraftmanagement/find', params)
      }
    },
    editItem (item) {
      this.$store.commit('organizationusersdraftmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditorganizationusers')
    },
    publishItem (item) {
      this.$store.commit('organizationusersdraftmanagement/setCurrent', item)
      this.$root.$emit('openDialogPublishorganizationusers')
    },
    formatName (item) {
      return nameFormat(item)
    },
    formatDate (item) {
      if (typeof item !== 'undefined') {
        return defaultDateFormat(item)
      } else {
        return '-'
      }
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Verifikasi Penempatan / Jabatan')
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
</style>
