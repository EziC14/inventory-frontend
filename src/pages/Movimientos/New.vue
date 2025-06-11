<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-md q-pt-lg" style="padding: 30px 70px;">
      <!-- Header Section -->
      <div class="row items-center justify-between q-mb-lg">
        <div class="text-h5 text-weight-bold text-primary">
          <Title name="Nuevo Movimiento de Inventario" />
        </div>
        <q-circular-progress
          show-value
          font-size="12px"
          :value="progressValue"
          size="70px"
          :thickness="0.22"
          color="primary"
          track-color="grey-3"
          class="q-ml-md"
        >
          <span class="text-weight-bold">{{ currentStep }}/{{ steps.length }}</span>
        </q-circular-progress>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Left navigation -->
        <div class="col-12 col-md-3">
          <q-card class="steps-card">
            <q-list padding class="rounded-borders">
              <q-item
                v-for="(step, index) in steps"
                :key="index"
                :class="{
                  'step-active': currentStep === index + 1,
                  'step-completed': currentStep > index + 1,
                  'step-pending': currentStep < index + 1
                }"
                class="q-py-md step-item"
              >
                <q-item-section avatar>
                  <q-avatar
                    :color="currentStep >= index + 1 ? 'primary' : 'grey-4'"
                    text-color="white"
                    size="42px"
                  >
                    <q-icon :name="getStepIcon(index + 1)" size="sm" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label
                    class="text-subtitle1"
                    :class="{
                      'text-weight-bold': currentStep === index + 1,
                      'text-grey': currentStep < index + 1
                    }"
                  >
                    {{ step }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side v-if="currentStep > index + 1">
                  <q-icon name="check_circle" color="positive" size="sm" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- Right content -->
        <div class="col-12 col-md-9 q-pl-md">
          <q-card
            class="custom-card"
            style="border-radius: 20px; box-shadow: none; padding: 40px; height: calc(100vh - 200px); min-height: 600px; display: flex; flex-direction: column;"
          >
            <!-- Step 1: Basic Information -->
            <div v-if="currentStep === 1" class="full-height" style="display: flex; flex-direction: column;">
              <!-- Header -->
              <div class="header">
                <div class="text-h6">Información Básica</div>
              </div>

              <!-- Content -->
              <div class="content flex-grow-1">
                <div class="q-mt-lg">
                  <div class="row q-col-gutter-x-md">

                    <SelectInput
                      :text="movement.direction"
                      @change-name="(e) => (movement.direction = e)"
                      class="col-12 col-md-6 q-mb-xs"
                      :options="directionOptions"
                      icon="swap_horiz"
                      :isRequired="true"
                      labelBody="Dirección de Movimiento"
                      iconPosition="prepend"
                    />

                    <SelectInput
                      :text="movement.reason_type"
                      @change-name="(e) => (movement.reason_type = e)"
                      class="col-12 col-md-6 q-mb-xs"
                      :options="reasonTypes"
                      icon="category"
                      :isRequired="true"
                      labelBody="Motivo del Movimiento"
                      iconPosition="prepend"
                    />

                    <SelectInput
                      :text="movement.supplier"
                      @change-name="(e) => (movement.supplier = e)"
                      class="col-12 col-md-6 q-mb-xs"
                      :options="suppliers"
                      icon="business"
                      :isRequired="false"
                      labelBody="Proveedor"
                      iconPosition="prepend"
                    />

                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="movement.client_name"
                        outlined
                        label="Nombre del Cliente"
                        :rules="[val => movement.direction && movement.direction.value === 'OUT' ? !!val || 'Nombre del cliente requerido para Salida' : true]"
                      />
                    </div>

                    <div class="col-12">
                      <q-input
                        v-model="movement.notes"
                        outlined
                        type="textarea"
                        label="Notas"
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn
                    @click="goTo('/movements')"
                    color="primary"
                    class="q-px-xl q-py-sm"
                    rounded
                    outline
                    label="Cancelar"
                  />
                </div>
                <div>
                  <q-btn
                    :disable="verifyFirstStep"
                    @click="nextStep"
                    color="primary"
                    rounded
                    class="bg-primary text-white q-px-xl q-py-sm"
                    label="Continuar"
                  />
                </div>
              </q-stepper-navigation>
            </div>

            <!-- Step 2: Movement Details -->
            <div v-if="currentStep === 2" class="full-height" style="display: flex; flex-direction: column;">
              <!-- Header -->
              <div class="header">
                <div class="text-h6">Detalles del Movimiento</div>
              </div>

              <!-- Content -->
              <div class="content flex-grow-1">
                <div class="row q-mb-md items-center justify-between">
                  <q-btn
                    @click="addMovementDetail"
                    color="primary"
                    icon="add"
                    label="Agregar Detalle"
                    unelevated
                    v-if="movementDetails.length === 0"
                  />
                </div>

                <div v-if="!movementDetails.length" class="empty-state q-pa-xl text-center">
                  <q-icon name="inventory" size="4rem" color="grey-4" />
                  <div class="text-h6 text-grey-7 q-mt-md">Sin Detalles</div>
                  <div class="text-grey-6 q-mt-sm">Agrega detalles a este movimiento de inventario</div>
                </div>

                <div v-else class="q-pa-md">

                  <div v-for="(detail, index) in movementDetails" :key="index" class="q-mb-lg">
                    <q-card class="movement-detail-card" bordered>
                      <q-card-section class="bg-primary text-white">
                        <div class="row items-center justify-between">
                          <div class="text-subtitle1">Detalle #{{ index + 1 }}</div>
                          <q-btn flat round dense icon="delete" color="white" @click="removeMovementDetail(index)" />
                        </div>
                      </q-card-section>

                      <q-card-section>
                        <div class="row q-col-gutter-md">
                          <!-- Primera fila -->
                          <div class="col-12 col-md-6">
                            <q-select
                              v-model="detail.primary_product"
                              :options="primaryProducts"
                              label="Producto Primario"
                              outlined
                              emit-value
                              map-options
                              @update:model-value="loadProductColors($event, index)"
                            />
                          </div>

                          <div class="col-12 col-md-6" v-if="detail.availableColors.length">
                            <q-select
                              v-model="detail.product_color"
                              :options="detail.availableColors"
                              label="Color del Producto"
                              outlined
                              emit-value
                              map-options
                            />
                          </div>

                          <!-- Segunda fila -->
                          <div class="col-12 col-md-4" v-if="detail.availableColors.length">
                            <q-input
                              v-model.number="detail.quantity"
                              type="number"
                              label="Cantidad"
                              outlined
                              dense
                              min="1"
                            >
                            </q-input>
                          </div>

                          <div class="col-12 col-md-4" v-if="detail.availableColors.length">
                            <q-input
                              v-model.number="detail.unit_price"
                              type="number"
                              label="Precio Unitario"
                              outlined
                              dense
                              min="0"
                              step="0.01"
                            >
                              <template v-slot:prepend>
                                <q-icon name="attach_money" color="primary" />
                              </template>
                              <template v-slot:append>
                                <div class="text-caption">S/.</div>
                              </template>
                            </q-input>
                          </div>

                          <div class="col-12 col-md-4" v-if="detail.availableColors.length">
                            <div class="price-total-container">
                              <div class="text-subtitle2">Precio Total</div>
                              <div class="text-subtitle2 q-mt-none">
                                <span class="text-primary">S/.</span>
                                {{ detail.quantity && detail.unit_price ? (detail.quantity * detail.unit_price).toFixed(2) : '0.00' }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="q-mt-md">
                    <q-btn
                      color="primary"
                      icon="add"
                      label="Agregar Producto"
                      @click="addMovementDetail"
                    />
                  </div>
                </div>
              </div>

              <!-- Navigation -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn
                    @click="currentStep = 1"
                    color="primary"
                    class="q-px-xl q-py-sm"
                    rounded
                    outline
                    label="Atrás"
                  />
                </div>
                <div>
                  <q-btn
                    :disable="verifyDetails"
                    @click="nextStep"
                    color="primary"
                    rounded
                    class="bg-primary text-white q-px-xl q-py-sm"
                    label="Continuar"
                  />
                </div>
              </q-stepper-navigation>
            </div>

            <!-- Step 3: Summary -->
            <div v-if="currentStep === 3" class="full-height" style="display: flex; flex-direction: column;">
              <!-- Header -->
              <div class="header">
                <div class="text-h6">Resumen</div>
              </div>

              <!-- Content -->
              <div class="content flex-grow-1">
                <q-card class="q-mb-md" flat bordered>
                  <q-card-section>
                    <div class="text-h6">Información Básica</div>
                    <div class="row q-col-gutter-md q-mt-sm">
                      <div class="col-12 col-md-6">
                        <div class="text-subtitle2">Dirección de Movimiento:</div>
                        <div>{{ getDirectionLabel(movement.direction?.value) }}</div>
                      </div>
                      <div class="col-12 col-md-6">
                        <div class="text-subtitle2">Razón de Movimiento:</div>
                        <div>{{ getReasonTypeLabel(movement.reason_type?.value) }}</div>
                      </div>
                      <div class="col-12 col-md-6" v-if="movement.supplier">
                        <div class="text-subtitle2">Proveedor:</div>
                        <div>{{ getSupplierLabel(movement.supplier?.value) }}</div>
                      </div>
                      <div class="col-12 col-md-6" v-if="movement.client_name">
                        <div class="text-subtitle2">Cliente:</div>
                        <div>{{ movement.client_name }}</div>
                      </div>
                      <div class="col-12" v-if="movement.notes">
                        <div class="text-subtitle2">Notas:</div>
                        <div>{{ movement.notes }}</div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6">Detalles del Movimiento</div>
                    <q-table
                      :rows="movementDetails"
                      :columns="detailColumns"
                      row-key="index"
                      :pagination="{ rowsPerPage: 0 }"
                      flat
                      bordered
                      hide-bottom
                    >
                      <template v-slot:body="props">
                        <q-tr :props="props">
                          <q-td key="product" :props="props">{{ getProductDetails(props.row) }}</q-td>
                          <q-td key="quantity" :props="props">{{ props.row.quantity }}</q-td>
                          <q-td key="unit_price" :props="props">{{ formatCurrency(props.row.unit_price) }}</q-td>
                          <q-td key="total_price" :props="props">{{
                            formatCurrency(calculateTotalPrice(props.row))
                          }}</q-td>
                        </q-tr>
                      </template>
                    </q-table>

                    <div class="row justify-end q-mt-md">
                      <div class="text-h6">Total: {{ formatCurrency(calculateGrandTotal()) }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Navigation -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn
                    @click="currentStep = 2"
                    color="primary"
                    class="q-px-xl q-py-sm"
                    rounded
                    outline
                    label="Atrás"
                  />
                </div>
                <div>
                  <q-btn
                    :loading="isLoading"
                    @click="createMovement"
                    color="primary"
                    rounded
                    class="bg-primary text-white q-px-xl q-py-sm"
                    label="Registrar Movimiento"
                  >
                    <template v-slot:loading>
                      <q-spinner class="on-left" />
                    </template>
                  </q-btn>
                </div>
              </q-stepper-navigation>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import MethodsMixin from 'src/mixins/MethodsMixin.js'
import Title from 'components/elements/Title.vue'
import SelectInput from 'components/inputs/Select.vue'

export default {
  name: 'NewInventoryMovement',
  components: {
    Title,
    SelectInput
  },
  mixins: [MethodsMixin],
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    return { $q, router }
  },
  data() {
    return {
      currentStep: 1,
      steps: ['Información Básica', 'Detalles del Movimiento', 'Resumen y Confirmación'],
      isLoading: false,
      movement: {
        direction: null,
        reason_type: null,
        supplier: null,
        client_name: '',
        notes: ''
      },
      movementDetails: [],
      errors: {
        direction: '',
        reason_type: '',
        supplier: '',
        client_name: '',
        notes: ''
      },
      directionOptions: [
        { label: 'Entrada', value: 'input' },
        { label: 'Salida', value: 'output' }
      ],
      reasonTypes: [],
      suppliers: [],
      primaryProducts: [],
      // Columnas para la tabla de resumen
      detailColumns: [
        { name: 'product', label: 'Producto', field: 'product', align: 'left' },
        { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
        { name: 'unit_price', label: 'Precio Unitario', field: 'unit_price', align: 'right' },
        { name: 'total_price', label: 'Precio Total', field: 'total_price', align: 'right' }
      ]
    }
  },
  computed: {
    verifyFirstStep() {
      // Validar los campos requeridos
      const requiresClient =
        this.movement.direction?.value === 'output' && !this.movement.client_name

      return !this.movement.direction || !this.movement.reason_type || requiresClient
    },
    verifyDetails() {
      if (this.movementDetails.length === 0) return true

      return this.movementDetails.some(detail => {
        return (
          !detail.primary_product ||
          (detail.availableColors.length > 0 && !detail.product_color) ||
          !detail.quantity ||
          detail.quantity <= 0 ||
          detail.unit_price < 0
        )
      })
    },
    progressValue() {
      return (this.currentStep / this.steps.length) * 100
    }
  },
  methods: {
    getStepIcon(step) {
      const icons = { 1: 'info', 2: 'list_alt', 3: 'done_all' }
      return icons[step] || 'help'
    },
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++
      }
    },
    goTo(path) {
      this.router.push(path)
    },
    addMovementDetail() {
      this.movementDetails.push({
        primary_product: null,
        product_color: null,
        quantity: 1,
        unit_price: 0,
        availableColors: [],
        errors: {
          primary_product: '',
          product_color: '',
          quantity: '',
          unit_price: ''
        }
      })
    },
    removeMovementDetail(index) {
      this.movementDetails.splice(index, 1)
    },
    async loadProductColors(primaryProductId, index) {
      if (!primaryProductId) {
        this.movementDetails[index].availableColors = []
        this.movementDetails[index].product_color = null
        return
      }

      this.isLoading = true
      try {
        const response = await this.$store.dispatch('general/getProductColors', primaryProductId, {
          root: true
        })
        if (response.data?.data) {
          this.movementDetails[index].availableColors = response.data.data.map(color => ({
            label: color.color,
            value: color.id
          }))
          this.movementDetails[index].product_color = null
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar los colores del producto'
        })
      } finally {
        this.isLoading = false
      }
    },
    calculateTotalPrice(detail) {
      if (!detail || !detail.quantity || !detail.unit_price) return 0;
      return parseFloat(detail.quantity) * parseFloat(detail.unit_price);
    },

    calculateGrandTotal() {
      const total = this.movementDetails.reduce((total, detail) => {
        return total + this.calculateTotalPrice(detail);
      }, 0).toFixed(2);
      console.log('Grand Total:', total);
      return total;
    },
    getProductDetails(detail) {
      if (detail.primary_product) {
        const product = this.primaryProducts.find(p => p.value === detail.primary_product)
        let text = product ? `Primario: ${product.label}` : ''
        if (detail.product_color) {
          const color = detail.availableColors.find(c => c.value === detail.product_color)
          if (color) {
            text += ` (${color.label})`
          }
        }
        return text
      }
      return ''
    },
    getDirectionLabel(value) {
      const option = this.directionOptions.find(opt => opt.value === value)
      return option ? option.label : ''
    },
    getReasonTypeLabel(value) {
      const option = this.reasonTypes.find(opt => opt.value === value)
      return option ? option.label : ''
    },
    getSupplierLabel(value) {
      const option = this.suppliers.find(opt => opt.value === value)
      return option ? option.label : ''
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    },
    validateFirstStep() {
      this.errors = {
        direction: this.movement.direction ? '' : 'La dirección es requerida',
        reason_type: this.movement.reason_type ? '' : 'La razón es requerida',
        supplier: '',
        client_name:
          this.movement.direction?.value === 'output' && !this.movement.client_name
            ? 'El nombre del cliente es requerido para salidas'
            : '',
        notes: ''
      }
      return Object.values(this.errors).every(error => !error)
    },
    validateDetails() {
      this.movementDetails.forEach(detail => {
        detail.errors = {
          primary_product: detail.primary_product ? '' : 'El producto primario es requerido',
          product_color:
            detail.availableColors.length > 0 && !detail.product_color
              ? 'El color es requerido'
              : '',
          quantity: detail.quantity > 0 ? '' : 'La cantidad debe ser mayor a 0',
          unit_price: detail.unit_price >= 0 ? '' : 'El precio unitario no puede ser negativo'
        }
      })
      return this.movementDetails.every(detail => Object.values(detail.errors).every(error => !error))
    },
    async createMovement() {
      if (!this.validateFirstStep() || !this.validateDetails()) {
        this.$q.notify({
          type: 'negative',
          message: 'Por favor, corrige los errores en el formulario'
        })
        return
      }

      this.isLoading = true

      const payload = {
        direction: this.movement.direction.value === 'input' ? 'IN' : 'OUT',
        reason_type: this.movement.reason_type.value,
        notes: this.movement.notes || '',
        client_name: this.movement.client_name || '',
        total_price: parseFloat(this.calculateGrandTotal()),
        supplier: this.movement.supplier?.value || null,
        details: this.movementDetails.map(detail => ({
          primary_product: detail.primary_product,
          product_color: detail.product_color || null,
          quantity: detail.quantity,
          unit_price: detail.unit_price
        }))
      }

      try {
        const response = await this.$store.dispatch('movement/setMovement', payload, {
          root: true
        })
        if (response.data.status === 'OK') {
          this.$q.notify({
            type: 'positive',
            message: response.data.msg
          })
          this.router.push('/movements')
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: `Error: ${error.response?.data?.msg || 'No se pudo crear el movimiento'}`
        })
      } finally {
        this.isLoading = false
      }
    },
    async loadData() {
      this.isLoading = true
      try {
        // Cargar tipos de razón
        const reasonTypesResponse = await this.$store.dispatch('movement/getReasonTypes', {
          root: true
        })
        this.reasonTypes = reasonTypesResponse.data.data.map(item => ({
          label: item.name,
          value: item.id
        }))

        // Cargar proveedores
        const suppliersResponse = await this.$store.dispatch('provedores/getSupplier', {
          root: true
        })
        this.suppliers = suppliersResponse.data.data.map(item => ({
          label: item.company_name,
          value: item.id
        }))

        // Cargar productos primarios
        const primaryProductsResponse = await this.$store.dispatch(
          'general/getPrimaryProduct',
          { root: true }
        )
        this.primaryProducts = primaryProductsResponse.data.data.map(item => ({
          label: item.name,
          value: item.id
        }))
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar los datos iniciales'
        })
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.navigation {
  margin-top: 20px;
}

.steps-card {
  border-radius: 16px;
  background: #fafafa;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0);
}

.step-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.step-active {
  border-left: 3px solid var(--q-primary);
  background: #f0f7ff;
}

.step-completed {
  opacity: 0.8;
}

.step-pending {
  opacity: 0.6;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 12px;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: var(--q-primary);
}

.q-btn {
  text-transform: none;
}

:deep(.q-circular-progress__text) {
  font-weight: 600;
}
</style>
