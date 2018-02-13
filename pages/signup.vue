<template>
  <div class="signupForm">
    <v-layout row justify-center style="margin-top: 56px">
      <v-flex xs12 sm7 md6 lg4 xl4>
        <v-card>
          <v-progress-linear
            v-if="this.$store.state.checkcode.isFindPending"
            style="position: absolute;top: 0px; margin: 0; height: 4px !important;"
            v-bind:indeterminate="true"></v-progress-linear>
          <v-card-title primary-title class="card_title_signup">
            <div style="width: 100%">
              <div class="img_logo">
                <img src="../static/images/logo_purbalingga.png" />
              </div>
              <div style="text-align: center;">
                <h3 class="headline mb-0">Buat e-Akun</h3>
                <div>Aplikasi Terintegrasi Kabupaten Purbalingga</div>
              </div>
            </div>
          </v-card-title>
          <formCode/>
          <formProfile/>
          <formPassword/>
          <div>
            <v-card-text class="card_text_signup">
              <div>
                <v-flex>
                  <h2>Terimakasih,</h2>
                  <p>Pendaftaran e-Akun telah berhasil, berikut ID Akun Anda:</p>
                  <div style="text-align: center;">
                    <p class="id_akun"></p>
                  </div>
                </v-flex>
              </div>
            </v-card-text>
            <v-card-actions class="card_action_signup">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="loginUser">Masuk e-Akun</v-btn>
            </v-card-actions>
          </div>
        </v-card>
        <div style="text-align: center;margin: 16px 0px;font-size: 13px;">&copy; 2017 Dinkominfo Kabupaten Purbalingga</div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import formCode from '~/components/signup/_code'
  import formProfile from '~/components/signup/_profile'
  import formPassword from '~/components/signup/_password'
  export default {
    components: {
      formCode, formProfile, formPassword
    }
  }
</script>

<style lang="sass">
  .signupForm
    height: 100vh
    overflow-y: scroll

  .card_title_signup, .card_text_signup
    padding-left: 40px
    padding-right: 40px

  .card_action_signup
    padding: 24px 40px 40px !important

  .img_logo
    margin-bottom: 16px
    img
      width: 80px
      margin: 0 auto
      display: block
      min-height: 0
  .agreement
    label
      height: 60px
      text-overflow: inherit
      white-space: normal
      line-height: 30px
  .id_akun
    padding: 16px
    margin: 24px auto
    display: block
    width: 180px
    font-size: 20px
    border-radius: 5px
    font-weight: 400
    background: #ddd
</style>
