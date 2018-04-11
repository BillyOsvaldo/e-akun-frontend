<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEdit" persistent scrollable max-width="480">
      <v-card v-if="dialogEdit">
        <v-card-title class="headline">Ubah Kode Registrasi</v-card-title>
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
                  v-on:keyup.enter="postPatched"
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
                    item-value="_id"
                    item-text="organizationstructure"
                    :search-input.sync="search"
                    v-model="organizationstructure"
                    :error-messages="errorOrganizationStructure"
                  ></v-select>
                </v-flex>
                <v-flex>
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="menu_organizationStructuresUsersStartDate"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
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
                      @input="organizationStructuresUsersStartDate = formatDate($event)"
                      no-title scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
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
                  :search-input.sync="search"
                  v-model="inside"
                  v-validate="'required'"
                  data-vv-name="inside"
                  :error-messages="errors.collect('inside')"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu_startDate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
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
                    @input="startDate = formatDate($event)"
                    no-title scrollable actions>
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closedialogEditButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postPatched">Simpan</v-btn>
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
      dialogEdit: false,
      email: null,
      loading: false,
      search: null,
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
        codereg: 'coderegsmanagement/current',
        organization: 'organizations/current',
        organizationstructuresselect: 'organizationstructuresselect/list',
        organizationusers: 'organizationusersbyuser/list',
        organizationstructuresusers: 'organizationstructuresusersbyuser/list'
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
        if (val && val.length === 0) {
          this.$store.commit('checkuser/clearFindError')
        }
      },
      position (val) {
        if (!val) {
          this.organizationstructure = null
          this.organizationStructuresUsersStartDate = null
        }
      },
      organizationstructure (val) {
        if (val) {
          this.onChangeOrganizationStructure(val)
        }
      }
    },
    methods: {
      loadData () {
        if (this.dialogEdit) {
          this.$validator.reset()
          this.email = (typeof this.codereg.email === 'undefined') ? '' : this.codereg.email
          this.inside = (this.organizationusers.length === 0) ? null : this.organizationusers[0].inside
          this.organizationstructure = (this.organizationstructuresusers.length === 0) ? null : this.organizationstructuresusers[0].organizationstructure
          this.date_for_startDate = (this.organizationusers.length === 0) ? null : moment(this.organizationusers[0].startDate).format('YYYY-MM-DD')
          this.startDate = (this.organizationusers.length === 0) ? null : formatFormDate(moment(this.organizationusers[0].startDate).format('YYYY-MM-DD'))
          this.date_for_organizationStructuresUsersStartDate = (this.organizationstructuresusers.length === 0) ? null : moment(this.organizationstructuresusers[0].startDate).format('YYYY-MM-DD')
          this.organizationStructuresUsersStartDate = (this.organizationstructuresusers.length === 0) ? null : formatFormDate(moment(this.organizationstructuresusers[0].startDate).format('YYYY-MM-DD'))
          if (this.organizationstructuresusers.length > 0) {
            this.position = true
          }
        }
      },
      checkEmail () {
        this.$store.commit('checkuser/clearFindError')
        if (this.email && this.codereg.email) {
          let params = {
            query: {
              email: this.email
            }
          }
          this.$store.dispatch('checkuser/find', params)
        }
      },
      onChangeOrganizationStructure (val) {
        if (val) {
          let orgStructurDoc = this.item_organizationstructures.find((item) => item._id === val)
          if ((orgStructurDoc.organizationstructure.search(/(sub|seksi)/i)) === -1) {
            this.inside = val
          } else {
            let orgStructurSelDoc = this.organizationstructuresselect.find((item) => item._id === val)
            this.inside = orgStructurSelDoc.parent
          }
          if (this.startDate) {
            this.organizationStructureStartDate = this.startDate
          }
        }
      },
      closedialogEditButton () {
        this.dialogEdit = !this.dialogEdit
        this.resetAll()
      },
      formatDate (value) {
        return formatFormDate(value)
      },
      onBlur (field) {
        setTimeout(() => this.$validator.validate(field), 500)
      },
      postPatched () {
        this.isPosting = true
        this.hasError = false
        setTimeout(() => {
          this.$validator.validateAll()
            .then((result) => {
              if (result && !this.hasError && this.checkuser.errorOnFind === null) {
                let editCodeReg = {
                  email: this.email,
                  organization: this.organization._id,
                  organizationstructure: this.organizationstructure,
                  inside: this.inside,
                  organizationUsersStartDate: parseFormDate(this.startDate),
                  organizationStructuresUsersStartDate: parseFormDate(this.organizationStructuresUsersStartDate)
                }
                let params = {}
                this.$store.dispatch('coderegsmanagement/patch', [this.codereg._id, editCodeReg, params])
                  .then(response => {
                    if (response) {
                      this.dialogEdit = false
                      this.resetAll()
                    }
                  })
              }
            })
        }, 100)
      },
      resetAll () {
        this.$store.commit('checkuser/clearFindError')
        this.$store.commit('coderegsmanagement/clearPatchError')
        this.$store.commit('organizationusersbyuser/clearAll')
        this.$store.commit('organizationstructuresusersbyuser/clearAll')
        this.$validator.reset()
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
      this.$root.$on('openDialogEditCodeRegs', () => {
        this.dialogEdit = true
        this.loadData()
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
