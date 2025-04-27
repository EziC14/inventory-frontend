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
                  <q-item-label class="text-subtitle1" :class="{
                    'text-weight-bold': currentStep === index + 1,
                    'text-grey': currentStep < index + 1
                  }">
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
          <q-card class="custom-card" style="border-radius: 20px; box-shadow: none; padding: 40px; height: calc(100vh - 200px); min-height: 600px; display: flex; flex-direction: column;">

            <!-- Step 1: Basic Information -->
            <div v-if="currentStep === 1" class="full-height" style="display: flex; flex-direction: column;">
              <!-- Header -->
              <div class="header">
                <div class="text-h6">Información Básica</div>
              </div>

              <!-- Contenido -->
              <div class="content flex-grow-1">
                <div class="q-mt-lg">
                  <div class="row q-col-gutter-x-md">
                    <div class="col-12 col-md-6 q-mb-xs">
                      <q-input
                        v-model="movement.date"
                        outlined
                        type="date"
                        label="Fecha"
                        :rules="[val => !!val || 'La fecha es requerida']"
                      />
                    </div>

                    <SelectInput
                      :text="movement.direction"
                      @change-name="(e) => (movement.direction = e)"
                      class="col-12 col-md-6 q-mb-xs"
                      :options="directionOptions"
                      icon="swap_horiz"
                      :isRequired="true"
                      labelBody="Tipo de Movimiento"
                      iconPosition="prepend"
                    />

                    <SelectInput
                      :text="movement.reason_type"
                      @change-name="(e) => (movement.reason_type = e)"
                      class="col-12 col-md-6 q-mb-xs"
                      :options="reasonTypes"
                      icon="category"
                      :isRequired="true"
                      labelBody="Tipo de Razón"
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

              <!-- Navegación -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn @click="goTo('/movements')" color="primary" class="q-px-xl q-py-sm" rounded outline label="Cancelar" />
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

              <!-- Contenido -->
              <div class="content flex-grow-1">
                <div class="row q-mb-md items-center justify-between">
                  <q-btn
                    @click="addMovementDetail"
                    color="primary"
                    icon="add"
                    label="Agregar Detalle"
                    unelevated
                  />
                </div>

                <div v-if="!movementDetails.length" class="empty-state q-pa-xl text-center">
                  <q-icon name="inventory" size="4rem" color="grey-4" />
                  <div class="text-h6 text-grey-7 q-mt-md">Sin Detalles</div>
                  <div class="text-grey-6 q-mt-sm">Agrega detalles a este movimiento de inventario</div>
                </div>

                <div v-else class="row q-col-gutter-md">
                  <div v-for="(detail, index) in movementDetails" :key="index" class="col-12">
                    <q-card class="q-mb-md" flat bordered>
                      <q-card-section>
                        <div class="row q-col-gutter-md">
                          <div class="col-12 col-md-6">
                            <q-select
                              v-model="detail.product_type"
                              :options="productTypeOptions"
                              label="Tipo de Producto"
                              outlined
                              emit-value
                              map-options
                              @update:model-value="resetProductSelection(index)"
                            />
                          </div>

                          <div class="col-12 col-md-6" v-if="detail.product_type === 'primary'">
                            <q-select
                              v-model="detail.primary_product"
                              :options="primaryProducts"
                              label="Producto Primario"
                              outlined
                              emit-value
                              map-options
                            />
                          </div>

                          <div class="col-12 col-md-6" v-if="detail.product_type === 'final'">
                            <q-select
                              v-model="detail.final_product"
                              :options="finalProducts"
                              label="Producto Final"
                              outlined
                              emit-value
                              map-options
                              @update:model-value="loadProductColors(detail.final_product, index)"
                            />
                          </div>

                          <div class="col-12 col-md-6" v-if="detail.product_type === 'final' && detail.final_product && detail.availableColors.length">
                            <q-select
                              v-model="detail.product_color"
                              :options="detail.availableColors"
                              label="Color del Producto"
                              outlined
                              emit-value
                              map-options
                            />
                          </div>

                          <div class="col-12 col-md-4">
                            <q-input
                              v-model.number="detail.quantity"
                              type="number"
                              label="Cantidad"
                              outlined
                              min="1"
                            />
                          </div>

                          <div class="col-12 col-md-4">
                            <q-input
                              v-model.number="detail.unit_price"
                              type="number"
                              label="Precio Unitario"
                              outlined
                              min="0"
                              step="0.01"
                            />
                          </div>

                          <div class="col-12 col-md-4">
                            <q-input
                              v-model="detail.totalPrice"
                              label="Precio Total"
                              outlined
                              readonly
                              :value="calculateTotalPrice(detail)"
                            />
                          </div>
                        </div>
                      </q-card-section>

                      <q-card-actions align="right">
                        <q-btn
                          flat
                          icon="delete"
                          color="negative"
                          @click="removeMovementDetail(index)"
                          label="Eliminar"
                        />
                      </q-card-actions>
                    </q-card>
                  </div>
                </div>
              </div>

              <!-- Navegación -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn @click="currentStep = 1" color="primary" class="q-px-xl q-py-sm" rounded outline label="Atrás" />
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

              <!-- Contenido -->
              <div class="content flex-grow-1">
                <q-card class="q-mb-md" flat bordered>
                  <q-card-section>
                    <div class="text-h6">Información Básica</div>
                    <div class="row q-col-gutter-md q-mt-sm">
                      <div class="col-12 col-md-6">
                        <div class="text-subtitle2">Fecha:</div>
                        <div>{{ formatDate(movement.date) }}</div>
                      </div>
                      <div class="col-12 col-md-6">
                        <div class="text-subtitle2">Tipo de Movimiento":</div>
                        <div>{{ getDirectionLabel(movement.direction.value) }}</div>
                      </div>
                      <div class="col-12 col-md-6">
                        <div class="text-subtitle2">Tipo de Razón:</div>
                        <div>{{ getReasonTypeLabel(movement.reason_type.value) }}</div>
                      </div>
                      <div class="col-12 col-md-6" v-if="movement.supplier">
                        <div class="text-subtitle2">Proveedor:</div>
                        <div>{{ getSupplierLabel(movement.supplier.value) }}</div>
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
                          <q-td key="total_price" :props="props">{{ formatCurrency(calculateTotalPrice(props.row)) }}</q-td>
                        </q-tr>
                      </template>
                    </q-table>

                    <div class="row justify-end q-mt-md">
                      <div class="text-h6">Total: {{ formatCurrency(calculateGrandTotal()) }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Navegación -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn @click="currentStep = 2" color="primary" class="q-px-xl q-py-sm" rounded outline label="Atrás" />
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
                    <template v-slot:loading> <q-spinner class="on-left" /> </template>
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
import { ref } from 'vue'
import MethodsMixin from "src/mixins/MethodsMixin.js";
import Title from 'components/elements/Title.vue'
import SimpleInput from 'components/inputs/Simple.vue'
import SelectInput from 'components/inputs/Select.vue'

export default {
  components: {
    Title,
    SelectInput
  },
  mixins: [MethodsMixin],
  data() {
    return {
      currentStep: 1,
      steps: ['Información Básica', 'Detalles del Movimiento', 'Resumen y Confirmación'],
      isLoading: false,

      movement: {
        date: new Date().toISOString().substr(0, 10),
        direction: null,
        reason_type: null,
        supplier: null,
        notes: ''
      },

      movementDetails: [],

      // Opciones para los selectores
      directionOptions: [
        { label: 'Entrada', value: 'IN' },
        { label: 'Salida', value: 'OUT' }
      ],
      productTypeOptions: [
        { label: 'Producto Primario', value: 'primary' },
        { label: 'Producto Final', value: 'final' }
      ],
      reasonTypes: [],
      suppliers: [],
      primaryProducts: [],
      finalProducts: [],

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
      return !this.movement.date || !this.movement.direction || !this.movement.reason_type;
    },
    verifyDetails() {
      if (this.movementDetails.length === 0) return true;

      return this.movementDetails.some(detail => {
        if (detail.product_type === 'primary' && !detail.primary_product) return true;
        if (detail.product_type === 'final' && !detail.final_product) return true;
        if (detail.product_type === 'final' && detail.availableColors && detail.availableColors.length > 0 && !detail.product_color) return true;
        if (!detail.quantity || detail.quantity <= 0) return true;
        if (!detail.unit_price || detail.unit_price < 0) return true;
        return false;
      });
    },
    progressValue() {
      return (this.currentStep / this.steps.length) * 100;
    }
  },
  methods: {
    getStepIcon(step) {
      const icons = { 1: 'info', 2: 'list_alt', 3: 'done_all' };
      return icons[step] || 'help';
    },

    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      }
    },

    addMovementDetail() {
      this.movementDetails.push({
        product_type: null,
        primary_product: null,
        final_product: null,
        product_color: null,
        quantity: 1,
        unit_price: 0,
        availableColors: []
      });
    },

    removeMovementDetail(index) {
      this.movementDetails.splice(index, 1);
    },

    resetProductSelection(index) {
      const detail = this.movementDetails[index];
      detail.primary_product = null;
      detail.final_product = null;
      detail.product_color = null;
      detail.availableColors = [];
    },

    loadProductColors(finalProductId, index) {
      if (!finalProductId) return;

      this.isLoading = true;
      // Aquí deberías cargar los colores disponibles para el producto final seleccionado
      // Ejemplo:
      this.$store.dispatch("general/getProductColors", finalProductId, { root: true })
        .then(response => {
          if (response.data && response.data.data) {
            const colors = response.data.data.map(color => ({
              label: color.name_color,
              value: color.id
            }));
            this.movementDetails[index].availableColors = colors;
            // Resetear el color seleccionado
            this.movementDetails[index].product_color = null;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    calculateTotalPrice(detail) {
      if (!detail.quantity || !detail.unit_price) return 0;
      return detail.quantity * detail.unit_price;
    },

    calculateGrandTotal() {
      return this.movementDetails.reduce((total, detail) => {
        return total + this.calculateTotalPrice(detail);
      }, 0);
    },

    getProductDetails(detail) {
      if (detail.product_type === 'primary' && detail.primary_product) {
        const product = this.primaryProducts.find(p => p.value === detail.primary_product);
        return product ? `Primario: ${product.label}` : '';
      } else if (detail.product_type === 'final' && detail.final_product) {
        const product = this.finalProducts.find(p => p.value === detail.final_product);
        let text = product ? `Final: ${product.label}` : '';

        if (detail.product_color) {
          const color = detail.availableColors.find(c => c.value === detail.product_color);
          if (color) {
            text += ` (${color.label})`;
          }
        }

        return text;
      }
      return '';
    },

    getDirectionLabel(value) {
      const option = this.directionOptions.find(opt => opt.value === value);
      return option ? option.label : '';
    },

    getReasonTypeLabel(value) {
      const option = this.reasonTypes.find(opt => opt.value === value);
      return option ? option.label : '';
    },

    getSupplierLabel(value) {
      const option = this.suppliers.find(opt => opt.value === value);
      return option ? option.label : '';
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString();
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    },

    createMovement() {
      this.isLoading = true;

      // Preparar los datos para el API
      const payload = {
        date: this.movement.date,
        direction: this.movement.direction,
        reason_type: this.movement.reason_type,
        supplier: this.movement.supplier,
        notes: this.movement.notes,
        details: this.movementDetails.map(detail => {
          const detailPayload = {
            quantity: detail.quantity,
            unit_price: detail.unit_price
          };

          if (detail.product_type === 'primary' && detail.primary_product) {
            detailPayload.primary_product = detail.primary_product;
          } else if (detail.product_type === 'final' && detail.final_product) {
            detailPayload.final_product = detail.final_product;

            if (detail.product_color) {
              detailPayload.product_color = detail.product_color;
            }
          }

          return detailPayload;
        })
      };
      return payload;
      // Enviar la solicitud al servidor
      this.$store.dispatch("inventory/createMovement", payload, { root: true })
        .then(response => {
          if (response.data.status === "OK") {
            this.alertSuccess(response.data.msg);
            this.$router.push('/movements');
          }
        })
        .catch(error => {
          this.alertError(`Error: ${error.response?.data?.msg || 'No se pudo crear el movimiento'}`);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    loadData() {
      this.isLoading = true;

      // Cargar tipos de razón
      this.$store.dispatch("movement/getReasonTypes", { root: true })
        .then(response => {
          if (response.data && response.data.data) {
            this.reasonTypes = response.data.data.map(item => ({
              label: item.name,
              value: item.id
            }));
          }
        });

      // Cargar proveedores
      this.$store.dispatch("provedores/getSupplier", { root: true })
        .then(response => {
          if (response.data && response.data.data) {
            this.suppliers = response.data.data.map(item => ({
              label: item.company_name,
              value: item.id
            }));
          }
        });

      // Cargar productos primarios
      this.$store.dispatch("general/getPrimaryProduct", { root: true })
        .then(response => {
          if (response.data && response.data.data) {
            this.primaryProducts = response.data.data.map(item => ({
              label: item.name,
              value: item.id
            }));
          }
        });

      // Cargar productos finales
      this.$store.dispatch("general/getFinalProduct", { root: true })
        .then(response => {
          if (response.data && response.data.data) {
            this.finalProducts = response.data.data.map(item => ({
              label: item.name,
              value: item.id
            }));
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.loadData();
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;
}

.content {
  flex: 1;
  overflow-y: auto; /* Para permitir el desplazamiento si el contenido es muy largo */
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

/* Para los inputs */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 12px;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: var(--q-primary);
}

/* Para los botones */
.q-btn {
  text-transform: none;
}

/* Para el progress */
:deep(.q-circular-progress__text) {
  font-weight: 600;
}
</style>
