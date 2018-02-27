<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogSite" persistent scrollable max-width="360">
      <v-card v-if="dialogSite">
        <v-card-title class="headline">Ubah Website</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataPhone">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="site"
                  label="Website"
                  v-validate="'required'"
                  data-vv-name="site"
                  :error-messages="errors.collect('site')">
                ></v-text-field>
              </v-flex>
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
      site: {
        required: 'Website harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogSite: false,
      site: null
    }
  },
  computed: {
    ...mapGetters({
      organization: 'organizations/current'
    }),
    loadDataPhone () {
      if (this.dialogSite) {
        this.site = (typeof this.organization.website === 'undefined') ? '' : this.organization.website
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogSite = !this.dialogSite
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              website: this.site
            }
            let params = {}
            console.log(data)
            this.$store.commit('organizationsmanagement/clearPatchError')
            this.$store.dispatch('organizationsmanagement/patch', [this.organization._id, data, params])
              .then(response => {
                console.log(response)
                if (response) {
                  this.dialogSite = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('organizationsmanagement/clearPatchError')
      this.$validator.reset()
    }
  },
  created () {
    this.$root.$on('openDialogOrgSite', () => {
      this.dialogSite = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>
