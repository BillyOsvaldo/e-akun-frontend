import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '../api/feathers-client'
import state from './state.js'
import getters from './getters.js'
import mutations from './mutations.js'
import actions from './actions.js'

const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

Vue.use(Vuex)

export const storeSocket = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [
    service('addresses'),
    service('userapp'),
    service('coderegs'),
    service('checkcode', {
      idField: 'code'
    }),
    service('resend-email', {
      idField: 'status'
    }),
    service('checkuser', {
      idField: 'status'
    }),
    auth({
      state: {
        publicPages: [
          'signin', 'signup'
        ]
      }
    }),
    service('menuapp')
  ]
})

const createStore = () => {
  return storeSocket
}

export default createStore
