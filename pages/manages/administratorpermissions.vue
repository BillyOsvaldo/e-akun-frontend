<template>
  <div class="administratorpermissions-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="administratorpermissions"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item._id }}</td>
        <td style="font-weight: 500;">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.tag }}</td>
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
        @click.native="$root.$emit('openDialogAddAdministratorPermissions')"
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
import dialogAdd from '~/components/dialogs/manages/administratorpermissions/_add'
import dialogEdit from '~/components/dialogs/manages/administratorpermissions/_edit'
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
      { text: 'ID Administrator', align: 'left', value: '_id' },
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'Tag', value: 'tag', sortable: false, align: 'left' },
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
      administratorpermissions: 'administratorpermissionsmanagement'
    }),
    ...mapGetters({
      adminpermissionList: 'administratorpermissionsmanagement/list'
    }),
    loadData () {
      if (typeof this.adminpermissionList !== 'undefined') {
        this.items = this.adminpermissionList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'administratorpermissions', this.items.length)
        }
      }
    },
    loadNextPage () {
      this.getNextPage()
    }
  },
  created () {
    this.$store.commit('administratorpermissionsmanagement/clearAll')
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
          this.$store.dispatch('administratorpermissionsmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'administratorpermissions')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('administratorpermissionsmanagement/find', params)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.administratorpermissions.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.administratorpermissions.pagination.default.total) {
          skipValue = this.administratorpermissions.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('administratorpermissionsmanagement/find', params)
      }
    },
    editItem (item) {
      this.$store.commit('administratorpermissionsmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditAdministratorPermissions')
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Manajemen Izin Administrator')
    generateTable(this, window, 'administratorpermissions')
  }
}
</script>

<style lang="sass">
  .administratorpermissions
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
