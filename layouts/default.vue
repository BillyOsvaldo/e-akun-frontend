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
      hasToolbarLoaded: false,
      hasSubToolbarLoaded: false,
      hasLoaded: false,
      hasMenuLoaded: false
    }
  },
  components: {
    loader,
    flash,
    toolbarnav,
    subtoolbar
  },
  computed: {
    processData: function () {
      // start loading
      if (!this.hasMenuLoaded && !this.$store.state.auth.publicPages.includes(this.$route.name)) {
        this.isLoading = true
        this.isFlashing = true
      }

      if (this.$store.state.auth.publicPages.includes(this.$route.name)) {
        this.hasLoaded = true
      } else {
        this.hasLoaded = false
      }

      // init menu
      if (this.$store.getters['userapp/current'] !== null && !this.hasMenuLoaded) {
        this.hasMenuLoaded = true
        this.initMenu()
      }

      // menu loaded
      if (this.hasMenuLoaded) {
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
      if (this.$store.state.auth.accessToken && this.$store.state.userapp.currentId === null) {
        // Populate the user if the userappervice was provided
        if (this.$store.state.auth.payload.hasOwnProperty('userId')) {
          let data = {
            strategy: 'jwt',
            accessToken: this.$store.state.auth.accessToken
          }
          api.authenticate(data)
            .then(response => {
              if (response.accessToken) {
                this.$store.dispatch('userapp/get', this.$store.state.auth.payload.userId)
              }
            })
        }
      }
    },
    initMenu () {
      console.log('initMenu')
      let params = {
        query: {
          permission: this.$store.getters['userapp/current'].permissions._id,
          role: this.$store.getters['userapp/current'].role._id
        }
      }
      this.$store.dispatch('menuapp/find', params)
    }
  },
  created () {
    this.initAuth()
  }
}
</script>

<style lang="sass">
  @import '../assets/styles/app.sass'
</style>
