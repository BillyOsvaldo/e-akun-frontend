<template>
  <v-layout row justify-center>
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
                  v-validate="'required'"
                  data-vv-name="address"
                  :error-messages="errors.collect('address')"
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
    ...mapGetters({
      user: 'users/current',
      postcodes: 'addresses/list',
      profile: 'profiles/current',
      postcodeLists: 'postcodes/list'
    }),
    loadDataAddress () {
      if (this.dialogAddress) {
        this.temp_profile.detail = this.profile.address.detail
        if (typeof this.profile.address.postcode !== 'undefined') {
          let _postcode = this.postcodeLists.find((item) => item._id === this.profile.address.postcode)
          if (typeof _postcode !== 'undefined') {
            this.temp_profile.postcode = _postcode.kodepos
          }
        }
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
      if (typeof this.profile.address.postcode !== 'undefined') {
        let detail = this.postcodeLists.find((item) => item._id === this.profile.address.postcode)
        let item = detail.provinsi + ', ' + detail.kotakab + ', ' + detail.kecamatan + ', ' + detail.kelurahan
        let _data = {
          _id: detail._id,
          addr: item
        }
        this.address = _data
        this.items.push(_data)
        this.tempItems.push(detail)
      }
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
              id: this.profile._id,
              address: {
                detail: this.temp_profile.detail,
                postcode: this.address
              },
              update: 'profile'
            }
            let params = {}
            console.log(data)
            this.$store.commit('usersmanagement/clearPatchError')
            this.$store.dispatch('usersmanagement/patch', [this.user._id, data, params])
              .then(response => {
                this.$store.dispatch('postcodes/get', response.profile.address.postcode)
                  .then(response => {
                    this.dialogAddress = false
                    this.resetAll()
                  })
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('usersmanagement/clearPatchError')
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
