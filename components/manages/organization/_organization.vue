<template>
  <v-list two-line style="padding: 0 8px;background: #f7f7f7;">
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Nama Organisasi</v-list-tile-title>
        <v-list-tile-sub-title>{{nameText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon disabled>
          <v-icon>https</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Alamat Lengkap</v-list-tile-title>
        <v-list-tile-sub-title>{{addressText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon disabled>
          <v-icon>https</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Alamat Email</v-list-tile-title>
        <v-list-tile-sub-title>{{mailText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon disabled>
          <v-icon>https</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>No. Telepon</v-list-tile-title>
        <v-list-tile-sub-title>{{phoneText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon disabled>
          <v-icon>https</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>No. Faximile</v-list-tile-title>
        <v-list-tile-sub-title>{{faxText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon disabled>
          <v-icon>https</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Website</v-list-tile-title>
        <v-list-tile-sub-title>{{websiteText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon disabled>
          <v-icon>https</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState({
        auth: 'auth'
      }),
      organization: function () {
        if (typeof this.auth !== 'undefined') {
          if (this.auth.user !== null) {
            return this.auth.user.organization
          }
        }
      },
      nameText: function () {
        return (typeof this.organization === 'undefined') ? '' : this.organization.name
      },
      addressText: function () {
        return (typeof this.organization === 'undefined') ? '' : this.organization.address
      },
      mailText: function () {
        return (typeof this.organization === 'undefined') ? '' : this.organization.email
      },
      phoneText: function () {
        return (typeof this.organization === 'undefined') ? '' : this.organization.phone
      },
      faxText: function () {
        return (typeof this.organization === 'undefined') ? '' : this.organization.fax
      },
      websiteText: function () {
        return (typeof this.organization === 'undefined') ? '' : this.organization.website
      }
    }
  }
</script>
