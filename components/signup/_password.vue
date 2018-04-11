<template>
  <div v-if="(formPassword && this.userRegister === null)" style="margin-top: 24px;">
    <v-card-text class="card_text_signup">
      <div>
        <v-flex>
          <v-text-field
            autofocus
            v-model="password"
            type="password"
            v-validate="'required|min:8'"
            data-vv-name="password"
            data-vv-as="password"
            label="Kata Sandi"
            :error-messages="errors.collect('password')"
            v-on:keyup.enter="signUpUser"
            >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            v-model="confirmpassword"
            type="password"
            v-validate="'required|confirmedpass:password'"
            data-vv-name="confirmpassword"
            data-vv-as="confirmpassword"
            label="Ulangi Kata Sandi"
            :error-messages="errors.collect('confirmpassword')"
            v-on:keyup.enter="signUpUser">
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-checkbox
            v-model="agree"
            value="1"
            :error-messages="errors.collect('agree')"
            v-validate="'required'"
            data-vv-name="agree"
            data-vv-as="agree"
            class="agreement"
            required
            type="checkbox"
            label="Saya setuju dengan persyaratan dan ketentuan yang berlaku." light></v-checkbox>
        </v-flex>
      </div>
    </v-card-text>
    <v-card-actions class="card_action_signup">
      <v-spacer></v-spacer>
      <div>
        <v-btn
          color="grey"
          class="white--text"
          @click.native.stop="backtoProfile">Kembali</v-btn>
        <v-btn
          color="primary"
            :disabled="disableButton"
          @click.native.stop="signUpUser">Buat Akun</v-btn>
      </div>
    </v-card-actions>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {parseFormDate} from '~/utils/format'
  const customHelptext = {
    en: {
      custom: {
        password: {
          required: 'Kata Sandi harus diisi.',
          min: 'Kata Sandi minimal 8 karakter.'
        },
        confirmpassword: {
          required: 'Ulangi Kata Sandi harus diisi.'
        },
        agree: {
          required: ' '
        }
      }
    }
  }

  export default {
    data () {
      return {
        formPassword: false,
        password: null,
        confirmpassword: null,
        agree: null,
        item: {}
      }
    },
    computed: {
      ...mapState({
      }),
      ...mapGetters({
        'userRegister': 'userRegistration/current'
      }),
      disableButton () {
        if (this.agree && (this.password !== null &&
          this.password.length >= 8) &&
          (this.confirmpassword !== null &&
          this.confirmpassword.length >= 8)) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      backtoProfile () {
        this.password = null
        this.confirmpassword = null
        this.agree = false
        this.formPassword = false
        this.$root.$emit('signupStepProfile', null)
      },
      signUpUser () {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              this.item.password = this.password
              this.item.birth.day = parseFormDate(this.item.birth.day)
              this.$store.dispatch('userRegistration/create', this.item)
            }
          })
      }
    },
    created () {
      this.$root.$on('signupStepPassword', (data) => {
        this.formPassword = true
        this.item = data.item
      })
      this.$validator.localize(customHelptext)
      this.$validator.extend('confirmedpass', {
        getMessage: (field, [args]) => {
          return 'Kata sandi tidak cocok.'
        },
        validate: (field, [args]) => {
          return this[args] === field
        }
      })
    }
  }
</script>
