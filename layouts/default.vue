<template>
  <v-app v-bind="processData">
    <loader :isShow="isLoading" />
    <flash :isFlash="isFlashing" />
    <toolbarnav v-if="hasToolbarLoaded" />
    <subtoolbar v-if="hasSubToolbarLoaded" />
    <nuxt v-if="hasLoaded"/>
  </v-app>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import api from '../api/feathers-client'
import loader from '../components/apps/_loader'
import flash from '../components/apps/_flash'
import toolbarnav from '../components/apps/_toolbar_nav'
import subtoolbar from '../components/apps/_subtoolbar'
export default {
  data () {
    return {
      isLoading: false,
      isFlashing: false,
      verified: false,
      hasToolbarLoaded: false,
      hasSubToolbarLoaded: false,
      hasLoaded: false,
      hasMenuLoaded: false,
      hasUserLoading: false,
      hasUserLoaded: false
    }
  },
  components: {
    loader,
    flash,
    toolbarnav,
    subtoolbar
  },
  computed: {
    ...mapState({
      auth: 'auth',
      user: 'users'
    }),
    ...mapGetters({
      dataUser: 'users/current',
      permissions: 'permissions/current',
      role: 'roles/current',
      menuList: 'menus/list'
    }),
    processData: function () {
      // start loading
      if (!this.hasMenuLoaded && !this.auth.publicPages.includes(this.$route.name)) {
        this.isLoading = true
        this.isFlashing = true
      }

      if (this.auth.publicPages.includes(this.$route.name)) {
        this.hasLoaded = true
      } else {
        this.hasLoaded = false
      }

      // init menu
      if (this.auth.user && !this.auth.publicPages.includes(this.$route.name)) {
        if (!this.hasUserLoaded) {
          this.loadDataUser(this.auth.user)
        }
        if (this.hasUserLoaded && !this.hasMenuLoaded) {
          this.hasMenuLoaded = true
          this.initMenu()
        }
      }

      // verified page
      if (this.menuList.length > 0 && this.$route.path) {
        let _checkMenu = this.menuList.find((item) => item.to === this.$route.path)
        if (typeof _checkMenu !== 'object') {
          this.verified = false
          this.$router.push('/')
        } else {
          this.verified = true
        }
      }

      // menu loaded
      if (this.verified && this.hasMenuLoaded) {
        this.isLoading = false
        this.isFlashing = false
        this.hasToolbarLoaded = true
        this.hasSubToolbarLoaded = true
        this.hasLoaded = true
      }
    }
  },
  methods: {
    initAuth () {
      if (this.auth.accessToken && this.user.currentId === null) {
        if (this.auth.payload.hasOwnProperty('userId')) {
          this.$store.dispatch('users/get', this.auth.payload.userId).then((user) => {
            // JWT authentication successful
            if (user && this.auth.userService) {
              this.loadDataUser(user)
            }
          }).catch(e => {
            // console.error('Authentication error', e)
            // Load auth again :D
            api.authenticate().then(response => {
              this.$store.dispatch('users/get', this.auth.payload.userId).then((user) => {
                // JWT authentication successful
                if (user && this.auth.userService) {
                  this.loadDataUser(user)
                }
              })
            })
          })
        }
      }
    },
    async loadDataUser (user) {
      if (!this.hasUserLoading) {
        this.hasUserLoading = true
        // set user
        if (this.dataUser === null) {
          this.$store.commit('users/addItem', user)
          this.$store.commit('users/setCurrent', user)
        }
        // set profile
        if (user.profile) {
          let profile = await this.$store.dispatch('profiles/get', user.profile)
          if (profile.address.postcode) {
            await this.$store.dispatch('postcodes/get', profile.address.postcode)
          }
        }
        // find organization user
        if (user.organizationuser) {
          let organizationuser = await this.$store.dispatch('organizationusers/get', user.organizationuser)
          user.organizationuser = organizationuser
        }

        // find organization
        if (user.organizationuser.organization) {
          let organization = await this.$store.dispatch('organizations/get', user.organizationuser.organization)
          if (organization.address.postcode) {
            await this.$store.dispatch('postcodes/get', organization.address.postcode)
          }
        }
        // clear current postcodes
        this.$store.commit('postcodes/clearCurrent')
        // find role
        if (user.role) {
          await this.$store.dispatch('roles/get', user.role)
        }
        // find permissions
        let params = {
          query: {
            $or: [
              {
                app: process.env.ID_APP
              },
              {
                app: null
              }
            ]
          }
        }
        let allpermissions = await this.$store.dispatch('permissions/find', params)
        let permissions = null
        if (user.permissions) {
          user.permissions.forEach((item) => {
            let _permission = allpermissions.data.find((i) => i._id === item)
            if (typeof _permission !== 'undefined') {
              permissions = _permission
            }
          })
        }
        this.$store.commit('permissions/setCurrent', permissions)
        if (permissions) {
          await this.$store.dispatch('administrators/get', permissions.administrator)
          if (permissions.app) {
            await this.$store.dispatch('apps/get', permissions.app)
          }
        }
        this.$store.commit('auth/setUser', user)
        this.hasUserLoaded = true
        this.hasUserLoading = false
      }
    },
    initMenu () {
      let permission = null
      let role = null
      if (this.permissions) {
        permission = this.permissions._id
      }
      if (this.role) {
        role = this.role._id
      }
      let params = {
        query: {
          $or: [
            {permissions: permission},
            {roles: role},
            { $and: [ { roles: [] }, { permissions: [] } ] }
          ]
        }
      }
      this.$store.dispatch('menus/find', params)
    }
  },
  created () {
    this.initAuth()
    this.$store.commit('menus/clearAll')
  }
}
</script>

<style lang="sass">
  @import '../assets/styles/app.sass'
</style>
