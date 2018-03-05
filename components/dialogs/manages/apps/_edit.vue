<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditApps" persistent scrollable max-width="480">
      <v-card v-if="dialogEditApps">
        <v-card-title class="headline">Ubah Aplikasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadData">
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
            @click.native="postUpdate">Ubah</v-btn>
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
      dialogEditApps: false,
      loading: false,
      cacheItems: true,
      tempItems: [],
      name: null,
      desc: null,
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
      apps: 'appsmanagement/current'
    }),
    loadData () {
      if (this.dialogEditApps) {
        this.$validator.reset()
        this.name = (typeof this.apps.name === 'undefined') ? '' : this.apps.name
        this.description = (typeof this.apps.desc === 'undefined') ? '' : this.apps.desc
        this.service = (typeof this.apps.service === 'undefined') ? '' : this.apps.service
        this.url = (typeof this.apps.url === 'undefined') ? '' : this.apps.url
        this.status = (typeof this.apps.status === 'undefined') ? true : this.apps.status
      }
    },
    errorMessageEmail () {
      if (this.checkuser.errorOnFind !== null) {
        return 'Email telah digunakan.'
      } else {
        return this.errors.collect('email')
      }
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
      this.dialogEditApps = !this.dialogEditApps
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
            let params = {}
            this.$store.commit('appsmanagement/clearPatchError')
            this.$store.dispatch('appsmanagement/patch', [this.apps._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogEditApps = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('appsmanagement/clearPatchError')
      this.$validator.reset()
    }
  },
  created () {
    this.$root.$on('openDialogEditApps', () => {
      this.dialogEditApps = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
