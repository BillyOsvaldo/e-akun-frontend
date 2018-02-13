<template>
  <v-layout row justify-center v-if="account" v-bind="closeDialog">
    <v-dialog v-model="dialogPhone" persistent scrollable max-width="360">
      <v-card v-if="dialogPhone">
        <v-card-title class="headline">Ubah No. Telepon</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataPhone">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="phone_1"
                  label="No. Telepon Utama"
                  prepend-icon="phone"
                  :mask="mask"
                  v-validate="'required'"
                  data-vv-name="phone_1"
                  :error-messages="errors.collect('phone_1')">
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="phone_2"
                  label="No. Telepon Alternatif"
                  prepend-icon="phone"
                  :mask="mask"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="phone_3"
                  label="No. Telepon Lainnya"
                  prepend-icon="phone"
                  :mask="mask"
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
      phone_1: {
        required: 'No. Telepon Utama harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogPhone: false,
      doPost: false,
      mask: '#### - #### - ####',
      phone_1: null,
      phone_2: null,
      phone_3: null
    }
  },
  computed: {
    ...mapGetters([
      'userapp/current'
    ]),
    account: function () {
      return this['userapp/current']
    },
    loadDataPhone () {
      if (this.dialogPhone) {
        this.phone_1 = (typeof this.account.profile.phone.lists[0] === 'undefined') ? '' : this.account.profile.phone.lists[0]
        this.phone_2 = (typeof this.account.profile.phone.lists[1] === 'undefined') ? '' : this.account.profile.phone.lists[1]
        this.phone_3 = (typeof this.account.profile.phone.lists[2] === 'undefined') ? '' : this.account.profile.phone.lists[2]
      }
    },
    closeDialog: function () {
      if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch === null) {
        this.doPost = false
        this.dialogPhone = false
        this.resetAll()
      } else if (this.doPost && !this.$store.state.userapp.isPatchPending && this.$store.state.userapp.errorOnPatch !== null) {
        this.doPost = false
        this.$validator.reset()
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogPhone = !this.dialogPhone
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let phones = []
            if (this.phone_1 !== '') {
              phones.push(this.phone_1)
            }

            if (this.phone_2 !== '') {
              phones.push(this.phone_2)
            }

            if (this.phone_3 !== '') {
              phones.push(this.phone_3)
            }

            let data = {
              id: this.account.profile._id,
              phone: {
                lists: phones,
                primary_key: this.account.profile.phone.primary_key
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
    this.$root.$on('openDialogPhone', () => {
      this.dialogPhone = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>
