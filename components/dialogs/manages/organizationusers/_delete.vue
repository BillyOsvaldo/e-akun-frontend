<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogDeleteOrganizationUsers" persistent scrollable max-width="480">
      <v-card v-if="dialogDeleteOrganizationUsers">
        <v-card-title class="headline">Hapus Penempatan/Jabatan</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                Apakah anda ingin menghapus penempatan/jabatan pengguna ini?
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Hapus</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  data () {
    return {
      dialogDeleteOrganizationUsers: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      organizationusersdraftmanagement: 'organizationusersdraftmanagement/current'
    })
  },
  methods: {
    closeDialogButton () {
      this.dialogDeleteOrganizationUsers = !this.dialogDeleteOrganizationUsers
      this.resetAll()
    },
    postUpdate () {
      this.$store.commit('organizationusersdraftmanagement/clearRemoveError')
      this.$store.dispatch('organizationusersdraftmanagement/remove', this.organizationusersdraftmanagement._id)
        .then(response => {
          if (response) {
            this.dialogDeleteOrganizationUsers = false
            this.resetAll()
          }
        })
    },
    resetAll () {
      this.$store.commit('organizationusersdraftmanagement/clearRemoveError')
    }
  },
  created () {
    this.$root.$on('openDialogDeleteorganizationusers', () => {
      this.dialogDeleteOrganizationUsers = true
    })
  }
}
</script>