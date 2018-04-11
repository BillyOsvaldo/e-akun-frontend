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
          <v-expansion-panel-content v-if="this.profiles">
            <div slot="header">
              <h4>Profil</h4>
              <span>Informasi Nama Lengkap, Alamat, Tanggal Lahir, dan informasi lainnya.</span>
            </div>
            <profile/>
          </v-expansion-panel-content>
          <v-expansion-panel-content v-if="this.organizations" key="organization">
            <div slot="header">
              <h4>Organisasi</h4>
              <span>Informasi tentang Organisasi anda.</span>
            </div>
            <organization/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <dialogPassword/>
    <dialogEmail/>
    <dialogFullname/>
    <dialogGender/>
    <dialogAddress/>
    <dialogBirthplace/>
    <dialogBirthday/>
    <dialogPhone/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {justNameFormat} from '~/utils/format'
  import account from '~/components/profiles/_account'
  import profile from '~/components/profiles/_profile'
  import organization from '~/components/profiles/_organization'
  import dialogEmail from '~/components/dialogs/profiles/accounts/_email'
  import dialogPassword from '~/components/dialogs/profiles/accounts/_password'
  import dialogFullname from '~/components/dialogs/profiles/profiles/_fullname'
  import dialogGender from '~/components/dialogs/profiles/profiles/_gender'
  import dialogBirthplace from '~/components/dialogs/profiles/profiles/_birthplace'
  import dialogBirthday from '~/components/dialogs/profiles/profiles/_birthday'
  import dialogAddress from '~/components/dialogs/profiles/profiles/_address'
  import dialogPhone from '~/components/dialogs/profiles/profiles/_phone'
  export default {
    components: {
      account,
      profile,
      organization,
      dialogPassword,
      dialogEmail,
      dialogFullname,
      dialogGender,
      dialogAddress,
      dialogBirthplace,
      dialogBirthday,
      dialogPhone
    },
    computed: {
      ...mapGetters({
        profiles: 'profiles/current',
        app: 'apps/current',
        administrator: 'administrators/current',
        organizations: 'organizations/current'
      }),
      fullnameText: function () {
        return (this.profiles === null) ? this.formatNameAdmin(this.app, this.administrator) : justNameFormat(this.profiles.name)
      }
    },
    methods: {
      formatNameAdmin (app, administrator) {
        if (app !== null && administrator !== null) {
          return administrator.name + ' ' + app.name
        }
      }
    },
    created () {
      this.$store.commit('usersmanagement/clearAll')
    },
    mounted () {
      this.$store.dispatch('setNavigationCount', 0)
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
