<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddApps" persistent scrollable max-width="480">
      <v-card v-if="dialogAddApps">
        <v-card-title class="headline">Tambah Daftar Aplikasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Aplikasi"
                  :error-messages="errors.collect('name')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="description"
                  v-validate="'required'"
                  data-vv-name="description"
                  label="Deskripsi Aplikasi"
                  :error-messages="errors.collect('description')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="service"
                  v-validate="'required'"
                  data-vv-name="service"
                  label="Service"
                  :error-messages="errors.collect('service')"></v-text-field>
              </v-flex>
               <v-flex xs12>
                <v-text-field
                  v-model="url"
                  v-validate="'required'"
                  data-vv-name="url"
                  label="URL"
                  :error-messages="errors.collect('url')"></v-text-field>
              </v-flex>             
              <v-flex xs12>
                <v-switch
                  color="primary"
                  :label="statusApps(status)"
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
        required: 'Nama Aplikasi harus diisi'
      },
      description: {
        required: 'Deskripsi Aplikasi harus diisi.'
      },
      service: {
        required: 'Servis harus diisi.'
      },
      url: {
        required: 'URL harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddApps: false,
      loading: false,
      cacheItems: true,
      tempItems: [],
      name: null,
      description: null,
      service: null,
      url: null,
      mask: '#### - ########',
      status: true
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
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
    }
  },
  methods: {
    statusApps (data) {
      if (data) {
        return 'Status: Aktif'
      } else {
        return 'Status: Tidak Aktif'
      }
    },
    closeDialogButton () {
      this.dialogAddApps = !this.dialogAddApps
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              name: this.name,
              desc: this.description,
              service: this.service,
              url: this.url,
              status: this.status
            }
            this.$store.commit('appsmanagement/clearCreateError')
            this.$store.dispatch('appsmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddApps = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('appsmanagement/clearCreateError')
      this.$validator.reset()
      this.name = null
      this.description = null
      this.service = null
      this.url = null
      this.status = true
    }
  },
  created () {
    this.$root.$on('openDialogAddApps', () => {
      this.dialogAddApps = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
