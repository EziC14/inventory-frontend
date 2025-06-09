<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-md q-pt-lg" style="padding: 30px 70px;">
      <!-- Header Section -->
      <div class="row items-center justify-between q-mb-lg">
        <div class="text-h5 text-weight-bold text-primary">
          <Title name="Nuevo Producto" />
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
          <span class="text-weight-bold">{{ relativeStep() }}/{{ filteredSteps.length }}</span>
        </q-circular-progress>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Left navigation -->
        <div class="col-12 col-md-3">
          <q-card class="steps-card">
            <q-list padding class="rounded-borders">
              <q-item
                v-for="(step, index) in filteredSteps"
                :key="index"
                :class="{
                  'step-active': currentStep === getOriginalIndex(index) + 1,
                  'step-completed': currentStep > getOriginalIndex(index) + 1,
                  'step-pending': currentStep < getOriginalIndex(index) + 1
                }"
                class="q-py-md step-item"
              >
                <q-item-section avatar>
                  <q-avatar
                    :color="currentStep >= getOriginalIndex(index) + 1 ? 'primary' : 'grey-4'"
                    text-color="white"
                    size="42px"
                  >
                    <q-icon :name="getStepIcon(getOriginalIndex(index) + 1)" size="sm" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-subtitle1" :class="{
                    'text-weight-bold': currentStep === getOriginalIndex(index) + 1,
                    'text-grey': currentStep < getOriginalIndex(index) + 1
                  }">
                    {{ step }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side v-if="currentStep > getOriginalIndex(index) + 1">
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
            <SimpleInput
              v-for="(field, i) in basicFields"
              :key="i"
              :text="product[field.key]"
              @change-name="(e) => (product[field.key] = e)"
              class="col-12 col-md-6 q-mb-xs"
              :icon="field.icon"
              :isRequired="field.required"
              :labelBody="field.label"
              :iconPosition="field.iconPosition"
              :isNumber="field.isNumber"
              :isDecimal="field.isDecimal"
            />
            <SelectInput
              :text="product.category"
              @change-name="(e) => (product.category = e)"
              class="col-12 col-md-6 q-mb-xs"
              :options="categories"
              icon="category"
              :isRequired="true"
              labelBody="Categoria"
              iconPosition="prepend"
            />
          </div>
          <div style="display: flex; gap: 7%;">
            <!-- <div class="row q-col-gutter-x-md q-mt-lg">
              <div class="q-gutter-y-sm col-12">
                <div style="margin: 0">¿Es Producto final?</div>
                <q-btn-group outline>
                  <q-btn
                    v-for="btn in btnsRequired"
                    :key="btn.value"
                    :outline="btn.value !== product.isProductFinal"
                    @click="product.isProductFinal = btn.value"
                    color="primary"
                    :label="btn.label"
                    class="q-px-lg text-capitalize q-px-xl"
                  />
                </q-btn-group>
              </div>
            </div> -->

            <div class="q-gutter-y-sm col-12 q-mt-md">
              <div style="margin: 0">¿Tiene colores?</div>
              <q-btn-group outline>
                <q-btn
                  v-for="btn in btnsColors"
                  :key="btn.value"
                  :outline="btn.value !== product.hasColors"
                  @click="product.hasColors = btn.value"
                  color="primary"
                  :label="btn.label"
                  class="q-px-lg text-capitalize q-px-xl"
                />
              </q-btn-group>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
        <div>
          <q-btn @click="goTo('/product')" color="primary" class="q-px-xl q-py-sm" rounded outline label="cancelar" />
        </div>
        <div>
          <q-btn
            :loading="isLoading"
            :disable="verifyFirstStep"
            @click="nextStep"
            color="primary"
            rounded
            class="bg-primary text-white q-px-xl q-py-sm"
            label="continuar"
          >
            <template v-slot:loading> <q-spinner class="on-left" /> </template>
          </q-btn>
        </div>
      </q-stepper-navigation>
    </div>

    <!-- Step 2: Product Details -->
    <div v-if="currentStep === 2" class="full-height" style="display: flex; flex-direction: column;">

      <!-- Header -->
      <div class="header">
        <div class="text-h6">Detalles del Producto</div>
      </div>

      <!-- Contenido -->
      <div class="content flex-grow-1">
        <div>Agrega los productos primarios que conforman este producto final:</div>
        <div class="row">
          <div class="col-12 col-md-5">
            <div class="row justify-between items-center q-mt-md">
              <div class="fw-700 fs-18 color-primary">Producto Primario</div>
              <FindInput
                :modelQuery="filters.trainersFirst"
                :baseArr="primaryProduct"
                nameArrCopy="trainersFirst"
                @findByQuery="searchData"
                @update:model-query="(e) => (filters.trainersFirst = e)"
              />
            </div>
            <EmptyState
              v-if="!primaryProduct?.length || (!arrFilters.trainersFirst?.length && filters.trainersFirst)"
              class="q-mt-md"
              info="No hay productos primarios, intenta con otro nombre"
            />
            <ProductList v-else :arrData="primaryProduct" :arrFilter="arrFilters.trainersFirst" />
          </div>
          <div class="col-12 col-md-2 column items-center justify-center">
            <TransferControls
              @sendAll="sendAll"
              @sendSelect="sendSelect"
              @quitSelect="quitSelect"
              @quitAll="quitAll"
              :verifyFirstList="verifyTrainersSelectedFirst"
              :verifySecondList="verifyTrainersSelectedSecond"
              arrName="primaryProduct"
              arrNameSelected="primaryProductSelected"
              arrNameFilterFirst="trainersFirst"
              arrNameFilterSecond="trainersSecond"
            />
          </div>
          <div v-if="!primaryProductSelected.length" class="col-12 col-md-5 column items-center q-col-gutter-lg">
            <q-img src="~assets/images/no_data.svg" :style="{ width: $q.screen.lt.md ? '150px' : '200px' }" />
            <div class="text-center">
              <div class="fw-700 fs-18 color-primary">Sin agregar</div>
              <div class="fs-15 q-px-lg text-center">Aún no has agregado ningún puesto de trabajo</div>
            </div>
          </div>
          <div v-else class="col-12 col-md-5">
            <div class="row justify-between items-center">
              <div class="fw-700 fs-18 color-primary">Puestos seleccionados</div>
              <FindInput
                :modelQuery="filters.trainersSecond"
                :baseArr="primaryProductSelected"
                nameArrCopy="trainersSecond"
                @findByQuery="searchData"
                @update:model-query="(e) => (filters.trainersSecond = e)"
              />
            </div>
            <EmptyState
              v-if="!primaryProductSelected?.length || (!arrFilters.trainersSecond.length && filters.trainersSecond)"
              class="q-mt-md row justify-center"
              info="No se encontraron resultados según tu búsqueda"
            />
            <ProductList
              v-else
              :arrData="primaryProductSelected"
              :arrFilter="arrFilters.trainersSecond"
              :viewQuantity="true"
              @update:quantity="handleQuantityUpdate"
            />
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
        <div>
          <q-btn @click="currentStep = 1" color="primary" class="q-px-xl q-py-sm" rounded outline label="atras" />
        </div>
        <div>
          <q-btn
            :disable="verifyArrProduct"
            @click="nextStep"
            class="bg-primary text-white q-px-xl q-py-sm"
            rounded
            flat
            label="Continuar"
          />
        </div>
      </q-stepper-navigation>
    </div>

    <!-- Step 3: Product Type -->
    <div v-if="currentStep === 3" class="full-height" style="display: flex; flex-direction: column;">
      <!-- Header -->
      <div class="header row items-center justify-between">
        <div class="text-h6">Gestión de Colores</div>
        <q-btn @click="addCard" icon="add_circle" label="Agregar color" color="primary" unelevated class="q-px-md" />
      </div>

      <!-- Contenido -->
      <div class="content flex-grow-1">
        <div class="color-management">
          <div class="row q-col-gutter-md">
            <div v-for="(card, index) in colorCards" :key="index" class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">

<q-card class="color-card" style="box-shadow: none; border-radius: 20px; border: 1px solid #E5E5E5; min-width: 400px;">
  <div class="row q-pa-md">
    <!-- Selector de color a la izquierda -->
    <div class="col-4 q-pr-xl">
      <q-color
        v-model="card.hex_code"
        @input="updateColorCard(index, 'hex', $event)"
        no-header-tabs
        no-footer
        class="color-picker"
        default-view="palette"
        flat
        bordered
        style="min-width: 120px;"
      />
    </div>

    <!-- Inputs y botón a la derecha -->
    <div class="col-8 q-pl-md">
      <div class="column q-gutter-y-md">
        <!-- Nombre del color -->
        <q-input
          label="Nombre del color"
          v-model="card.name_color"
          outlined
          dense
          rounded
          class="full-width"
        />

        <!-- Stock del producto -->
        <q-input
          label="Stock del producto"
          v-model="card.stock"
          outlined
          dense
          rounded
          class="full-width"
          type="number"
        />

        <!-- Botón Eliminar -->
        <q-btn
          color="dark-red"
          icon="delete"
          label="Eliminar"
          class="full-width"
          style="background-color: #5E0721; color: white; border-radius: 8px; height: 40px;"
          @click="removeCard(index)"
        />
      </div>
    </div>
  </div>
</q-card>
            </div>
          </div>
          <div v-if="!colorCards.length" class="empty-state q-pa-xl text-center">
            <q-icon name="palette" size="4rem" color="grey-4" style="margin-top: 150px;"/>
            <div class="text-h6 text-grey-7 q-mt-md">Sin colores</div>
            <div class="text-grey-6 q-mt-sm">Agrega colores para este producto</div>
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
        <div>
          <q-btn @click="currentStep = product.isProductFinal ? 2 : 1" color="primary" class="q-px-xl q-py-sm" rounded outline label="atras" />
        </div>
        <div>
          <q-btn
            :disable="verifyArrColors"
            @click="nextStep"
            class="bg-primary text-white q-px-xl q-py-sm"
            rounded
            flat
            label="Continuar"
          />
        </div>
      </q-stepper-navigation>
    </div>

    <!-- Step 4: Summary -->
    <div v-if="currentStep === 4" class="full-height" style="display: flex; flex-direction: column;">

      <!-- Header -->
      <div class="header">
        <div class="text-h6">Resumen</div>
      </div>

      <!-- Contenido -->
      <div class="content flex-grow-1">
        <InfoSummary :product="product" :primary-product-selected="primaryProductSelected" :color-cards="colorCards" />
      </div>

      <!-- Navegación -->
      <q-stepper-navigation class="navigation row items-center justify-between q-gutter-x-md q-mt-auto">
        <div>
          <q-btn
            :disable="isLoading"
            type="button"
            @click="goBack"
            color="primary"
            class="q-px-xl q-py-sm"
            rounded
            outline
            label="atras"
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
            label="registrar producto"
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
import FindInput from 'components/inputs/Find.vue'
import EmptyState from 'components/EmptyState.vue'
import ProductList from 'src/components/product/ProductList.vue'
import TransferControls from 'components/product/TransferControls.vue'
import InfoSummary from 'components/product/InfoSummary.vue'

export default {
  components: {
    Title,
    SimpleInput,
    SelectInput,
    FindInput,
    EmptyState,
    ProductList,
    TransferControls,
    InfoSummary
  },
  mixins: [MethodsMixin],
  data() {
    return {
      currentStep: 1,
      steps: ['Informacion Basica', 'Composicion', 'Colores', 'Resumen y Confirmacion'],
      isLoading: false,
      done1: false,
      done2: false,
      done3: false,
      done4: false,
      btnsColors: [
        { label: 'Si', value: true },
        { label: 'No', value: false }
      ],
      btnsRequired: [
        { label: 'Si', value: true },
        { label: 'No', value: false }
      ],
      product: {
        name: '',
        code: '',
        stock: '',
        price: '',
        category: '',
        isProductFinal: false,
        hasColors: false,
      },
      categories: [],
      primaryProduct: [],
      primaryProductSelected: [],
      colorCards: [],
      filters: {
        trainersFirst: "",
        trainersSecond: "",
      },
      arrFilters: {
        trainersFirst: [],
        trainersSecond: [],
      },
      basicFields: [
        { key: 'code', label: 'Codigo', icon: 'person', required: true, iconPosition: 'prepend' },
        { key: 'name', label: 'nombre', icon: 'person', required: true, iconPosition: 'prepend' },
        { key: 'stock', label: 'Stock', icon: 'person', required: true, iconPosition: 'prepend', isNumber: true },
        { key: 'price', label: 'Precio Unitario', icon: 'person', required: true, iconPosition: 'prepend', isDecimal: true },
      ],
    }
  },
  computed: {
    filteredSteps() {
      return this.steps.filter((step, index) => {
        return !(
          (index === 1 && !this.product.isProductFinal) ||
          (index === 2 && !this.product.hasColors)
        );
      });
    },
    getOriginalIndex() {
      return (filteredIndex) => {
        let skipped = 0;
        if (!this.product.isProductFinal && filteredIndex >= 1) skipped += 1;
        if (!this.product.hasColors && filteredIndex >= 2) skipped += 1;
        return filteredIndex + skipped;
      };
    },
    verifyFirstStep() {
      return Object.entries(this.product)
        .filter(([key]) => key !== 'stock')
        .some(([_, value]) => value === null || value === "");
    },
    verifyArrColors() {
      return this.colorCards.length === 0 || this.colorCards.some((o) => {
        return o.name_color === "" || o.stock === "";
      });
    },
    verifyTrainersSelectedFirst() {
      return !this.primaryProduct.some((job) => job.selected === true);
    },
    verifyTrainersSelectedSecond() {
      return !this.primaryProductSelected.some((job) => job.selected === true);
    },
    verifyArrProduct() {
      return this.primaryProductSelected.length === 0;
    },
    progressValue() {
      return (this.currentStep / 4) * 100;
    }
  },
  methods: {
    relativeStep() {
      // Mapea el currentStep absoluto a su posición en filteredSteps
      const stepIndex = this.filteredSteps.findIndex(
        (step, index) => this.getOriginalIndex(index) + 1 === this.currentStep
      );
      return stepIndex + 1; // Sumamos 1 porque los índices comienzan en 0
    },
    getStepIcon(step) {
      const icons = { 1: 'info', 2: 'description', 3: 'category', 4: 'done_all' };
      return icons[step];
    },
    onLoad() {
      this.isLoading = true;
      Promise.all([this.getPrimaryProduct(), this.getCategory()])
        .finally(() => {
          this.isLoading = false;
        });
    },
    handleQuantityUpdate({ id, quantity }) {
      this.primaryProductSelected = this.primaryProductSelected.map((o) => {
        if (o.id === id) {
          return { ...o, quantity };
        }
        return o;
      });
    },
    updateColorCard(index, field, value) {
      const updatedCards = [...this.colorCards];
      updatedCards[index] = { ...updatedCards[index], [field]: value };
      this.colorCards = updatedCards;
    },
    addCard() {
      this.colorCards = [...this.colorCards, { name_color: '', stock: '', hex_code: '' }];
    },
    removeCard(index) {
      this.colorCards = this.colorCards.filter((_, i) => i !== index);
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
    getPrimaryProduct() {
      return this.$store.dispatch("general/getPrimaryProduct", { root: true })
        .then((response) => {
          this.primaryProduct = response.data.data.map((o) => ({ ...o, selected: false }));
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    getCategory() {
      return this.$store.dispatch("general/getCategory", { root: true })
        .then((response) => {
          this.categories = response.data.data.map((o) => ({ label: o.name, value: o.id }));
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    searchData(query, arr, nameArrCopy) {
      const normalizeText = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (query) {
        const normalizedQuery = normalizeText(query);
        this.arrFilters[nameArrCopy] = arr.filter((item) => normalizeText(item.name).includes(normalizedQuery) || normalizeText(item.category).includes(normalizedQuery));
      } else {
        this.arrFilters[nameArrCopy] = [];
      }
    },
    transformPrimaryProduct() {
      return this.primaryProductSelected.map((o) => ({ id: o.id, quantity: o.quantity !== undefined ? o.quantity : 1 }));
    },
    onCreate() {
      const payload = {
        name: this.product.name || "",
        code: this.product.code || "",
        stock: this.product.stock || 0,
        unit_cost: this.product.price || 0,
        category: this.product.category?.value || null,
        isProductFinal: this.product.isProductFinal || false,
        has_colors: this.product.hasColors || false,
        compositions: this.transformPrimaryProduct() || [],
        colors: this.colorCards || [],
      };
      const action = this.product.isProductFinal ? "general/setFinalProduct" : "general/setPrimaryProduct";
      this.$store.dispatch(action, payload, { root: true })
        .then((response) => {
          if (response.data.status === "OK") {
            this.alertSuccess(response.data.msg);
            this.goTo("/product");
          }
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    nextStep() {
      if (this.currentStep === 1) {
        if (this.product.isProductFinal) {
          this.currentStep = 2;
        } else if (this.product.hasColors) {
          this.currentStep = 3;
        } else {
          this.currentStep = 4;
        }
      } else if (this.currentStep === 2) {
        if (this.product.hasColors) {
          this.currentStep = 3;
        } else {
          this.currentStep = 4;
        }
      } else if (this.currentStep === 3) {
        this.currentStep = 4;
      }
    },
    goBack() {
      if (this.currentStep === 4) {
        if (this.product.hasColors) {
          this.currentStep = 3;
        } else if (this.product.isProductFinal) {
          this.currentStep = 2;
        } else {
          this.currentStep = 1;
        }
      } else if (this.currentStep === 3) {
        if (this.product.isProductFinal) {
          this.currentStep = 2;
        } else {
          this.currentStep = 1;
        }
      } else if (this.currentStep === 2) {
        this.currentStep = 1;
      }
    },
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

.q-field,
.q-color-picker {
  width: 100%;
  max-width: none;
}

.q-color-picker__footer {
  display: none;
}

.border-left {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-left: 2px solid #e0e0e0;
  }
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
