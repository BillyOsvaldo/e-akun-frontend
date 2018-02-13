<template>
  <div class="profile-content">
    <v-layout justify-center row wrap>
      <v-flex xs12 sm10 md7>
        <v-card flat style="background: #eee">
          <v-layout row wrap style="padding: 24px;">
            <v-icon style="font-size: 86px;">person</v-icon>
            <v-flex style="padding: 16px;">
              <h2 style="font-size: 20px;font-weight: 500;">Profil</h2>
              <p>{{ fullnameText }}</p>
            </v-flex>
          </v-layout>
        </v-card>
        <v-expansion-panel>
          <v-expansion-panel-content v-bind:value="true">
            <div slot="header">
              <h4>e-Akun</h4>
              <span>Informasi ID Akun, Email, dan Kata Sandi Anda.</span>
            </div>
            <account/>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <div slot="header">
              <h4>Profil</h4>
              <span>Informasi Nama Lengkap, Alamat, Tanggal Lahir, dan informasi lainnya.</span>
            </div>
            <profile/>
          </v-expansion-panel-content>
          <v-expansion-panel-content key="opd">
            <div slot="header">
              <h4>OPD</h4>
              <span>Informasi tentang OPD anda.</span>
            </div>
            <opd/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <dialogEmail/>
    <dialogFullname/>
    <dialogAddress/>
    <dialogBirthplace/>
    <dialogPhone/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {justNameFormat, setValueText} from '~/utils/format'
  import account from '~/components/profiles/_account'
  import profile from '~/components/profiles/_profile'
  import opd from '~/components/profiles/_opd'
  import dialogEmail from '~/components/dialogs/profiles/accounts/_email'
  import dialogFullname from '~/components/dialogs/profiles/profiles/_fullname'
  import dialogBirthplace from '~/components/dialogs/profiles/profiles/_birthplace'
  import dialogAddress from '~/components/dialogs/profiles/profiles/_address'
  import dialogPhone from '~/components/dialogs/profiles/profiles/_phone'
  export default {
    components: {
      account,
      profile,
      opd,
      dialogEmail,
      dialogFullname,
      dialogAddress,
      dialogBirthplace,
      dialogPhone
    },
    mounted () {
      this.$store.dispatch('setNavigationTitle', 'Profil Anda')
    },
    computed: {
      ...mapGetters([
        'userapp/current'
      ]),
      profiles: function () {
        return setValueText(this['userapp/current'], 'profile', true)
      },
      fullnameText: function () {
        return (this.profiles === '') ? '' : justNameFormat(this.profiles.name)
      }
    }
  }
</script>

<style lang="sass" scoped>
  .profile-content
    background: #f7f7f7
    padding: 40px 0
    overflow-y: scroll
    height: calc(100vh - 128px)
</style>

<style lang="sass">
  .profile-content
    .expansion-panel__header
      padding: 24px
</style>
