<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddOrganization" persistent scrollable max-width="480">
      <v-card v-if="dialogAddOrganization">
        <v-card-title class="headline">Tambah Organisasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Organisasi"
                  :error-messages="errors.collect('name')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="address_organization.detail"
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
                  v-model="address_organization.postcode"
                  label="Kode Pos"
                  disabled></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-on:blur="checkEmail"
                  v-on:keyup.enter="postUpdate"
                  v-model="email"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  label="Alamat Email"
                  :error-messages="errorMessageEmail"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="phone"
                  label="No. Telepon"
                  prepend-icon="phone"
                  :mask="mask"
                  v-validate="'required'"
                  data-vv-name="phone"
                  :error-messages="errors.collect('phone')">
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="fax"
                  label="No. Faximile"
                  prepend-icon="phone"
                  :mask="mask"
                  v-validate="'required'"
                  data-vv-name="fax"
                  :error-messages="errors.collect('fax')">
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="site"
                  label="Website"
                  v-validate="'required'"
                  data-vv-name="site"
                  :error-messages="errors.collect('site')">
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-switch
                  color="primary"
                  :label="statusOrg(status)"
                  v-model="status"
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Tambah</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
const customHelptext = {
  en: {
    custom: {
      name: {
        required: 'Nama Organisasi harus diisi'
      },
      address: {
        required: 'Kecamatan atau Kota/Kab harus dipilih'
      },
      detail: {
        required: 'Alamat lengkap harus diisi.'
      },
      email: {
        required: 'Alamat Email harus diisi.',
        email: 'Format Email harus benar.'
      },
      phone: {
        required: 'No. Telepon harus diisi.'
      },
      fax: {
        required: 'No. Faximile harus diisi.'
      },
      site: {
        required: 'Website harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddOrganization: false,
      loading: false,
      search: null,
      address: null,
      cacheItems: true,
      tempItems: [],
      name: null,
      address_organization: {
        detail: '',
        postcode: ''
      },
      email: null,
      mask: '#### - ########',
      phone: null,
      fax: null,
      site: null,
      status: true
    }
  },
  computed: {
    ...mapState({
      checkuser: 'checkuser'
    }),
    ...mapGetters({
      postcodes: 'addresses/list',
      postcodeLists: 'postcodes/list'
    }),
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
    errorMessageEmail () {
      if (this.checkuser.errorOnFind !== null) {
        return 'Email telah digunakan.'
      } else {
        return this.errors.collect('email')
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
        this.address_organization.postcode = detail.kodepos
      }
    },
    email (val) {
      if (val !== null && val.length === 0) {
        this.$store.commit('checkuser/clearFindError')
      }
    }
  },
  methods: {
    statusOrg (data) {
      if (data) {
        return 'Status: Aktif'
      } else {
        return 'Status: Tidak Aktif'
      }
    },
    closeDialogButton () {
      this.dialogAddOrganization = !this.dialogAddOrganization
      this.resetAll()
    },
    checkEmail () {
      this.$store.commit('checkuser/clearFindError')
      if (this.email) {
        let params = {
          query: {
            email: this.email
          }
        }
        console.log(params)
        this.$store.dispatch('checkuser/find', params)
      }
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              name: this.name,
              address: {
                detail: this.address_organization.detail,
                postcode: this.address
              },
              email: this.email,
              phone: this.phone,
              fax: this.fax,
              website: this.site,
              status: this.status
            }
            this.$store.commit('organizationsmanagement/clearCreateError')
            this.$store.dispatch('organizationsmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddOrganization = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('organizationsmanagement/clearCreateError')
      this.$validator.reset()
    }
  },
  created () {
    this.$root.$on('openDialogAddOrg', () => {
      this.dialogAddOrganization = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
