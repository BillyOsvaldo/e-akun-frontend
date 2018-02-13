<template>
  <div>
    <v-toolbar flat dark color="primary" style="padding: 0 8px;">
      <v-toolbar-side-icon @click.stop="isOpen = !isOpen"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">e-Akun</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="white--text">
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon color="white--text">
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon color="white--text">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer
        temporary
        v-model="isOpen"
        absolute
      >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title style="font-size: 24px;
    font-weight: 400;">e-Akun</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0">
        <v-list-tile
        v-for="item in $store.getters['menuapp/list']"
        :key="item._id"
        ripple
        router
        :to="item.to"
        exact
        @click="">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isOpen: null
      }
    }
  }
</script>

<style lang="sass">
  .pt-0
    margin-top: 16px
  .list__tile.list__tile--active
    color: rgba(0,0,0,0.87)
    opacity: 1
    background: #eee !important
  .list__tile--link:hover
    background: #f7f7f7
</style>
