<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogBirthplace" persistent scrollable max-width="360">
      <v-card v-if="dialogBirthplace">
        <v-card-title class="headline">Ubah Tempat lahir</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataBirthplace">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="birthplace"
                  v-validate="'required'"
                  data-vv-name="birthplace"
                  label="Tempat Lahir"
                  :error-messages="errors.collect('birthplace')"></v-text-field>
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
        birthplace: {
          required: 'Tempat Lahir harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        birthplace: null,
        dialogBirthplace: false
      }
    },
    computed: {
      ...mapGetters({
        user: 'users/current',
        profile: 'profiles/current'
      }),
      loadDataBirthplace () {
        if (this.dialogBirthplace) {
          this.$validator.reset()
          this.birthplace = this.profile.birth.place
        }
      }
    },
    methods: {
      closeDialogButton () {
        this.dialogBirthplace = !this.dialogBirthplace
        this.resetAll()
      },
      postUpdate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let data = {
                id: this.profile._id,
                birth: {
                  place: this.birthplace,
                  day: this.profile.birth.day
                },
                update: 'profile'
              }
              let params = {}
              this.$store.commit('usersmanagement/clearPatchError')
              this.$store.dispatch('usersmanagement/patch', [this.user._id, data, params])
                .then(response => {
                  if (response) {
                    this.dialogBirthplace = false
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
      this.$root.$on('openDialogBirthplace', () => {
        this.dialogBirthplace = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
