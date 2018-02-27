<template>
  <v-list two-line style="padding: 0 8px;background: #f7f7f7;">
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Nama Lengkap</v-list-tile-title>
        <v-list-tile-sub-title>{{fullnameText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn slot="activator" flat icon @click.native="$root.$emit('openDialogFullname')">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>Ubah Nama Lengkap</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>NIP</v-list-tile-title>
        <v-list-tile-sub-title>{{nipText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon disabled>
          <v-icon>https</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Alamat</v-list-tile-title>
        <v-list-tile-sub-title><span v-html="addressText"></span></v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn slot="activator" flat icon  @click.native="$root.$emit('openDialogAddress')">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>Ubah Alamat</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Jenis Kelamin</v-list-tile-title>
        <v-list-tile-sub-title>{{genderText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn slot="activator" flat icon @click.native="$root.$emit('openDialogGender')">
            <v-icon>edit</v-icon>
          </v-btn>
        <span>Ubah Jenis Kelamin</span>
      </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Tempat Lahir</v-list-tile-title>
        <v-list-tile-sub-title>{{birthplaceText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn slot="activator" flat icon  @click.native="$root.$emit('openDialogBirthplace')">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>Ubah Tempat Lahir</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Tanggal Lahir</v-list-tile-title>
        <v-list-tile-sub-title>{{birthdayText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn slot="activator" flat icon  @click.native="$root.$emit('openDialogBirthday')">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>Ubah Tanggal Lahir</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>No. Telepon</v-list-tile-title>
        <v-list-tile-sub-title>
          <div class="text-xs-left">
            <v-chip v-for="(item, index) in phoneList.lists" :color="(index === phoneList.primary_key) ? 'primary' : ''" :key="index" outline>
              {{ item }}
            </v-chip>
          </div>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-tooltip top>
          <v-btn slot="activator" flat icon @click.native="$root.$emit('openDialogPhone')">
            <v-icon>edit</v-icon>
          </v-btn>
          <span>Ubah No. Telepon</span>
        </v-tooltip>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {nameFormat, nipFormat, genderFormat, addressFormat, birthdayFormat, objectFormat} from '~/utils/format'
  export default {
    computed: {
      ...mapGetters({
        profiles: 'profiles/current',
        postcodes: 'postcodes/list'
      }),
      fullnameText: function () {
        return (typeof this.profiles === 'undefined') ? '' : nameFormat(this.profiles.name)
      },
      nipText: function () {
        return (typeof this.profiles === 'undefined') ? '-' : nipFormat(this.profiles.nip)
      },
      genderText: function () {
        return (typeof this.profiles === 'undefined') ? '' : genderFormat(this.profiles.gender)
      },
      addressText: function () {
        return (typeof this.profiles === 'undefined' && typeof this.postcodes === 'undefined') ? '' : addressFormat(this.profiles.address, this.postcodes.find((item) => item._id === this.profiles.address.postcode))
      },
      birthdayText: function () {
        return (typeof this.profiles === 'undefined') ? '' : birthdayFormat(objectFormat(this.profiles.birth, 'day'))
      },
      birthplaceText: function () {
        return (typeof this.profiles === 'undefined') ? '' : objectFormat(this.profiles.birth, 'place')
      },
      phoneList: function () {
        return (typeof this.profiles === 'undefined') ? '' : this.profiles.phone
      }
    }
  }
</script>

<style lang="sass" scoped>
    .defaultphone
      font-weight: 500
</style>
