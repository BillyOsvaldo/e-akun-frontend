<template>
  <v-list two-line style="padding: 0 8px;background: #f7f7f7;">
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Nama OPD</v-list-tile-title>
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
  </v-list>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {setValueText} from '~/utils/format'
  export default {
    computed: {
      ...mapGetters([
        'userapp/current'
      ]),
      opd: function () {
        return setValueText(this['userapp/current'], 'opd', true)
      },
      nameText: function () {
        return (this.opd === '') ? '' : this.opd.name
      },
      addressText: function () {
        return (this.opd === '') ? '' : this.opd.address
      },
      mailText: function () {
        return (this.opd === '') ? '' : this.opd.email
      },
      phoneText: function () {
        return (this.opd === '') ? '' : this.opd.phone
      }
    }
  }
</script>
