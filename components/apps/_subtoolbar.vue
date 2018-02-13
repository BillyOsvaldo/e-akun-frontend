<template>
  <div>
    <v-toolbar flat light color="white" style="padding: 0 8px;">
      <v-toolbar-title>{{$store.getters.navigationTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="white--text">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider/>
  </div>
</template>
