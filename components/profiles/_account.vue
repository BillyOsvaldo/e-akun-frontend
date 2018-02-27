<template>
  <v-list two-line style="padding: 0 8px;background: #f7f7f7;">
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>ID Akun</v-list-tile-title>
        <v-list-tile-sub-title>{{idAccountText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon disabled>
          <v-icon>https</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Email</v-list-tile-title>
        <v-list-tile-sub-title>{{emailText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn slot="activator" flat icon @click.native.stop="$root.$emit('openDialogEmail')">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>Ubah Alamat Email</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Kata Sandi</v-list-tile-title>
        <v-list-tile-sub-title>*****</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn slot="activator" flat icon @click.native.stop="$root.$emit('openDialogPassword')">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>Ubah Kata Sandi</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        user: 'users/current'
      }),
      idAccountText: function () {
        if (this.user !== null) {
          return this.user.username
        }
      },
      emailText: function () {
        if (this.user !== null) {
          return this.user.email
        }
      }
    }
  }
</script>
