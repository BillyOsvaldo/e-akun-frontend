<template>
  <div class="organizationstructures-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="organizationstructures"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item.organization.name }}</td>
        <td>{{ props.item.structure.name }}</td>
        <td>{{ props.item.name }}</td>
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
        @click.native="$root.$emit('openDialogAddOrganizationstructures')"
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
import dialogAdd from '~/components/dialogs/manages/organizationstructures/_add'
import dialogEdit from '~/components/dialogs/manages/organizationstructures/_edit'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
import {organizationStructureStatusFormat} from '~/utils/format'
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
      { text: 'Nama Organisasi', align: 'left', value: 'organization.name' },
      { text: 'Struktur', align: 'left', sortable: false, value: 'structure.name' },
      { text: 'Nama dalam Struktur', sortable: false, align: 'left', value: 'name' },
      { text: 'Status', value: 'status', sortable: false, align: 'center' },
      { text: '', value: '', sortable: false, class: 'action' }
    ],
    pagination: {
      sortBy: 'order',
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
    dialogAdd,
    dialogEdit
  },
  computed: {
    ...mapState({
      organizationstructures: 'organizationstructuresmanagement'
    }),
    ...mapGetters({
      organizationstructuresList: 'organizationstructuresmanagement/list'
    }),
    loadData () {
      if (typeof this.organizationstructuresList !== 'undefined') {
        this.items = this.organizationstructuresList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'organizationstructures', this.items.length)
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
    this.$store.commit('organizationstructuresmanagement/clearAll')
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
          this.$store.dispatch('organizationstructuresmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'organizationstructures')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('organizationstructuresmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('organizationstructuresmanagement').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
      let paramsforDialogs = {
        query: {}
      }
      this.$store.dispatch('organizationsselect/find', paramsforDialogs)
      this.$store.dispatch('structuresselect/find', paramsforDialogs)
      this.$store.dispatch('rolesselect/find', paramsforDialogs)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.organizationstructures.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.organizationstructures.pagination.default.total) {
          skipValue = this.organizationstructures.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('organizationstructuresmanagement/find', params)
      }
    },
    statusFormat (item) {
      return organizationStructureStatusFormat(item)
    },
    editItem (item) {
      this.$store.commit('organizationstructuresmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditOrganizationstructures')
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Daftar Struktur Organisasi')
    generateTable(this, window, 'organizationstructures')
  }
}
</script>

<style lang="sass">
  .organizationstructures
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
