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
    service('users'),
    service('profiles'),
    service('postcodes'),
    service('organizations'),
    service('roles'),
    service('permissions'),
    service('administrators'),
    service('apps'),
    service('usersmanagement'),
    service('coderegsmanagement'),
    service('organizationsmanagement'),
    service('appsmanagement'),
    service('permissionsmanagement'),
    auth(
      {
        state: {
          publicPages: [
            'signin', 'signup'
          ]
        },
        userService: 'users'
      }
    ),
    service('menuapp')
  ]
})

const createStore = () => {
  return storeSocket
}

export default createStore
