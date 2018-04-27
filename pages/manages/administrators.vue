<template>
  <div class="administrators-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="administrators"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item._id }}</td>
        <td style="font-weight: 500;">{{ props.item.username }}</td>
        <td style="font-weight: 500; overflow: hidden; text-overflow: ellipsis;">{{ props.item.email }}</td>
        <td style="font-weight: 500;">{{ props.item.permissions[0].administrator.name + ((props.item.permissions[0].app) ? ' ' + props.item.permissions[0].app.name : '') }}</td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
                slot="activator" icon class="mx-0" @click.native="editItem(props.item)">
                <v-icon color="grey darken-1">mail</v-icon>
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
                slot="activator" icon class="mx-0" @click.native="editPass(props.item)">
                <v-icon color="grey darken-1">https</v-icon>
              </v-btn>
              <span>Ubah Password</span>
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
        class="btn--floating--custom"
        color="red"
        dark
        fixed
        bottom
        right
        fab
        @click.native="$root.$emit('opendialogAddAdministrators')"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <dialogAdd/>
    <dialogEdit/>
    <dialogEditPassword/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/manages/administrators/_add'
import dialogEdit from '~/components/dialogs/manages/administrators/_edit'
import dialogEditPassword from '~/components/dialogs/manages/administrators/_editPassword'
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
      { text: 'ID Admin', align: 'left', value: '_id' },
      { text: 'Username', align: 'left', value: 'username' },
      { text: 'Email', align: 'left', value: 'email' },
      { text: 'Hak Akses', align: 'left', value: 'permissions' },
      { text: 'email', align: 'left', value: '' },
      { text: 'password', value: 'username', sortable: false, class: 'action' }
    ],
    pagination: {
      sortBy: 'username',
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
    dialogEdit,
    dialogEditPassword
  },
  computed: {
    ...mapState({
      administrators: 'administratorsmanagement'
    }),
    ...mapGetters({
      adminList: 'administratorsmanagement/list'
    }),
    loadData () {
      if (typeof this.adminList !== 'undefined') {
        this.items = this.adminList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'administrators', this.items.length)
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
    this.$store.commit('administratorsmanagement/clearAll')
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
              $sort: this.sortValue,
              $where: 'this.administrators.length > 0'
            }
          }
          this.$store.dispatch('administratorsmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'administrators')
    },
    initialize () {
      let params = {
        query: { $where: 'this.administrators.length > 0' }
      }
      this.$store.dispatch('administratorsmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('administratorsmanagement').on('created', (doc) => {
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
      this.$store.dispatch('appsselect/find', paramsforDialogs)
      this.$store.dispatch('permissionsselect/find', paramsforDialogs)
      this.$store.dispatch('administratorsselect/find', paramsforDialogs)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.administrators.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.administrators.pagination.default.total) {
          skipValue = this.administrators.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('administratorsmanagement/find', params)
      }
    },
    editItem (item) {
      this.$store.commit('administratorsmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditAdministrators')
    },
    editPass (item) {
      this.$store.commit('administratorsmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditPassword')
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Manajemen Administrators')
    generateTable(this, window, 'administrators')
  }
}
</script>

<style lang="sass">
  .administrators
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
