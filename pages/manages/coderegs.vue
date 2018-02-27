<template>
  <div class="codereg-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="codereg"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item.email }}</td>
        <td class="text-xs-center">{{ props.item.code }}</td>
        <td class="text-xs-center">{{ createdFormat(props.item.createdAt_timestamp) }}</td>
        <td class="text-xs-center">{{ statusFormat(props.item.status) }}</td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              :disabled="((props.item.status) ? true : false)"
              top
              >
              <v-btn
                :disabled="((props.item.status) ? true : false)"
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
              :disabled="((props.item.status) ? true : false)"
              top
              >
              <v-btn
                :disabled="((props.item.status) ? true : false)"
                slot="activator" icon class="mx-0" @click="actionResendEmail(props.item)">
                <v-icon color="grey darken-1">send</v-icon>
              </v-btn>
              <span>Kirim Ulang</span>
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
        @click.native="$root.$emit('openDialogAddCodeRegs')"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <dialogAdd/>
    <dialogEdit/>
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
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/manages/coderegs/_add'
import dialogEdit from '~/components/dialogs/manages/coderegs/_edit'
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
      { text: 'Email', align: 'left', value: 'email' },
      { text: 'Kode', value: 'code', align: 'center', sortable: false },
      { text: 'Dibuat', value: 'createdAt_timestamp', align: 'center' },
      { text: 'Status', value: 'status', align: 'center' },
      { text: '', value: 'name', sortable: false, class: 'action' },
      { text: '', value: 'name', sortable: false, class: 'action' }
    ],
    pagination: {
      sortBy: 'createdAt_timestamp',
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
      coderegs: 'coderegs',
      resendEmail: 'resend-email'
    }),
    ...mapGetters({
      organization: 'organizations/current',
      coderegList: 'coderegsmanagement/list'
    }),
    loadData () {
      if (typeof this.coderegList !== 'undefined') {
        this.items = this.coderegList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'codereg', this.items.length)
        }
      }
    },
    loadNextPage () {
      this.getNextPage()
    },
    showSnackbar () {
      if (this.doResendEmail && !this.resendEmail.isPatchPending && this.resendEmail.errorOnPatch === null) {
        this.textSnackbar = 'Kode Registrasi berhasil dikirim.'
        this.doResendEmail = false
        this.snackbarView = true
      }
    }
  },
  created () {
    this.$store.commit('coderegsmanagement/clearAll')
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
          this.$store.dispatch('coderegs/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'codereg')
    },
    initialize () {
      let params = {
        query: {
          organization: this.organization._id
        }
      }
      this.$store.dispatch('coderegsmanagement/find', params)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.coderegs.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.coderegs.pagination.default.total) {
          skipValue = this.coderegs.pagination.default.total
        }
        let params = {
          query: {
            organization: this.organization._id,
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('coderegsmanagement/find', params)
      }
    },
    createdFormat (item) {
      return createdAtFormat(item)
    },
    statusFormat (item) {
      return coderegStatusFormat(item)
    },
    editItem (item) {
      this.$store.commit('coderegsmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditCodeRegs')
    },
    actionResendEmail (item) {
      this.doResendEmail = true
      let data = {
        type: 'codereg'
      }
      let params = {}
      this.$store.dispatch('resend-email/patch', [item.email, data, params])
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Kode Registrasi')
    generateTable(this, window, 'codereg')
  }
}
</script>

<style lang="sass">
  .codereg
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
