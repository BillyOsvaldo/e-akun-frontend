<template>
  <div style="background: #fff;min-height: 100vh">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex
          d-flex
          xs12 sm4 md3
          v-for="item in this.$store.getters['menuapp/list'].filter(item => item.to !== '/')"
          :key="item._id"
          style="padding: 16px;"
        >
          <v-card
            class="menu-item"
            flat
            tile
            exact
            :to="item.to">
            <div class="menu-item-content">
              <v-icon style="font-size: 54px;" :color="item.color">{{item.icon}}</v-icon>
              <h2 style="font-weight: 400;">{{item.name}}</h2>
              <p>{{item.desc}}</p>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Home')
  }
}
</script>

<style lang="sass">
  .menu-item
    text-align: center
    padding: 16px
    cursor: pointer
    width: 196px
    &:hover
      background: #cccccc4d
  .menu-item-content
    p
      height: 36px
      font-size: 12px
</style>
