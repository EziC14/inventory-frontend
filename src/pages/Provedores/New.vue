<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-md q-pt-lg" style="padding: 30px 70px;">
      <!-- Header Section -->
      <div class="row items-center justify-between q-mb-lg">
        <div class="text-h5 text-weight-bold text-primary">
          <Title name="Nuevo Proveedor" />
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
                <div class="text-h6">Información Básica del Proveedor</div>
              </div>

              <!-- Contenido -->
              <div class="content flex-grow-1">
                <div class="q-mt-lg">
                  <div class="row q-col-gutter-x-md q-col-gutter-y-md">
                    <SimpleInput
                      v-for="(field, i) in basicFields"
                      :key="i"
                      :text="supplier[field.key]"
                      @change-name="(e) => (supplier[field.key] = e)"
                      class="col-12 col-md-6 q-mb-xs"
                      :icon="field.icon"
                      :isRequired="field.required"
                      :labelBody="field.label"
                      :iconPosition="field.iconPosition"
                    />
                  </div>
                </div>
              </div>

              <!-- Navegación -->
              <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
                <div>
                  <q-btn @click="goTo('/provider')" color="primary" class="q-px-xl q-py-sm" rounded outline label="Cancelar" />
                </div>
                <div>
                  <q-btn
                    :loading="isLoading"
                    :disable="verifyFirstStep"
                    @click="nextStep"
                    color="primary"
                    rounded
                    class="bg-primary text-white q-px-xl q-py-sm"
                    label="Continuar"
                  >
                    <template v-slot:loading> <q-spinner class="on-left" /> </template>
                  </q-btn>
                </div>
              </q-stepper-navigation>
            </div>

            <!-- Step 2: Products Offered -->
            <div v-if="currentStep === 2" class="full-height" style="display: flex; flex-direction: column;">
              <!-- Header -->
              <div class="header">
                <div class="text-h6">Productos Ofrecidos</div>
              </div>

              <!-- Contenido -->
              <div class="content flex-grow-1">
                <div>Selecciona los productos primarios que ofrece este proveedor:</div>
                <div class="row">
                  <div class="col-12 col-md-5">
                    <div class="row justify-between items-center q-mt-md">
                      <div class="fw-700 fs-18 color-primary">Productos Disponibles</div>
                      <FindInput
                        :modelQuery="filters.productsFirst"
                        :baseArr="availableProducts"
                        nameArrCopy="productsFirst"
                        @findByQuery="searchData"
                        @update:model-query="(e) => (filters.productsFirst = e)"
                      />
                    </div>
                    <EmptyState
                      v-if="!availableProducts?.length || (!arrFilters.productsFirst?.length && filters.productsFirst)"
                      class="q-mt-md"
                      info="No hay productos disponibles, intenta con otro nombre"
                    />
                    <ProductList v-else :arrData="availableProducts" :arrFilter="arrFilters.productsFirst" />
                  </div>
                  <div class="col-12 col-md-2 column items-center justify-center">
                    <TransferControls
                      @sendAll="sendAll"
                      @sendSelect="sendSelect"
                      @quitSelect="quitSelect"
                      @quitAll="quitAll"
                      :verifyFirstList="verifyProductsSelectedFirst"
                      :verifySecondList="verifyProductsSelectedSecond"
                      arrName="availableProducts"
                      arrNameSelected="selectedProducts"
                      arrNameFilterFirst="productsFirst"
                      arrNameFilterSecond="productsSecond"
                    />
                  </div>
                  <div v-if="!selectedProducts.length" class="col-12 col-md-5 column items-center q-col-gutter-lg">
                    <q-img src="~assets/images/no_data.svg" :style="{ width: $q.screen.lt.md ? '150px' : '200px' }" />
                    <div class="text-center">
                      <div class="fw-700 fs-18 color-primary">Sin agregar</div>
                      <div class="fs-15 q-px-lg text-center">Aún no has agregado ningún producto</div>
                    </div>
                  </div>
                  <div v-else class="col-12 col-md-5">
                    <div class="row justify-between items-center">
                      <div class="fw-700 fs-18 color-primary">Productos seleccionados</div>
                      <FindInput
                        :modelQuery="filters.productsSecond"
                        :baseArr="selectedProducts"
                        nameArrCopy="productsSecond"
                        @findByQuery="searchData"
                        @update:model-query="(e) => (filters.productsSecond = e)"
                      />
                    </div>
                    <EmptyState
                      v-if="!selectedProducts?.length || (!arrFilters.productsSecond.length && filters.productsSecond)"
                      class="q-mt-md row justify-center"
                      info="No se encontraron resultados según tu búsqueda"
                    />
                    <ProductList
                      v-else
                      :arrData="selectedProducts"
                      :arrFilter="arrFilters.productsSecond"
                      :viewPrice="true"
                      @update:price="handlePriceUpdate"
                    />
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
                <div class="text-h6">Resumen del Proveedor</div>
              </div>

              <!-- Contenido -->
              <div class="content flex-grow-1">
                <div class="q-pa-md">
                  <q-card flat bordered class="q-mb-lg" style="border-radius: 16px;">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Información General</div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                          <div class="text-subtitle2 text-grey-8">Nombre de la Empresa</div>
                          <div class="q-mb-md">{{ supplier.company_name || 'No especificado' }}</div>

                          <div class="text-subtitle2 text-grey-8">Nombre de Contacto</div>
                          <div class="q-mb-md">{{ supplier.contact_name || 'No especificado' }}</div>

                          <div class="text-subtitle2 text-grey-8">RUC</div>
                          <div class="q-mb-md">{{ supplier.ruc || 'No especificado' }}</div>

                        </div>

                        <div class="col-12 col-md-6">
                          <div class="text-subtitle2 text-grey-8">Teléfono</div>
                          <div class="q-mb-md">{{ supplier.phone || 'No especificado' }}</div>

                          <div class="text-subtitle2 text-grey-8">Correo Electrónico</div>
                          <div class="q-mb-md">{{ supplier.email || 'No especificado' }}</div>

                          <div class="text-subtitle2 text-grey-8">Dirección</div>
                          <div class="q-mb-md">{{ supplier.address || 'No especificado' }}</div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-card flat bordered class="q-mb-lg" style="border-radius: 16px;">
                    <q-card-section>
                      <div class="text-h6 q-mb-md">Productos Ofrecidos</div>
                      <div v-if="selectedProducts.length === 0" class="text-center q-pa-md">
                        <q-icon name="inventory_2" size="48px" color="grey-5" />
                        <div class="text-grey-6 q-mt-sm">No se han seleccionado productos</div>
                      </div>
                      <div v-else>
                        <q-table
                          :rows="selectedProducts"
                          :columns="productsColumns"
                          row-key="id"
                          hide-pagination
                          flat
                          bordered
                          class="rounded-borders"
                        />
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
                    @click="onCreate"
                    class="bg-primary text-white q-px-xl q-py-sm"
                    rounded
                    flat
                    label="Registrar Proveedor"
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
import FindInput from 'components/inputs/Find.vue'
import EmptyState from 'components/EmptyState.vue'
import ProductList from 'src/components/product/ProductList.vue'
import TransferControls from 'components/product/TransferControls.vue'

