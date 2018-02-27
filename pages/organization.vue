<template>
  <div class="profile-content">
    <v-layout justify-center row wrap>
      <v-flex xs12 sm10 md7>
        <v-card flat style="background: #eee">
          <v-layout row wrap style="padding: 24px;">
            <v-icon style="font-size: 86px;">business</v-icon>
            <v-flex style="padding: 16px;">
              <h2 style="font-size: 20px;font-weight: 500;">Organisasi</h2>
              <p>{{ fullnameText }}</p>
            </v-flex>
          </v-layout>
        </v-card>
        <v-expansion-panel>
          <v-expansion-panel-content key="organization" v-bind:value="true">
            <div slot="header">
              <h4>Organisasi</h4>
              <span>Informasi tentang Organisasi anda.</span>
            </div>
            <organization/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <dialogAddress/>
    <dialogEmail/>
    <dialogPhone/>
    <dialogFax/>
    <dialogSite/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import organization from '~/components/profiles/_organization'
  import dialogAddress from '~/components/dialogs/organization/_address'
  import dialogEmail from '~/components/dialogs/organization/_email'
  import dialogPhone from '~/components/dialogs/organization/_phone'
  import dialogFax from '~/components/dialogs/organization/_fax'
  import dialogSite from '~/components/dialogs/organization/_site'
  export default {
    components: {
      organization,
      dialogAddress,
      dialogEmail,
      dialogPhone,
      dialogFax,
      dialogSite
    },
    computed: {
      ...mapGetters({
        organization: 'organizations/current'
      }),
      fullnameText: function () {
        return (this.organization === null) ? '' : this.organization.name
      }
    },
    mounted () {
      this.$store.dispatch('setNavigationTitle', 'Organisasi Anda')
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
