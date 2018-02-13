<template>
  <div v-if="formProfile" style="margin-top: 24px;">
    <v-card-text class="card_text_signup">
      <div data-vv-scope="profile">
        <v-flex>
          <v-switch color="blue Dark" label="Anda PNS?" v-model="pns"></v-switch>
        </v-flex>
        <v-flex v-if="this.pns">
          <v-text-field
            v-model="nip"
            label="NIP"
            v-validate="'required'"
            data-vv-name="nip"
            data-vv-as="nip"
            :mask="maskNIP"
            autofocus
            :error-messages="errors.collect('nip')"
            v-on:keyup.enter="saveProfile"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            v-model="first_name"
            label="Nama Depan"
            v-validate="'required'"
            data-vv-name="first_name"
            data-vv-as="first_name"
            :error-messages="errors.collect('first_name')"
            v-on:keyup.enter="saveProfile"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            v-model="last_name"
            label="Nama Belakang"
            v-validate="'required'"
            data-vv-name="last_name"
            data-vv-as="last_name"
            :error-messages="errors.collect('last_name')"
            v-on:keyup.enter="saveProfile"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-menu
            lazy
            :close-on-content-click="false"
            v-model="menu_birthday"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            max-width="290px"
            min-width="290px"
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
              @input="birthday = formatDate($event)"
              no-title scrollable actions>
              <template slot-scope="{ save, cancel }">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                  <v-btn flat color="primary" @click="save">OK</v-btn>
                </v-card-actions>
              </template>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex>
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
            v-on:keyup.enter="saveProfile"
          ></v-select>
        </v-flex>
        <v-flex>
          <v-text-field
            v-model="phone"
            label="No. Telepon"
            v-validate="'required'"
            data-vv-name="phone"
            data-vv-as="phone"
            :mask="maskPhone"
            :error-messages="errors.collect('phone')"
            v-on:keyup.enter="saveProfile"
          ></v-text-field>
        </v-flex>
      </div>
    </v-card-text>
    <v-card-actions class="card_action_signup">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click.native.stop="saveProfile">Lanjutkan</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
  import moment from 'moment'
  import {formatFormDate, parseFormDate} from '~/utils/format'
  moment.locale('id')

  const customHelptext = {
    en: {
      custom: {
        nip: {
          required: 'NIP harus diisi.'
        },
        first_name: {
          required: 'Nama Depan harus diisi.'
        },
        last_name: {
          required: 'Nama Belakang harus diisi.'
        },
        birthday: {
          required: 'Tanggal Lahir harus diisi.'
        },
        gender: {
          required: 'Jenis Kelamin harus dipilih.'
        },
        phone: {
          required: 'No. Telepon harus diisi.'
        }
      }
    }
  }

  export default {
    data () {
      return {
        formProfile: false,
        pns: true,
        maskNIP: '######## ###### # ###',
        menu_birthday: false,
        maskPhone: '#### - #### - ####',
        date_for_birthday: parseFormDate('01/01/' + moment().subtract(35, 'years').format('YYYY')),
        gender_items: [
          {
            value: 1,
            text: 'Laki-laki'
          },
          {
            value: 2,
            text: 'Perempuan'
          }
        ],
        codereg: '',
        nip: '',
        first_name: '',
        last_name: '',
        birthday: '01/01/' + moment().subtract(35, 'years').format('YYYY'),
        gender: '',
        phone: ''
      }
    },
    computed: {
      allowDate: function () {
        let _allow = {
          min: parseFormDate('01/01/' + moment().subtract(65, 'years').format('YYYY')),
          max: parseFormDate('31/12/' + moment().subtract(18, 'years').format('YYYY'))
        }
        return _allow
      }
    },
    watch: {
      pns (val) {
        if (!val) {
          this.nip = ''
        }
      }
    },
    methods: {
      formatDate (value) {
        return formatFormDate(value)
      },
      onBlur (field) {
        setTimeout(() => this.$validator.validate(field), 500)
      },
      saveProfile () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let data = {
                item: {
                  isPns: this.pns,
                  codereg: this.codereg,
                  nip: this.nip,
                  name: {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    first_title: '',
                    last_title: ''
                  },
                  birth: {
                    day: this.birthday,
                    place: ''
                  },
                  gender: this.gender,
                  phone: {
                    lists: this.phone,
                    primary: 0
                  }
                }
              }
              this.formProfile = false
              this.$root.$emit('signupStepPassword', data)
            }
          })
      }
    },
    created () {
      this.$validator.localize(customHelptext)
      this.$root.$on('signupStepProfile', (data) => {
        this.formProfile = true
        if (data !== null) {
          this.codereg = data.codereg
        }
      })
    }
  }
</script>
