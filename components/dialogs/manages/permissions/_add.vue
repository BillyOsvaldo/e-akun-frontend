<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddPerm" persistent scrollable max-width="480">
      <v-card v-if="dialogAddPerm">
        <v-card-title class="headline">Tambah Izin Aplikasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex>
                <v-select
                  label="Aplikasi"
                  autocomplete
                  :loading="loading"
                  v-bind:items="itemsApp"
                  item-text="name"
                  item-value="_id"
                  :cache-items="cacheItems"
                  :search-input.sync="searchApp"
                  v-model="app"
                ></v-select>
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
  import {mapGetters} from 'vuex'
  const customHelptext = {
    en: {
      custom: {
        app: {
          required: 'Aplikasi harus dipilih'
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
        dialogAddPerm: false,
        loading: false,
        cacheItems: true,
        searchApp: null,
        app: null
      }
    },
    computed: {
      ...mapGetters({
        apps: 'apps/list'
      }),
      itemsApp () {
        if (this.apps.length > 0) {
          console.log(this.apps)
        }
      }
    },
    watch: {
      searchApp (val) {
        if (val && val.length >= 3) {
          let params = {
            query: {
              q: val
            }
          }
          console.log(params)
          this.$store.dispatch('apps/find', params)
            .then(response => {
              console.log(response)
            })
        }
      }
    },
    created () {
      this.$root.$on('openDialogAddPerm', () => {
        this.dialogAddPerm = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>