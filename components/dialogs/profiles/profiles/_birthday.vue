<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogBirthday" persistent scrollable max-width="360">
      <v-card v-if="dialogBirthday">
        <v-card-title class="headline">Ubah Tanggal lahir</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadDataBirthday">
              <v-flex>
                <v-menu
                  ref="menu_birthday"
                  lazy
                  :close-on-content-click="false"
                  v-model="menu_birthday"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  :return-value.sync="birthday"
                >
                  <v-text-field
                    slot="activator"
                    label="Tanggal Lahir"
                    v-model="birthday"
                    v-validate="'required'"
                    data-vv-name="birthday"
                    data-vv-as="birthday"
                    prepend-icon="event"
                    validate-on-blur
                    readonly
                    @blur="onBlur('birthday')"
                    :error-messages="errors.collect('birthday')"
                  ></v-text-field>
                  <v-date-picker
                    locale="id"
                    v-model="date_for_birthday"
                    :allowed-dates="allowDate"
                    @input="birthday = formatDate($event)">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu_birthday = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu_birthday.save(birthday)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
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
  import moment from 'moment'
  import {formatFormDate, parseFormDate} from '~/utils/format'
  moment.locale('id')
  const customHelptext = {
    en: {
      custom: {
        birthday: {
          required: 'Tanggal Lahir harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        menu_birthday: false,
        date_for_birthday: parseFormDate('01/01/' + moment().subtract(35, 'years').format('YYYY')),
        birthday: '01/01/' + moment().subtract(35, 'years').format('YYYY'),
        dialogBirthday: false
      }
    },
    computed: {
      ...mapGetters({
        user: 'users/current',
        profile: 'profiles/current'
      }),
      loadDataBirthday () {
        if (this.dialogBirthday) {
          this.$validator.reset()
          this.date_for_birthday = moment(this.profile.birth.day).format('YYYY-MM-DD')
          this.birthday = formatFormDate(moment(this.profile.birth.day).format('YYYY-MM-DD'))
        }
      },
      allowDate: function () {
        let _allow = {
          min: parseFormDate('01/01/' + moment().subtract(65, 'years').format('YYYY')),
          max: parseFormDate('31/12/' + moment().subtract(18, 'years').format('YYYY'))
        }
        return _allow
      }
    },
    methods: {
      formatDate (value) {
        return formatFormDate(value)
      },
      onBlur (field) {
        setTimeout(() => this.$validator.validate(field), 500)
      },
      closeDialogButton () {
        this.dialogBirthday = !this.dialogBirthday
        this.resetAll()
      },
      postUpdate () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let data = {
                id: this.profile._id,
                birth: {
                  place: this.profile.birth.place,
                  day: parseFormDate(this.birthday)
                },
                update: 'profile'
              }
              let params = {}
              this.$store.commit('usersmanagement/clearPatchError')
              this.$store.dispatch('usersmanagement/patch', [this.user._id, data, params])
                .then(response => {
                  if (response) {
                    this.dialogBirthday = false
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
      this.$root.$on('openDialogBirthday', () => {
        this.dialogBirthday = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
