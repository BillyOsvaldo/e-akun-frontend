<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogGender" persistent scrollable max-width="360">
      <v-card v-if="dialogGender">
        <v-card-title class="headline">Ubah Jenis Kelamin</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataGender">
              <v-flex xs12>
                <v-select
                  v-bind:items="gender_items"
                  item-text="text"
                  item-value="value"
                  v-model="gender"
                  label="Jenis Kelamin"
                  v-validate="'required'"
                  data-vv-name="gender"
                  data-vv-as="gender"
                  single-line
                  bottom
                  :error-messages="errors.collect('gender')"
                ></v-select>
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
        gender: {
          required: 'Jenis Kelamin Harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        gender: null,
        dialogGender: false,
        gender_items: [
          {
            value: 1,
            text: 'Laki-laki'
          },
          {
            value: 2,
            text: 'Perempuan'
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        user: 'users/current',
        profile: 'profiles/current'
      }),
      loadDataGender () {
        if (this.dialogGender) {
          this.$validator.reset()
          this.gender = this.profile.gender
        }
      }
    },
    methods: {
      closeDialogButton () {
        this.dialogGender = !this.dialogGender
        this.resetAll()
      },
      postUpdate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let data = {
                id: this.profile._id,
                gender: this.gender,
                update: 'profile'
              }
              let params = {}
              this.$store.commit('usersmanagement/clearPatchError')
              this.$store.dispatch('usersmanagement/patch', [this.user._id, data, params])
                .then(response => {
                  if (response) {
                    this.dialogGender = false
                    this.resetAll()
                  }
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
      this.$root.$on('openDialogGender', () => {
        this.dialogGender = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
