<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAdd" persistent scrollable max-width="480">
      <v-card v-if="dialogAdd">
        <v-card-title class="headline">Tambah Kode Registrasi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="email"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  label="Alamat Email"
                  v-on:blur="checkEmail"
                  :error-messages="errorMessageEmail"
                  v-on:keyup.enter="postCreated"
                  ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-checkbox label="Apakah mempunyai jabatan?" v-model="position"></v-checkbox>
              </v-flex>
              <div v-if="position" style="width: 100%">
                <v-flex>
                  <v-select
                    label="Pilih Jabatan"
                    autocomplete
                    :disabled="(item_organizationstructures.length > 0) ? false : true"
                    :loading="loading"
                    :items="item_organizationstructures"
                    item-text="organizationstructure"
                    :search-input.sync="searchOrganizationStructure"
                    v-model="organizationstructure"
                    :error-messages="errorOrganizationStructure"
                  ></v-select>
                </v-flex>
                <v-flex>
                  <v-menu
                    ref="menu_organizationStructuresUsersStartDate"
                    lazy
                    :close-on-content-click="false"
                    v-model="menu_organizationStructuresUsersStartDate"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                    :return-value.sync="organizationStructuresUsersStartDate"
                  >
                    <v-text-field
                      slot="activator"
                      label="Mulai Tanggal Jabatan"
                      v-model="organizationStructuresUsersStartDate"
                      prepend-icon="event"
                      readonly
                      :error-messages="errorOrganizationStructureStartDate"
                    ></v-text-field>
                    <v-date-picker
                      locale="id"
                      v-model="date_for_organizationStructuresUsersStartDate"
                      @input="organizationStructuresUsersStartDate = formatDate($event)">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu_organizationStructuresUsersStartDate = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu_organizationStructuresUsersStartDate.save(organizationStructuresUsersStartDate)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </div>
              <v-flex>
                <v-select
                  label="Pilih Penempatan dalam Organisasi"
                  autocomplete
                  :disabled="(item_insides.length > 0) ? false : true"
                  :loading="loading"
                  v-bind:items="item_insides"
                  item-text="inside"
                  item-value="_id"
                  :search-input.sync="searchInside"
                  v-model="inside"
                  v-validate="'required'"
                  data-vv-name="inside"
                  :error-messages="errors.collect('inside')"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-menu
                  ref="menu_startDate"
                  lazy
                  :close-on-content-click="false"
                  v-model="menu_startDate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  :return-value.sync="startDate"
                >
                  <v-text-field
                    slot="activator"
                    label="Mulai Tanggal Penempatan"
                    v-model="startDate"
                    v-validate="'required'"
                    data-vv-name="startDate"
                    data-vv-as="startDate"
                    prepend-icon="event"
                    validate-on-blur
                    readonly
                    @blur="onBlur('startDate')"
                    :error-messages="errors.collect('startDate')"
                  ></v-text-field>
                  <v-date-picker
                    locale="id"
                    v-model="date_for_startDate"
                    @input="startDate = formatDate($event)">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu_startDate = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu_startDate.save(startDate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closedialogAddButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postCreated">Tambah</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import moment from 'moment'
  import {formatFormDate, parseFormDate} from '~/utils/format'
  moment.locale('id')
  const customHelptext = {
    en: {
      custom: {
        email: {
          required: 'Alamat Email harus diisi.',
          email: 'Format Email harus benar.'
        },
        startDate: {
          required: 'Mulai Tanggal Penempatan harus diisi.'
        },
        inside: {
          required: 'Penempatan dalam Organisasi harus dipilih.'
        }
      }
    }
  }

  export default {
    data: () => ({
      dialogAdd: false,
      hasCheckEmail: false,
      email: null,
      loading: false,
      searchOrganizationStructure: null,
      searchInside: null,
      position: false,
      menu_startDate: false,
      date_for_startDate: null,
      startDate: null,
      organizationstructure: null,
      menu_organizationStructuresUsersStartDate: false,
      date_for_organizationStructuresUsersStartDate: null,
      organizationStructuresUsersStartDate: null,
      inside: null,
      isPosting: false,
      hasError: false
    }),
    computed: {
      ...mapState({
        checkuser: 'checkuser'
      }),
      ...mapGetters({
        user: 'users/current',
        organization: 'organizations/current',
        organizationstructuresselect: 'organizationstructuresselect/list'
      }),
      errorMessageEmail () {
        if (this.checkuser.errorOnFind !== null) {
          return 'Email telah digunakan.'
        } else {
          return this.errors.collect('email')
        }
      },
      errorOrganizationStructure () {
        if (this.isPosting && this.position && this.organizationstructure === null) {
          this.hasError = true
          return 'Jabatan harus dipilih'
        } else {
          this.hasError = false
        }
      },
      errorOrganizationStructureStartDate () {
        if (this.isPosting && this.position && this.organizationStructuresUsersStartDate === null) {
          this.hasError = true
          return 'Mulai Tanggal Jabatan harus diisi'
        } else {
          this.hasError = false
        }
      },
      item_organizationstructures () {
        let _output = []
        if (this.organizationstructuresselect.length > 0) {
          this.organizationstructuresselect.forEach((item) => {
            let data = {
              _id: item._id,
              organizationstructure: (item.structure.nameOfPosition + (item.name === null ? '' : ' ' + item.name))
            }
            _output.push(data)
          })
        }
        return _output
      },
      item_insides () {
        let _output = []
        if (this.organizationstructuresselect.length > 0) {
          this.organizationstructuresselect.forEach((item) => {
            let data = {
              _id: item._id,
              inside: (item.structure.name + (item.name === null ? '' : ' ' + item.name))
            }
            if ((item.structure.name.search(/(sub|seksi)/i)) === -1) {
              _output.push(data)
            }
          })
        }
        return _output
      }
    },
    watch: {
      email (val) {
        if (typeof val !== 'undefined' && val !== null) {
          if (val.length === 0) {
            this.$store.commit('checkuser/clearFindError')
          }
        }
      },
      organizationstructure (val) {
        if (val) {
          this.onChangeOrganizationStructure(val)
        }
      }
    },
    methods: {
      checkEmail () {
        this.$store.commit('checkuser/clearFindError')
        if (this.email) {
          let params = {
            query: {
              email: this.email
            }
          }
          this.$store.dispatch('checkuser/find', params)
          this.$nextTick(() => {
            this.hasCheckEmail = true
          })
        }
      },
      onChangeOrganizationStructure (val) {
        if (val) {
          if ((val.organizationstructure.search(/(sub|seksi)/i)) === -1) {
            this.inside = val._id
          } else {
            let orgStructurSelDoc = this.organizationstructuresselect.find((item) => item._id === val._id)
            this.inside = orgStructurSelDoc.parent
          }
          if (this.startDate) {
            this.organizationStructureStartDate = this.startDate
          }
        }
      },
      closedialogAddButton () {
        this.dialogAdd = !this.dialogAdd
        this.resetAll()
      },
      postCreated () {
        this.isPosting = true
        this.hasError = false
        setTimeout(() => {
          this.$validator.validateAll()
            .then((result) => {
              if (result && !this.hasError && this.hasCheckEmail && this.checkuser.errorOnFind === null) {
                this.isPosting = false
                let newCodeReg = {
                  email: this.email,
                  organization: this.organization._id,
                  organizationstructure: this.organizationstructure,
                  inside: this.inside,
                  organizationUsersStartDate: parseFormDate(this.startDate),
                  organizationStructuresUsersStartDate: parseFormDate(this.organizationStructuresUsersStartDate)
                }
                this.$store.dispatch('coderegsmanagement/create', newCodeReg)
                  .then(response => {
                    if (response) {
                      this.dialogAdd = false
                      this.resetAll()
                    }
                  })
              }
            })
        }, 100)
      },
      formatDate (value) {
        return formatFormDate(value)
      },
      onBlur (field) {
        setTimeout(() => this.$validator.validate(field), 500)
      },
      resetAll () {
        this.$store.commit('checkuser/clearFindError')
        this.$store.commit('coderegsmanagement/clearPatchError')
        this.$validator.reset()
        this.hasCheckEmail = false
        this.email = null
        this.search = null
        this.position = false
        this.menu_startDate = false
        this.date_for_startDate = null
        this.startDate = null
        this.organizationstructure = null
        this.menu_organizationStructuresUsersStartDate = false
        this.date_for_organizationStructuresUsersStartDate = null
        this.organizationStructuresUsersStartDate = null
        this.inside = null
        this.isPosting = false
        this.hasError = false
      }
    },
    created () {
      this.$root.$on('openDialogAddCodeRegs', () => {
        this.dialogAdd = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
