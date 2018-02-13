<template>
  <div v-if="formCode" v-bind="validCode" style="margin-top: 24px;">
    <v-card-text class="card_text_signup">
      <v-flex>
        <v-text-field
          autofocus
          ref="codereg"
          v-model="codereg"
          label="Kode Registrasi"
          v-validate="'required'"
          data-vv-name="codereg"
          class="input-group--focused"
          :error-messages="errorMessageCode"
          :mask="maskCode"
          v-on:keyup.enter="checkCode"
        ></v-text-field>
      </v-flex>
    </v-card-text>
    <v-card-actions class="card_action_signup">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click.native.stop="checkCode">Lanjutkan</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
  const customHelptext = {
    en: {
      custom: {
        codereg: {
          required: 'Kode Registrasi harus diisi.'
        }
      }
    }
  }
  export default {
    data () {
      return {
        formCode: true,
        doCheckCode: false,
        codereg: '',
        maskCode: 'N - N - N - N - N - N'
      }
    },
    computed: {
      errorMessageCode () {
        if (this.$store.state.checkcode.errorOnFind !== null) {
          this.doCheckCode = false
          return 'Kode Registrasi tidak tersedia.'
        } else {
          return this.errors.collect('codereg')
        }
      },
      validCode () {
        if (this.doCheckCode && !this.$store.state.checkcode.isFindPending && this.$store.state.checkcode.errorOnFind === null) {
          this.doCheckCode = false
          this.formCode = false
          this.$validator.reset()
          let data = {
            codereg: this.codereg
          }
          this.$root.$emit('signupStepProfile', data)
        }
      }
    },
    watch: {
      codereg (val) {
        if (val.length === 0) {
          this.$store.commit('checkcode/clearFindError')
        }
      }
    },
    methods: {
      checkCode () {
        this.$store.commit('checkcode/clearFindError')
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              let params = {
                query: {
                  code: this.codereg
                }
              }
              this.doCheckCode = true
              this.$store.dispatch('checkcode/find', params)
            }
          })
      }
    },
    created () {
      this.$validator.localize(customHelptext)
    }
  }
</script>
