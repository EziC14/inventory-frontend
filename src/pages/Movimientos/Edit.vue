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
                <div class="text-h6">Información Básica del Movimiento</div>
              </div>

              <!-- Contenido -->
              <div class="content flex-grow-1">
                <div class="q-mt-lg">
                  <div class="row q-col-gutter-x-md q-col-gutter-y-md">
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="movement.date"
                        label="Fecha"
                        outlined
                        dense
                        type="date"
                        class="q-mb-md"
                      >
                        <template v-slot:prepend>
                          <q-icon name="event" />
                        </template>
                      </q-input>

                      <q-select
                        v-model="movement.direction"
                        :options="directionOptions"
                        label="Dirección"
                        outlined
                        dense
                        map-options
                        emit-value
                        class="q-mb-md"
                      >
                        <template v-slot:prepend>
                          <q-icon name="swap_horiz" />
                        </template>
                      </q-select>
                    </div>

                    <div class="col-12 col-md-6">
                      <q-select
                        v-model="movement.reason_type"
                        :options="reasonTypes"
                        label="Tipo de Razón"
                        outlined
                        dense
                        option-value="id"
                        option-label="name"
                        map-options
                        emit-value
                        class="q-mb-md"
                      >
                        <template v-slot:prepend>
                          <q-icon name="category" />
                        </template>
                      </q-select>

                      <q-select
                        v-model="movement.supplier"
                        :options="suppliers"
                        label="Proveedor"
                        outlined
                        dense
                        option-value="id"
                        option-label="name"
                        map-options
                        emit-value
                        class="q-mb-md"
                      >
                        <template v-slot:prepend>
                          <q-icon name="business" />
                        </template>
                      </q-select>
                    </div>

                    <div class="col-12">
                      <q-input
                        v-model="movement.notes"
                        label="Notas"
                        outlined
                        type="textarea"
                        :rows="3"
                        class="q-mb-md"
                      >
                        <template v-slot:prepend>
                          <q-icon name="description" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navegación -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn @click="goTo('/inventory')" color="primary" class="q-px-xl q-py-sm" rounded outline label="Cancelar" />
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
                <div class="q-mb-md row justify-between items-center">
                  <div class="text-subtitle1 text-weight-medium">Productos</div>
                  <q-btn
                    color="primary"
                    icon="add"
                    label="Agregar Producto"
                    flat
                    round
                    @click="addDetail"
                  />
                </div>

                <div v-for="(detail, index) in movement.details" :key="index" class="q-mb-lg">
                  <q-card flat bordered class="q-pa-md" style="border-radius: 12px;">
                    <div class="row justify-between items-center q-mb-md">
                      <div class="text-subtitle2">Producto {{ index + 1 }}</div>
                      <q-btn
                        v-if="movement.details.length > 1"
                        icon="delete"
                        color="negative"
                        flat
                        round
                        dense
                        @click="removeDetail(index)"
                      />
                    </div>

                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-select
                          v-model="detail.product_type"
                          :options="productTypeOptions"
                          label="Tipo de Producto"
                          outlined
                          dense
                          class="q-mb-md"
                        >
                          <template v-slot:prepend>
                            <q-icon name="inventory_2" />
                          </template>
                        </q-select>

                        <!-- Producto Primario -->
                        <q-select
                          v-if="detail.product_type === 'primary'"
                          v-model="detail.primary_product"
                          :options="primaryProducts"
                          label="Producto Primario"
                          outlined
                          dense
                          option-value="id"
                          option-label="name"
                          map-options
                          emit-value
                          class="q-mb-md"
                        >
                          <template v-slot:prepend>
                            <q-icon name="category" />
                          </template>
                        </q-select>

                        <!-- Producto Final -->
                        <q-select
                          v-if="detail.product_type === 'final'"
                          v-model="detail.final_product"
                          :options="finalProducts"
                          label="Producto Final"
                          outlined
                          dense
                          option-value="id"
                          option-label="name"
                          map-options
                          emit-value
                          class="q-mb-md"
                        >
                          <template v-slot:prepend>
                            <q-icon name="inventory" />
                          </template>
                        </q-select>

                        <!-- Color del Producto (solo para productos finales) -->
                        <q-select
                          v-if="detail.product_type === 'final'"
                          v-model="detail.product_color"
                          :options="productColors"
                          label="Color del Producto"
                          outlined
                          dense
                          option-value="id"
                          option-label="name"
                          map-options
                          emit-value
                          class="q-mb-md"
                        >
                          <template v-slot:prepend>
                            <q-icon name="palette" />
                          </template>
                        </q-select>
                      </div>

                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="detail.quantity"
                          type="number"
                          label="Cantidad"
                          outlined
                          dense
                          class="q-mb-md"
                        >
                          <template v-slot:prepend>
                            <q-icon name="shopping_cart" />
                          </template>
                        </q-input>

                        <q-input
                          v-model="detail.unit_price"
                          type="number"
                          label="Precio Unitario"
                          outlined
                          dense
                          class="q-mb-md"
                        >
                          <template v-slot:prepend>
                            <q-icon name="attach_money" />
                          </template>
                        </q-input>

                        <div class="text-subtitle2 q-mt-md">
                          Total: {{ calculateTotal(detail) }}
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>

                <div v-if="movement.details.length === 0" class="text-center q-pa-xl">
                  <q-icon name="inventory_2" size="64px" color="grey-5" />
                  <div class="text-h6 text-grey-6 q-mt-md">No hay productos agregados</div>
                  <q-btn
                    color="primary"
                    icon="add"
                    label="Agregar Producto"
                    flat
                    @click="addDetail"
                    class="q-mt-md"
                  />
                </div>
              </div>

              <!-- Navegación -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn @click="currentStep = 1" color="primary" class="q-px-xl q-py-sm" rounded outline label="Atrás" />
                </div>
                <div>
                  <q-btn
                    :disable="verifyDetailsStep"
                    @click="nextStep"
                    class="bg-primary text-white q-px-xl q-py-sm"
                    rounded
                    flat
                    label="Continuar"
                  />
                </div>
              </q-stepper-navigation>
            </div>

            <!-- Step 3: Summary -->
            <div v-if="currentStep === 3" class="full-height" style="display: flex; flex-direction: column;">
              <!-- Header -->
              <div class="header">
                <div class="text-h6">Resumen del Movimiento</div>
              </div>

              <!-- Contenido -->
              <div class="content flex-grow-1">
                <div class="q-pa-md">
                  <q-card flat bordered class="q-mb-lg" style="border-radius: 16px;">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Información General</div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                          <div class="text-subtitle2 text-grey-8">Fecha</div>
                          <div class="q-mb-md">{{ formatDate(movement.date) || 'No especificado' }}</div>

                          <div class="text-subtitle2 text-grey-8">Dirección</div>
                          <div class="q-mb-md">{{ getDirectionDisplay(movement.direction) || 'No especificado' }}</div>
                        </div>

                        <div class="col-12 col-md-6">
                          <div class="text-subtitle2 text-grey-8">Tipo de Razón</div>
                          <div class="q-mb-md">{{ getReasonTypeName(movement.reason_type) || 'No especificado' }}</div>

                          <div class="text-subtitle2 text-grey-8">Proveedor</div>
                          <div class="q-mb-md">{{ getSupplierName(movement.supplier) || 'No especificado' }}</div>
                        </div>

                        <div class="col-12">
                          <div class="text-subtitle2 text-grey-8">Notas</div>
                          <div>{{ movement.notes || 'No especificado' }}</div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-card flat bordered class="q-mb-lg" style="border-radius: 16px;">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Detalles del Movimiento</div>
                      <div v-if="movement.details.length === 0" class="text-center q-pa-md">
                        <q-icon name="inventory_2" size="48px" color="grey-5" />
                        <div class="text-grey-6 q-mt-sm">No se han agregado productos</div>
                      </div>
                      <div v-else>
                        <q-table
                          :rows="formattedDetails"
                          :columns="detailsColumns"
                          row-key="index"
                          dense
                          hide-pagination
                          flat
                          bordered
                          class="rounded-borders"
                        />
                        <div class="text-right q-mt-md text-h6">
                          Total: {{ calculateGrandTotal() }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <!-- Navegación -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn
                    :disable="isLoading"
                    type="button"
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
                    type="submit"
                    @click="onSubmit"
                    class="bg-primary text-white q-px-xl q-py-sm"
                    rounded
                    flat
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
import { ref, computed } from 'vue'
import MethodsMixin from "src/mixins/MethodsMixin.js";
import Title from 'components/elements/Title.vue'
import { date } from 'quasar'

export default {
  components: {
    Title
  },
  mixins: [MethodsMixin],
  data() {
    return {
      currentStep: 1,
      steps: ['Información Básica', 'Detalles del Movimiento', 'Resumen y Confirmación'],
      isLoading: false,
      movement: {
        date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        direction: 'in',
        reason_type: null,
        supplier: null,
        notes: '',
        details: []
      },
      reasonTypes: [],
      suppliers: [],
      primaryProducts: [],
      finalProducts: [],
      productColors: [],
      directionOptions: [
        { label: 'Entrada', value: 'in' },
        { label: 'Salida', value: 'out' }
      ],
      productTypeOptions: [
        { label: 'Producto Primario', value: 'primary' },
        { label: 'Producto Final', value: 'final' }
      ],
      detailsColumns: [
        { name: 'product_type', align: 'left', label: 'Tipo', field: 'product_type' },
        { name: 'product_name', align: 'left', label: 'Producto', field: 'product_name' },
        { name: 'color', align: 'left', label: 'Color', field: 'color' },
        { name: 'quantity', align: 'right', label: 'Cantidad', field: 'quantity' },
        { name: 'unit_price', align: 'right', label: 'Precio', field: 'unit_price' },
        { name: 'total', align: 'right', label: 'Total', field: 'total' }
      ]
    }
  },
  computed: {
    progressValue() {
      return (this.currentStep / this.steps.length) * 100;
    },
    verifyFirstStep() {
      return !this.movement.date || !this.movement.direction;
    },
    verifyDetailsStep() {
      if (this.movement.details.length === 0) return true;

      return this.movement.details.some(detail => {
        if (detail.product_type === 'primary') {
          return !detail.primary_product || !detail.quantity || !detail.unit_price;
        } else if (detail.product_type === 'final') {
          return !detail.final_product || !detail.quantity || !detail.unit_price;
        }
        return true;
      });
    },
    formattedDetails() {
      return this.movement.details.map((detail, index) => {
        const productName = detail.product_type === 'primary'
          ? this.getPrimaryProductName(detail.primary_product)
          : this.getFinalProductName(detail.final_product);

        const color = detail.product_type === 'final'
          ? this.getColorName(detail.product_color)
          : '-';

        return {
          index,
          product_type: detail.product_type === 'primary' ? 'Primario' : 'Final',
          product_name: productName,
          color,
          quantity: detail.quantity,
          unit_price: `$${parseFloat(detail.unit_price).toFixed(2)}`,
          total: `$${this.calculateTotal(detail, true)}`
        };
      });
    }
  },
  methods: {
    getStepIcon(step) {
      const icons = { 1: 'assignment', 2: 'inventory_2', 3: 'summarize' };
      return icons[step];
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      return date.formatDate(dateStr, 'DD/MM/YYYY');
    },
    getDirectionDisplay(direction) {
      const option = this.directionOptions.find(opt => opt.value === direction);
      return option ? option.label : '';
    },
    getReasonTypeName(id) {
      const reason = this.reasonTypes.find(r => r.id === id);
      return reason ? reason.name : '';
    },
    getSupplierName(id) {
      const supplier = this.suppliers.find(s => s.id === id);
      return supplier ? supplier.name : '';
    },
    getPrimaryProductName(id) {
      const product = this.primaryProducts.find(p => p.id === id);
      return product ? product.name : '';
    },
    getFinalProductName(id) {
      const product = this.finalProducts.find(p => p.id === id);
      return product ? product.name : '';
    },
    getColorName(id) {
      const color = this.productColors.find(c => c.id === id);
      return color ? color.name : '';
    },
    calculateTotal(detail, rawValue = false) {
      const quantity = parseFloat(detail.quantity) || 0;
      const price = parseFloat(detail.unit_price) || 0;
      const total = quantity * price;
      return rawValue ? total.toFixed(2) : `$${total.toFixed(2)}`;
    },
    calculateGrandTotal() {
      const total = this.movement.details.reduce((acc, detail) => {
        const quantity = parseFloat(detail.quantity) || 0;
        const price = parseFloat(detail.unit_price) || 0;
        return acc + (quantity * price);
      }, 0);
      return `$${total.toFixed(2)}`;
    },
    addDetail() {
      this.movement.details.push({
        product_type: 'primary',
        primary_product: null,
        final_product: null,
        product_color: null,
        quantity: '',
        unit_price: ''
      });
    },
    removeDetail(index) {
      this.movement.details.splice(index, 1);
    },
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      }
    },
    loadData() {
      this.isLoading = true;

      // Cargar tipos de razón
      this.$store.dispatch("general/getReasonTypes", { root: true })
        .then((response) => {
          this.reasonTypes = response.data.data;
        })
        .catch((error) => {
          this.alertError("Error al cargar los tipos de razón");
        });

      // Cargar proveedores
      this.$store.dispatch("provedores/getSuppliers", { root: true })
        .then((response) => {
          this.suppliers = response.data.data;
        })
        .catch((error) => {
          this.alertError("Error al cargar los proveedores");
        });

      // Cargar productos primarios
      this.$store.dispatch("general/getPrimaryProduct", { root: true })
        .then((response) => {
          this.primaryProducts = response.data.data;
        })
        .catch((error) => {
          this.alertError("Error al cargar los productos primarios");
        });

      // Cargar productos finales
      this.$store.dispatch("general/getFinalProduct", { root: true })
        .then((response) => {
          this.finalProducts = response.data.data;
        })
        .catch((error) => {
          this.alertError("Error al cargar los productos finales");
        });

      // Cargar colores de productos
      this.$store.dispatch("general/getProductColors", { root: true })
        .then((response) => {
          this.productColors = response.data.data;
        })
        .catch((error) => {
          this.alertError("Error al cargar los colores de productos");
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    preparePayload() {
      const formattedDetails = this.movement.details.map(detail => {
        const payload = {
          quantity: parseFloat(detail.quantity),
          unit_price: parseFloat(detail.unit_price)
        };

        if (detail.product_type === 'primary') {
          payload.primary_product = detail.primary_product;
        } else if (detail.product_type === 'final') {
          payload.final_product = detail.final_product;
          if (detail.product_color) {
            payload.product_color = detail.product_color;
          }
        }

        return payload;
      });

      return {
        date: this.movement.date,
        direction: this.movement.direction,
        reason_type: this.movement.reason_type,
        supplier: this.movement.supplier,
        notes: this.movement.notes,
        details: formattedDetails
      };
    },
    onSubmit() {
      this.isLoading = true;
      const payload = this.preparePayload();

      this.$store.dispatch("inventory/createMovement", payload, { root: true })
        .then((response) => {
          if (response.data.status === "OK") {
            this.alertSuccess(response.data.msg || "Movimiento registrado con éxito");
            this.goTo('/inventory');
          }
        })
        .catch((error) => {
          this.alertError(error.response?.data?.msg || "Error al registrar el movimiento");
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.loadData();
    this.addDetail(); // Agregar un detalle por defecto
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
