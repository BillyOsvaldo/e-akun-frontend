<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogFax" persistent scrollable max-width="360">
      <v-card v-if="dialogFax">
        <v-card-title class="headline">Ubah No. Faximile</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataPhone">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="fax"
                  label="No. Faximile"
                  prepend-icon="phone"
                  :mask="mask"
                  v-validate="'required'"
                  data-vv-name="fax"
                  :error-messages="errors.collect('fax')">
                ></v-text-field>
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
      fax: {
        required: 'No. Faximile harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogFax: false,
      mask: '#### - ########',
      fax: null
    }
  },
  computed: {
    ...mapGetters({
      organization: 'organizations/current'
    }),
    loadDataPhone () {
      if (this.dialogFax) {
        this.fax = (typeof this.organization.fax === 'undefined') ? '' : this.organization.fax
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogFax = !this.dialogFax
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              fax: this.fax
            }
            let params = {}
            this.$store.commit('organizationsmanagement/clearPatchError')
            this.$store.dispatch('organizationsmanagement/patch', [this.organization._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogFax = false
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
    this.$root.$on('openDialogOrgFax', () => {
      this.dialogFax = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>
