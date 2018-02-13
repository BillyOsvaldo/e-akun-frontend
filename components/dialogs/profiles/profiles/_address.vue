<template>
  <v-layout row justify-center v-if="account" v-bind="closeDialog">
    <v-dialog v-model="dialogAddress" persistent scrollable max-width="480">
      <v-card v-if="dialogAddress">
        <v-card-title class="headline">Ubah Alamat Lengkap</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataAddress">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="temp_profile.detail"
                  v-validate="'required'"
                  data-vv-name="detail"
                  label="Alamat Lengkap"
                  :error-messages="errors.collect('detail')"></v-text-field>
              </v-flex>
              <v-flex>
                <v-select
                  label="Kelurahan/Desa atau Kecamatan"
                  autocomplete
                  :loading="loading"
                  v-bind:items="items"
                  item-text="addr"
                  item-value="_id"
                  :cache-items="cacheItems"
                  :search-input.sync="search"
                  v-model="address"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="temp_profile.postcode"
                  label="Kode Pos"
                  disabled></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
const customHelptext = {
  en: {
    custom: {
      address: {
        required: 'Kecamatan atau Kota/Kab harus dipilih'
      },
      detail: {
        required: 'Alamat lengkap harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddress: false,
      doPost: false,
      loading: false,
      search: null,
      address: null,
      cacheItems: true,
      tempItems: [],
      temp_profile: {
        detail: '',
        postcode: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'userapp/current',
      'addresses/list'
    ]),
    account: function () {
      return this['userapp/current']
    },
    postcodes: function () {
      return this['addresses/list']
    },
    loadDataAddress () {
      if (this.dialogAddress) {
        this.temp_profile.detail = this.account.profile.address.detail
        this.temp_profile.postcode = this.account.profile.address.postcode.kodepos
      }
    },
    items: function () {
      let _output = []

      if (this.postcodes.length > 0) {
        this.postcodes.forEach((post) => {
          let item = post.provinsi + ', ' + post.kotakab + ', ' + post.kecamatan + ', ' + post.kelurahan
          let _data = {
            _id: post._id,
            addr: item
          }
          _output.push(_data)
          this.tempItems.push(post)
        })
      } else {
        _output = []
      }
      return _output
    },
    closeDialog: function () {
      if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch === null) {
        this.doPost = false
        this.dialogAddress = false
        this.resetAll()
      } else if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch !== null) {
        this.doPost = false
        this.$validator.reset()
      }
    }
  },
  watch: {
    search (val) {
      this.cacheItems = false
      this.$store.commit('addresses/clearAll')
      if (typeof this.address === 'string') {
        let detail = this.tempItems.find((item) => item._id === this.address)
        let item = detail.provinsi + ', ' + detail.kotakab + ', ' + detail.kecamatan + ', ' + detail.kelurahan
        let _data = {
          _id: detail._id,
          addr: item
        }
        this.address = _data
        this.items.push(_data)
      }

      if (val && val.length >= 3) {
        let params = {
          query: {
            q: val
          }
        }
        val && this.$store.dispatch('addresses/find', params)
      }
    },
    address (val) {
      if (typeof val === 'string') {
        let detail = this.tempItems.find((item) => item._id === val)
        this.temp_profile.postcode = detail.kodepos
      }
    }
  },
  methods: {
    createdListDefaultItem () {
      let detail = this.account.profile.address.postcode
      let item = detail.provinsi + ', ' + detail.kotakab + ', ' + detail.kecamatan + ', ' + detail.kelurahan
      let _data = {
        _id: detail._id,
        addr: item
      }
      this.address = _data
      this.items.push(_data)
      this.tempItems.push(detail)
    },
    closeDialogButton () {
      this.dialogAddress = !this.dialogAddress
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              id: this.account.profile._id,
              address: {
                detail: this.temp_profile.detail,
                postcode: this.address
              },
              update: 'profile'
            }
            let params = {}
            this.$store.commit('userapp/clearPatchError')
            this.$store.dispatch('userapp/patch', [this.account._id, data, params])
            this.doPost = true
          }
        })
    },
    resetAll () {
      this.$store.commit('userapp/clearPatchError')
      this.$validator.reset()
    }
  },
  created () {
    this.$root.$on('openDialogAddress', () => {
      this.dialogAddress = true
      this.createdListDefaultItem()
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
