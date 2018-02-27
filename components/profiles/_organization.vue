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
        <div>
          <v-btn icon disabled v-if="$route.name === 'profile'">
            <v-icon>https</v-icon>
          </v-btn>
          <v-tooltip top v-if="administrator && $route.name === 'organization'">
            <v-btn slot="activator" flat icon @click.native.stop="$root.$emit('openDialogOrgAddress')">
              <v-icon>edit</v-icon>
            </v-btn>
            <span>Ubah Alamat Lengkap</span>
          </v-tooltip>
        </div>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Alamat Email</v-list-tile-title>
        <v-list-tile-sub-title>{{mailText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <div>
          <v-btn icon disabled v-if="$route.name === 'profile'">
            <v-icon>https</v-icon>
          </v-btn>
          <v-tooltip top v-if="administrator && $route.name === 'organization'">
            <v-btn slot="activator" flat icon @click.native.stop="$root.$emit('openDialogOrgEmail')">
              <v-icon>edit</v-icon>
            </v-btn>
            <span>Ubah Alamat Email</span>
          </v-tooltip>
        </div>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>No. Telepon</v-list-tile-title>
        <v-list-tile-sub-title>{{phoneText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <div>
          <v-btn icon disabled v-if="$route.name === 'profile'">
            <v-icon>https</v-icon>
          </v-btn>
          <v-tooltip top v-if="administrator && $route.name === 'organization'">
            <v-btn slot="activator" flat icon @click.native.stop="$root.$emit('openDialogOrgPhone')">
              <v-icon>edit</v-icon>
            </v-btn>
            <span>Ubah No. Telepon</span>
          </v-tooltip>
        </div>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>No. Faximile</v-list-tile-title>
        <v-list-tile-sub-title>{{faxText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <div>
          <v-btn icon disabled v-if="$route.name === 'profile'">
            <v-icon>https</v-icon>
          </v-btn>
          <v-tooltip top v-if="administrator && $route.name === 'organization'">
            <v-btn slot="activator" flat icon @click.native.stop="$root.$emit('openDialogOrgFax')">
              <v-icon>edit</v-icon>
            </v-btn>
            <span>Ubah No. Faximile</span>
          </v-tooltip>
        </div>
      </v-list-tile-action>
    </v-list-tile>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Website</v-list-tile-title>
        <v-list-tile-sub-title>{{websiteText}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <div>
          <v-btn icon disabled v-if="$route.name === 'profile'">
            <v-icon>https</v-icon>
          </v-btn>
          <v-tooltip top v-if="administrator && $route.name === 'organization'">
            <v-btn slot="activator" flat icon @click.native.stop="$root.$emit('openDialogOrgSite')">
              <v-icon>edit</v-icon>
            </v-btn>
            <span>Ubah No. Website</span>
          </v-tooltip>
        </div>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {addressFormat} from '~/utils/format'
  export default {
    computed: {
      ...mapGetters({
        administrator: 'administrators/current',
        organization: 'organizations/current',
        postcodes: 'postcodes/list'
      }),
      nameText: function () {
        return (typeof this.organization === 'undefined') ? '' : this.organization.name
      },
      addressText: function () {
        return (typeof this.organization === 'undefined' && typeof this.postcodes === 'undefined') ? '' : addressFormat(this.organization.address, this.postcodes.find((item) => item._id === this.organization.address.postcode))
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
