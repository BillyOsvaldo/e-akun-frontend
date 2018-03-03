<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogPhone" persistent scrollable max-width="360">
      <v-card v-if="dialogPhone">
        <v-card-title class="headline">Ubah No. Telepon</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataPhone">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="phone"
                  label="No. Telepon"
                  prepend-icon="phone"
                  :mask="mask"
                  v-validate="'required'"
                  data-vv-name="phone"
                  :error-messages="errors.collect('phone')">
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
      phone: {
        required: 'No. Telepon harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogPhone: false,
      mask: '#### - ########',
      phone: null
    }
  },
  computed: {
    ...mapGetters({
      organization: 'organizations/current'
    }),
    loadDataPhone () {
      if (this.dialogPhone) {
        this.phone = (typeof this.organization.phone === 'undefined') ? '' : this.organization.phone
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogPhone = !this.dialogPhone
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              phone: this.phone
            }
            let params = {}
            this.$store.commit('organizationsmanagement/clearPatchError')
            this.$store.dispatch('organizationsmanagement/patch', [this.organization._id, data, params])
              .then(response => {
                if (response) {
                  this.dialogPhone = false
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
    this.$root.$on('openDialogOrgPhone', () => {
      this.dialogPhone = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>
