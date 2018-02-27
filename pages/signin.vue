<template>
  <v-container grid-list-md>
    <v-layout
      v-bind="redirect"
      row justify-center style="margin-top: 56px">
      <v-flex xs12 sm7 md6 lg4 xl3>
        <v-card>
          <v-progress-linear
            v-if="(this.checkuser.isFindPending || this.auth.isAuthenticatePending)"
            style="position: absolute;top: 0px; margin: 0; height: 4px !important;"
            v-bind:indeterminate="true"></v-progress-linear>
          <v-card-title primary-title class="card_title_login">
            <div style="width: 100%">
              <div class="img_logo">
                <img src="../static/images/logo_purbalingga.png" />
              </div>
              <div style="text-align: center;">
                <h3 class="headline mb-0">e-Akun</h3>
                <div v-if="this.checkuserList.length === 0">Aplikasi Terintegrasi Kabupaten Purbalingga</div>
              </div>
            </div>
          </v-card-title>
          <v-card-text class="card_text_login">
            <v-flex  v-if="this.checkuserList.length === 0">
              <v-text-field
                v-on:keyup.enter="checkUsername"
                ref="username"
                v-model="username"
                label="NIP atau ID Akun"
                v-validate="'required'"
                data-vv-name="username"
                autofocus
                class="input-group--focused"
                :error-messages="errorMessageUsername"
              ></v-text-field>
            </v-flex>
            <div v-if="this.checkuserList.length > 0">
              <h3>Selamat Datang,</h3>
              <div>{{ this.checkuserList[0].name.first_name + ' ' + this.checkuserList[0].name.last_name }}</div>
              <br />
              <v-flex>
                <v-text-field
                  v-on:keyup.enter="loginUser(username, password)"
                  ref="password"
                  v-model="password"
                  label="Kata Sandi"
                  v-validate="'required'"
                  data-vv-name="password"
                  autofocus
                  class="input-group--focused"
                  type="password"
                  :error-messages="errorMessagePassword"
                ></v-text-field>
              </v-flex>
            </div>
          </v-card-text>
          <v-card-actions class="card_action_login">
            <v-spacer></v-spacer>
            <v-btn
              v-if="this.checkuserList.length === 0"
              color="primary"
              @click="checkUsername">Lanjutkan</v-btn>
            <v-btn
              v-if="this.checkuserList.length > 0"
              color="primary"
              @click="loginUser(username, password)">Masuk</v-btn>
          </v-card-actions>
        </v-card>
        <div style="text-align: center;margin: 16px 0px;font-size: 13px;">&copy; 2017 Dinkominfo Kabupaten Purbalingga</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  const customHelptext = {
    en: {
      custom: {
        username: {
          required: 'NIP atau ID Akun harus diisi.'
        },
        password: {
          required: 'Kata Sandi harus diisi.'
        }
      }
    }
  }

  export default {
    head () {
      return {
        title: 'Masuk e-Akun Kabupaten Purbalingga',
        meta: [
          {
            hid: 'e-Akun - Masuk Aplikasi Terintegrasi Kabupaten Purbalingga',
            name: 'e-Akun - Masuk Aplikasi Terintegrasi Kabupaten Purbalingga',
            content: 'e-Akun - Masuk Aplikasi Terintegrasi Kabupaten Purbalingga'
          }
        ]
      }
    },
    data () {
      return {
        username: undefined,
        password: undefined
      }
    },
    computed: {
      ...mapState({
        auth: 'auth',
        checkuser: 'checkuser'
      }),
      ...mapGetters({
        checkuserList: 'checkuser/list'
      }),
      errorMessageUsername: function () {
        if (this.checkuser.errorOnFind !== null) {
          return this.checkuser.errorOnFind.message
        } else {
          return this.errors.collect('username')
        }
      },
      errorMessagePassword: function () {
        if (this.auth.errorOnAuthenticate !== null) {
          return 'Kata Sandi tidak benar.'
        } else {
          return this.errors.collect('password')
        }
      },
      redirect: function () {
        if (this.auth.accessToken !== null) {
          if (typeof this.$route.query.action === 'undefined') {
            this.$router.push('/')
          }
        }
      }
    },
    methods: {
      checkUsername () {
        this.$store.commit('checkuser/clearFindError')
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let params = {
                query: {
                  username: this.username
                }
              }
              this.$store.dispatch('checkuser/find', params)
            }
          })
      },
      ...mapActions('auth', ['authenticate']),
      loginUser (username, password) {
        this.authenticate({strategy: 'local', username, password})
      }
    },
    created () {
      this.$validator.localize(customHelptext)
    }
  }
</script>

<style lang="sass">
  .card_title_login, .card_text_login
    padding-left: 40px
    padding-right: 40px

  .card_action_login
    padding: 24px 40px 40px !important

  .img_logo
    margin-bottom: 16px
    img
      width: 80px
      margin: 0 auto
      display: block
      min-height: 0
</style>