export default {
  components: {
    Title,
    SimpleInput,
    FindInput,
    EmptyState,
    ProductList,
    TransferControls
  },
  mixins: [MethodsMixin],
  data() {
    return {
      currentStep: 1,
      steps: ['Información Básica', 'Productos Ofrecidos', 'Resumen y Confirmación'],
      isLoading: false,
      supplier: {
        contact_name: '',
        company_name: '',
        phone: '',
        email: '',
        address: ''
      },
      availableProducts: [],
      selectedProducts: [],
      filters: {
        productsFirst: "",
        productsSecond: "",
      },
      arrFilters: {
        productsFirst: [],
        productsSecond: [],
      },
      basicFields: [
        { key: 'company_name', label: 'Nombre de la Empresa', icon: 'apartment', required: false, iconPosition: 'prepend' },
        { key: 'ruc', label: 'RUC', icon: 'business', required: false, iconPosition: 'prepend' },
        { key: 'contact_name', label: 'Nombre de Contacto', icon: 'person', required: false, iconPosition: 'prepend' },
        { key: 'phone', label: 'Teléfono', icon: 'phone', required: false, iconPosition: 'prepend' },
        { key: 'email', label: 'Correo Electrónico', icon: 'email', required: false, iconPosition: 'prepend' },
        { key: 'address', label: 'Dirección', icon: 'place', required: false, iconPosition: 'prepend' },

      ],
      productsColumns: [
        { name: 'name', align: 'left', label: 'Nombre del Producto', field: 'name' },
        { name: 'code', align: 'left', label: 'Código', field: 'code' },
        { name: 'category', align: 'left', label: 'Categoría', field: 'category' },
        { name: 'price', align: 'right', label: 'Precio Ofrecido', field: 'price' }
      ]
    }
  },
  computed: {
    progressValue() {
      return (this.currentStep / this.steps.length) * 100;
    },
    verifyFirstStep() {
      const resultado = Object.values(this.supplier).every(value => {
        return typeof value === 'string' && value.trim() !== '';
      });
      return !resultado;
    },
    verifyProductsSelectedFirst() {
      return !this.availableProducts.some((product) => product.selected === true);
    },
    verifyProductsSelectedSecond() {
      return !this.selectedProducts.some((product) => product.selected === true);
    }
  },
  methods: {
    getStepIcon(step) {
      const icons = { 1: 'person', 2: 'inventory_2', 3: 'summarize' };
      return icons[step];
    },
    onLoad() {
      this.isLoading = true;
      this.getAvailableProducts()
        .finally(() => {
          this.isLoading = false;
        });
    },
    getAvailableProducts() {
      return this.$store.dispatch("general/getPrimaryProduct", { root: true })
        .then((response) => {
          this.availableProducts = response.data.data.map((o) => ({ ...o, selected: false, price: o.unit_cost || 0 }));
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    handlePriceUpdate({ id, price }) {
      this.selectedProducts = this.selectedProducts.map((o) => {
        if (o.id === id) {
          return { ...o, price };
        }
        return o;
      });
    },
    searchData(query, arr, nameArrCopy) {
      const normalizeText = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (query) {
        const normalizedQuery = normalizeText(query);
        this.arrFilters[nameArrCopy] = arr.filter((item) =>
          normalizeText(item.name).includes(normalizedQuery) ||
          normalizeText(item.category).includes(normalizedQuery) ||
          (item.code && normalizeText(item.code).includes(normalizedQuery))
        );
      } else {
        this.arrFilters[nameArrCopy] = [];
      }
    },
    sendAll(arrName, arrNameSelected, arrNameFilter) {
      if (this.arrFilters[arrNameFilter].length > 0 && this.filters[arrNameFilter]) {
        this[arrNameSelected] = [...this[arrNameSelected], ...this.arrFilters[arrNameFilter].map((o) => ({ ...o, selected: false }))];
        this[arrName] = this[arrName].filter((item) => !this.arrFilters[arrNameFilter].some((other) => other.id == item.id));
        this.arrFilters[arrNameFilter] = [];
        this.filters[arrNameFilter] = "";
      } else {
        this[arrNameSelected] = [...this[arrNameSelected], ...this[arrName].map((o) => ({ ...o, selected: false }))];
        this[arrName] = [];
      }
    },
    quitAll(arrName, arrNameSelected, arrNameFilter) {
      if (this.arrFilters[arrNameFilter].length > 0 && this.filters[arrNameFilter]) {
        this[arrName] = [...this[arrName], ...this.arrFilters[arrNameFilter].map((o) => ({ ...o, selected: false }))];
        this[arrNameSelected] = this[arrNameSelected].filter((item) => !this.arrFilters[arrNameFilter].some((other) => other.id == item.id));
        this.arrFilters[arrNameFilter] = [];
        this.filters[arrNameFilter] = "";
      } else {
        this[arrName] = [...this[arrName], ...this[arrNameSelected].map((o) => ({ ...o, selected: false }))];
        this[arrNameSelected] = [];
      }
    },
    sendSelect(arrName, arrNameSelected, arrNameFilter) {
      if (this.arrFilters[arrNameFilter].length > 0 && this.filters[arrNameFilter]) {
        this[arrNameSelected] = [...this[arrNameSelected], ...this.arrFilters[arrNameFilter].filter((o) => o.selected === true).map((o) => ({ ...o, selected: false }))];
        this[arrName] = this[arrName].filter((o) => !this.arrFilters[arrNameFilter].some((other) => other.id == o.id && other.selected === true)).map((o) => ({ ...o, selected: false }));
        this.arrFilters[arrNameFilter] = [];
        this.filters[arrNameFilter] = "";
      } else {
        this[arrNameSelected] = [...this[arrNameSelected], ...this[arrName].filter((o) => o.selected === true).map((o) => ({ ...o, selected: false }))];
        this[arrName] = [...this[arrName].filter((o) => o.selected !== true)];
      }
    },
    quitSelect(arrName, arrNameSelected, arrNameFilter) {
      if (this.arrFilters[arrNameFilter].length > 0 && this.filters[arrNameFilter]) {
        this[arrName] = [...this[arrName], ...this.arrFilters[arrNameFilter].filter((o) => o.selected === true).map((o) => ({ ...o, selected: false }))];
        this[arrNameSelected] = this[arrNameSelected].filter((o) => !this.arrFilters[arrNameFilter].some((other) => other.id == o.id && other.selected === true)).map((o) => ({ ...o, selected: false }));
        this.arrFilters[arrNameFilter] = [];
        this.filters[arrNameFilter] = "";
      } else {
        this[arrName] = [...this[arrName], ...this[arrNameSelected].filter((o) => o.selected === true).map((o) => ({ ...o, selected: false }))];
        this[arrNameSelected] = [...this[arrNameSelected].filter((o) => o.selected !== true)];
      }
    },
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      }
    },

    transformProducts() {
      return this.selectedProducts.map(o => o.id);
    },

    onCreate() {
      this.isLoading = true;

      const payload = {
        name: this.supplier.name,
        contact_name: this.supplier.contact_name || "",
        company_name: this.supplier.company_name || "",
        phone: this.supplier.phone || "",
        email: this.supplier.email || "",
        address: this.supplier.address || "",
        products: this.transformProducts()
      };

      this.$store.dispatch("provedores/setSupplier", payload, { root: true })
        .then((response) => {
          if (response.data.status === "OK") {
            this.alertSuccess(response.data.msg || "Proveedor registrado con éxito");
            this.goTo('/provider');
          }
        })
        .catch((error) => {
          this.alertError(error.response?.data?.msg || "Error al registrar el proveedor");
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.onLoad();
  },
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
