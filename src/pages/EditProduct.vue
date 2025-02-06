<template>
  <q-page v-if="isLoadingSection" class="bg-page q-gutter-md q-pa-md column">
    <div class="col-grow items-center justify-center column q-gutter-y-md">
      <div class="fw-700 text-uppercase">
        {{ "Cargando planificación..." }}
      </div>
      <q-spinner-facebook color="primary" size="2em" />
    </div>
  </q-page>
  <q-page class="bg-page q-gutter-md" style="padding: 100px;">
    <q-card class="shadow-0 bg-page">
      <Title name="Editar Producto"> </Title>
    </q-card>
    <q-stepper
      v-model="step"
      ref="stepper"
      alternative-labels
      color="primary"
      animated
      style="border-radius: 30px; padding: 10px; box-shadow: none"
    >
      <q-step
        :name="1"
        title="General"
        icon="settings"
        :done="done1"
      >
        <div class="q-mt-lg">
          <div class="row q-col-gutter-x-md">
            <SimpleInput
              :text="product.code"
              @change-name="(e) => (product.code = e)"
              class="col-12 col-md-6 q-mb-xs"
              icon="person"
              :isRequired="true"
              labelBody="Codigo"
              iconPosition="prepend"
            />
            <SimpleInput
              :text="product.name"
              @change-name="(e) => (product.name = e)"
              class="col-12 col-md-6 q-mb-xs"
              icon="person"
              :isRequired="true"
              labelBody="nombre"
              iconPosition="prepend"
            />
            <SimpleInput
              v-if="product.hasColors === false"
              :text="product.stock"
              @change-name="(e) => (product.stock = e)"
              class="col-12 col-md-6 q-mb-xs"
              icon="person"
              :isRequired="true"
              labelBody="Stock"
              :isNumber="true"
              iconPosition="prepend"
            />
            <SimpleInput
              :text="product.price"
              @change-name="(e) => (product.price = e)"
              class="col-12 col-md-6 q-mb-xs"
              icon="person"
              :isRequired="true"
              :isDecimal="true"
              labelBody="Precio Unitario"
              iconPosition="prepend"
            />
            <SelectInput
              :text="product.category"
              @change-name="(e) => (product.category = e)"
              class="col-12 col-md-6 q-mb-xs"
              :options="categories"
              icon="person"
              :isRequired="true"
              labelBody="Categoria"
              iconPosition="prepend"
            />
          </div>
          <div style="display: flex; gap: 7%;">
          <div class="row q-col-gutter-x-md q-mt-lg">
              <div class="q-gutter-y-sm col-12">
                <div style="margin: 0">¿Es Producto final?</div>
                <q-btn-group outline>
                  <q-btn
                    :class="{ 'q-py-sm': !$q.screen.xs }"
                    class="q-px-lg text-capitalize q-px-xl"
                    v-for="btn in btnsRequired"
                    :key="btn.value"
                    :outline="btn.value !== product.isProductFinal"
                    @click="product.isProductFinal = btn.value"
                    color="primary"
                    :label="btn.label"
                  />
                </q-btn-group>
              </div>

            </div>

            <div class="q-gutter-y-sm col-12 q-mt-md">
              <div style="margin: 0">¿Tiene colores?</div>
              <q-btn-group outline>
                <q-btn
                  :class="{ 'q-py-sm': !$q.screen.xs }"
                  class="q-px-lg text-capitalize q-px-xl"
                  v-for="btn in btnsColors"
                  :key="btn.value"
                  :outline="btn.value !== product.hasColors"
                  @click="product.hasColors = btn.value"
                  color="primary"
                  :label="btn.label"
                />
              </q-btn-group>
            </div>
          </div>
        </div>
        <q-stepper-navigation
          :class="{
            'q-col-gutter-y-md': $q.screen.lt.sm,
            '': !$q.screen.lt.sm,
          }"
          class="row items-center justify-center q-gutter-x-md"
        >
          <div
            :class="{
              'col-12': $q.screen.lt.sm,
            }"
          >
            <q-btn
              :class="{
                'full-width': $q.screen.lt.sm,
              }"
              @click="goTo('/product')"
              color="primary"
              class="q-px-xl q-py-sm"
              rounded
              outline
              label="cancelar"
            >
            </q-btn>
          </div>

          <div
            :class="{
              'col-12': $q.screen.lt.sm,
            }"
          >
            <q-btn
              :class="{
                'full-width': $q.screen.lt.sm,
              }"
              :loading="isLoading"
              :disable="verifyFirstStep"
              @click="() => {
                if (product.isProductFinal) {
                  done1 = true;
                  step = 2; // Si es producto final, ir al paso 2
                } else {
                  if (product.hasColors) {
                    done1 = true;
                    step = 3; // Si no es producto final pero tiene colores, ir al paso 3
                  } else {
                    done1 = true;
                    step = 4; // Si no es producto final y no tiene colores, ir al paso 4
                  }
                }
              }"
              color="primary"
              rounded
              class="bg-primary text-white q-px-xl q-py-sm"
              label="continuar"
              flat
            >
              <template v-slot:loading> <q-spinner class="on-left" /> </template
            ></q-btn>
          </div>
        </q-stepper-navigation>
      </q-step>

      <!-- Paso 2: Agregar productos primarios si no es producto primario -->
      <q-step
        v-if="product.isProductFinal === true"
        :name="2"
        title="Productos Primarios"
        icon="list_alt"
        :done="done2"
      >
        <div>
          Agrega los productos primarios que conforman este producto final:
        </div>

        <div class="row">
          <div class="col-12 col-md-5">

              <div class="row justify-between items-center q-mt-md">
              <div class="fw-700 fs-18 color-primary">Producto Primario</div>
              <FindInput
                :class="{
                  'full-width q-mt-sm': $q.screen.lt.sm,
                }"
                :modelQuery="filters.trainersFirst"
                :baseArr="primaryProduct"
                nameArrCopy="trainersFirst"
                @findByQuery="searchData"
                @update:model-query="(e) => (filters.trainersFirst = e)"
              />
            </div>

            <EmptyState
              v-if="
                !primaryProduct?.length ||
                (!arrFilters.trainersFirst?.length && filters.trainersFirst)
              "
              class="q-mt-md"
              info="No hay productos primarios, intenta con otro nombre"
            />

            <ProductList
              v-else
              :arrData="primaryProduct"
              :arrFilter="arrFilters.trainersFirst"
            />

          </div>
          <div
            :class="{
              'q-py-lg': $q.screen.lt.sm,
              '': !$q.screen.lt.sm,
            }"
            class="col-12 col-md-2 column items-center justify-center"
          >
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

          <div
            :class="{
              'q-mt-md': $q.screen.lt.sm,
              ' justify-center': !$q.screen.lt.sm,
            }"
            v-if="!primaryProductSelected.length"
            class="col-12 col-md-5 column items-center q-col-gutter-lg"
          >
            <q-img
              :style="{ width: $q.screen.lt.md ? '150px' : '200px' }"
              src="~assets/images/no_data.svg"
            ></q-img>
            <div class="text-center">
              <div class="fw-700 fs-18 color-primary">Sin agregar</div>
              <div class="fs-15 q-px-lg text-center">
                Aún no has agregado ningún puesto de trabajo
              </div>
            </div>
          </div>

          <div v-else class="col-12 col-md-5">
            <div class="row justify-between items-center">
              <div class="fw-700 fs-18 color-primary">
                Puestos seleccionados
              </div>
              <FindInput
                :class="{
                  'full-width q-mt-sm': $q.screen.lt.sm,
                }"
                :modelQuery="filters.trainersSecond"
                :baseArr="primaryProductSelected"
                nameArrCopy="trainersSecond"
                @findByQuery="searchData"
                @update:model-query="(e) => (filters.trainersSecond = e)"
              />
            </div>
            <EmptyState
              v-if="
                !primaryProductSelected?.length ||
                (!arrFilters.trainersSecond.length && filters.trainersSecond)
              "
              class="q-mt-md"
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
        <q-stepper-navigation
          :class="{
            'q-col-gutter-y-md': $q.screen.lt.sm,
            '': !$q.screen.lt.sm,
          }"
          class="row items-center justify-center q-gutter-x-md"
        >
          <div
            :class="{
              'col-12': $q.screen.lt.sm,
            }"
          >
            <q-btn
              :class="{
                'full-width': $q.screen.lt.sm,
              }"
              @click="step = 1"
              color="primary"
              class="q-px-xl q-py-sm"
              rounded
              outline
              label="atras"
            ></q-btn>
          </div>
          <div
            :class="{
              'col-12': $q.screen.lt.sm,
            }"
          >
            <q-btn
              :class="{
                'full-width': $q.screen.lt.sm,
              }"
              :disable="verifyArrProduct"
              @click="
                () => {
                  if (product.hasColors) {
                    done2 = true;
                    step = 3;
                  } else {
                    done2 = true;
                    step = 4;
                  }
                }
              "
              class="bg-primary text-white q-px-xl q-py-sm"
              rounded
              flat
              label="Continuar"
            ></q-btn>
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step
        v-if="product.hasColors === true"
        :name="3"
        :done="done3"
        title="Agrega colores"
        icon="add_comment"
      >
        <div>
          <q-btn
            @click="addCard"
            icon="add"
            label="Agrega un nuevo color"
            color="primary"
            class="q-mb-md"
          />

          <div class="row q-col-gutter-lg">
            <div
              v-for="(card, index) in colorCards"
              :key="index"
            >
              <q-card class="color-card" style="border-radius: 20px;">
                <q-card-section>
                  <div class="">
                    <div>
                    <SimpleInput
                      labelBody="Nombre del color"
                      :text="card.name_color"
                      :rounded="true"
                      :isRequired="true"
                      @change-name="(e) => (card.name_color = e)"

                    />
                    <SimpleInput
                      labelBody="Stock del producto"
                      :text="card.stock"
                      :rounded="true"
                      :isRequired="true"
                      @change-name="(e) => (card.stock = e)"
                      :isNumber = "true"
                    />
                    </div>
                    <div>
                    <q-color
                      no-footer
                      v-model="card.hex_code"
                      @input="updateColorCard(index, 'hex', $event)"
                      no-header-tabs
                      class="color-picker"
                    />
                  </div>
                  </div>
                </q-card-section>
                <q-card-section class="bg-negative q-pa-none">
                  <q-btn
                    flat
                    icon="delete_forever"
                    label="Eliminar"
                    color="white"
                    @click="removeCard(index)"
                    class="full-width"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <q-stepper-navigation
              :class="{
                'q-col-gutter-y-md': $q.screen.lt.sm,
                '': !$q.screen.lt.sm,
              }"
              class="row items-center justify-center q-gutter-x-md"
            >
              <div
                :class="{
                  'col-12': $q.screen.lt.sm,
                }"
              >
                <q-btn
                  :class="{
                    'full-width': $q.screen.lt.sm,
                  }"
                  @click="
                    () => {
                      if (product.isProductFinal) {
                        step = 2;
                      } else {
                        step = 1;
                      }
                    }
                  "
                  color="primary"
                  class="q-px-xl q-py-sm"
                  rounded
                  outline
                  label="atras"
                ></q-btn>
              </div>
              <div
                :class="{
                  'col-12': $q.screen.lt.sm,
                }"
              >
                <q-btn
                  :class="{
                    'full-width': $q.screen.lt.sm,
                  }"
                  :disable="verifyArrColors"
                  @click="
                    () => {
                      done3 = true;
                      step = 4;
                    }
                  "
                  class="bg-primary text-white q-px-xl q-py-sm"
                  rounded
                  flat
                  label="Continuar"
                ></q-btn>
              </div>
            </q-stepper-navigation>
      </q-step>

      <q-step :name="4" title="Resúmen" icon="list_alt" :done="done4">
        <q-form @submit="onEdit">
          <q-stepper-navigation
            :class="{
              'q-col-gutter-y-md': $q.screen.lt.sm,
              '': !$q.screen.lt.sm,
            }"
            class="column items-center justify-center q-gutter-x-md"
          >
          <InfoSummary
              :product="product"
              :primary-product-selected="primaryProductSelected"
              :color-cards="colorCards"
            />
            <div class="row q-col-gutter-lg q-mt-md">
            <div
              :class="{
                'col-12': $q.screen.lt.sm,
              }"
            >
              <q-btn
                :class="{
                  'full-width': $q.screen.lt.sm,
                }"
                :disable="isLoading"
                type="button"
                @click="
                    if (product.hasColors) {
                        step = 3;
                    } else if (product.isProductFinal) {
                        step = 2;
                    } else {
                        step = 1;
                    }
                "
                color="primary"
                class="q-px-xl q-py-sm"
                rounded
                outline
                label="atras"
              ></q-btn>
            </div>
            <div
              :class="{
                'col-12': $q.screen.lt.sm,
              }"
            >
              <q-btn
                :class="{
                  'full-width': $q.screen.lt.sm,
                }"
                :loading="isLoading"
                type="submit"
                @click="done4 = true"
                class="bg-primary text-white q-px-xl q-py-sm"
                rounded
                flat
                label="editar producto"
              >
                <template v-slot:loading>
                  <q-spinner class="on-left" /> </template
              ></q-btn>
            </div>
          </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
    </q-stepper>
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
import TransferControls from 'components/product/TransferControls.vue';
import InfoSummary from 'src/components/product/InfoSummary.vue';

export default {
  components: {
    Title,
    SimpleInput,
    SelectInput,
    FindInput,
    EmptyState,
    ProductList,
    TransferControls,
    InfoSummary,
  },
  mixins: [MethodsMixin],
  data () {
    return {
      isLoadingSection: false,
      isLoading: false,
      step: 1,
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
      planning: {
        required: false
      },

      product: {
        id: null,
        name: '',
        code: '',
        stock: '',
        price: '',
        category: '',
        isProductFinal: false,
        hasColors: false,
      },

      categories: [],

      productosPrimarios: [],
      nuevoProductoPrimario: "",

      primaryProduct: [],
      primaryProductSelected: [],

      colorCards: [],

      filters: {
        trainersFirst: "",
        trainersSecond: "",
        participantsFirst: "",
        participantsSecond: "",
        trainersSummary: "",
        participantsSummary: "",
      },
      arrFilters: {
        trainersFirst: [],
        trainersSecond: [],
        participantsFirst: [],
        participantsSecond: [],
        trainersSummary: [],
        participantsSummary: [],
      },
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$route.params.id) {
        this.product.id = this.$route.params.id;
        this.onLoad();
      } else {
        this.goTo("/product");
      }
    });
  },

  computed: {
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
      const hasSelected = this.primaryProduct.some(
        (job) => job.selected === true
      );
      return !hasSelected;
    },
    verifyTrainersSelectedSecond() {
      const hasSelected = this.primaryProductSelected.some(
        (job) => job.selected === true
      );
      return !hasSelected;
    },
    verifyArrProduct() {
      return this.primaryProductSelected.length === 0;
    },
  },
  methods: {
    onLoad() {
      this.isLoadingSection = true;
      // this.$q.loading.show();
      Promise.all([
        this.getProductId(),
        this.getCategory(),
      ])
        .then(() => {})
        .finally(() => {
          this.isLoadingSection = false;
          // this.$q.loading.hide();
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
      updatedCards[index] = {
        ...updatedCards[index],
        [field]: value
      };
      this.colorCards = updatedCards;
    },

    addCard() {
      this.colorCards = [...this.colorCards, { name_color: '', stock: '', hex_code: '' }];
    },

    removeCard(index) {
      this.colorCards = this.colorCards.filter((_, i) => i !== index);
    },


    sendAll(arrName, arrNameSelected, arrNameFilter) {
      if (
        this.arrFilters[arrNameFilter].length > 0 &&
        this.filters[arrNameFilter]
      ) {
        this[arrNameSelected] = [
          ...this[arrNameSelected],
          ...this.arrFilters[arrNameFilter].map((o) => {
            return { ...o, selected: false };
          }),
        ];

        //quitar los elementos del arreglo original
        this[arrName] = this[arrName].filter(
          (item) =>
            !this.arrFilters[arrNameFilter].some((other) => other.id == item.id)
        );
        //limpiar input y arreglo de filtro
        this.arrFilters[arrNameFilter] = [];
        this.filters[arrNameFilter] = "";
      } else {
        this[arrNameSelected] = [
          ...this[arrNameSelected],
          ...this[arrName].map((o) => {
            return { ...o, selected: false };
          }),
        ];
        this[arrName] = [];
      }
    },

    quitAll(arrName, arrNameSelected, arrNameFilter) {
      if (
        this.arrFilters[arrNameFilter].length > 0 &&
        this.filters[arrNameFilter]
      ) {
        this[arrName] = [
          ...this[arrName],
          ...this.arrFilters[arrNameFilter].map((o) => {
            return { ...o, selected: false };
          }),
        ];

        //quitar los elementos del arreglo original
        this[arrNameSelected] = this[arrNameSelected].filter(
          (item) =>
            !this.arrFilters[arrNameFilter].some((other) => other.id == item.id)
        );
        //limpiar input y arreglo de filtro
        this.arrFilters[arrNameFilter] = [];
        this.filters[arrNameFilter] = "";
      } else {
        this[arrName] = [
          ...this[arrName],
          ...this[arrNameSelected].map((o) => {
            return { ...o, selected: false };
          }),
        ];
        this[arrNameSelected] = [];
      }
    },

    sendSelect(arrName, arrNameSelected, arrNameFilter) {
      if (
        this.arrFilters[arrNameFilter].length > 0 &&
        this.filters[arrNameFilter]
      ) {
        this[arrNameSelected] = [
          ...this[arrNameSelected],
          ...this.arrFilters[arrNameFilter]
            .filter((o) => o.selected === true)
            .map((o) => {
              return { ...o, selected: false };
            }),
        ];

        //quitar los elementos del arreglo original
        this[arrName] = this[arrName]
          .filter(
            (o) =>
              !this.arrFilters[arrNameFilter].some(
                (other) => other.id == o.id && other.selected === true
              )
          )
          .map((o) => {
            return { ...o, selected: false };
          });
        //limpiar input y arreglo de filtro
        this.arrFilters[arrNameFilter] = [];
        this.filters[arrNameFilter] = "";
      } else {
        this[arrNameSelected] = [
          ...this[arrNameSelected],
          ...this[arrName]
            .filter((o) => o.selected === true)
            .map((o) => {
              return { ...o, selected: false };
            }),
        ];
        this[arrName] = [...this[arrName].filter((o) => o.selected !== true)];
      }
    },

    quitSelect(arrName, arrNameSelected, arrNameFilter) {
      if (
        this.arrFilters[arrNameFilter].length > 0 &&
        this.filters[arrNameFilter]
      ) {
        this[arrName] = [
          ...this[arrName],
          ...this.arrFilters[arrNameFilter]
            .filter((o) => o.selected === true)
            .map((o) => {
              return { ...o, selected: false };
            }),
        ];

        //quitar los elementos del arreglo original
        this[arrNameSelected] = this[arrNameSelected]
          .filter(
            (o) =>
              !this.arrFilters[arrNameFilter].some(
                (other) => other.id == o.id && other.selected === true
              )
          )
          .map((o) => {
            return { ...o, selected: false };
          });
        //limpiar input y arreglo de filtro
        this.arrFilters[arrNameFilter] = [];
        this.filters[arrNameFilter] = "";
      } else {
        this[arrName] = [
          ...this[arrName],
          ...this[arrNameSelected]
            .filter((o) => o.selected === true)
            .map((o) => {
              return { ...o, selected: false };
            }),
        ];
        this[arrNameSelected] = [
          ...this[arrNameSelected].filter((o) => o.selected !== true),
        ];
      }
    },

    filterById(arrName, arrNameSelected, onlyDiferents = false) {
      const idsSet = new Set(this[arrName].map((item) => item.id));
      console.log(idsSet);
      this[arrNameSelected] = this[arrNameSelected].filter((item) =>
        onlyDiferents ? !idsSet.has(item.id) : idsSet.has(item.id)
      );
    },

    getProductId() {
      return this.$store
        .dispatch("general/getProductId", this.product.id ,{ root: true })
        .then((response) => {


          this.product = {
            id: response.data.data.id || null,
            name: response.data.data.name || "",
            code: response.data.data.code || "",
            stock: response.data.data.has_colors ? 0 : response.data.data.colors[0].stock,
            price: response.data.data.unit_cost || 0,
            category: {
              label: response.data.data.category.name,
              value: response.data.data.category.id,
            } || null,
            isProductFinal: response.data.data.is_final,
            hasColors: response.data.data.has_colors || false,
          };

          if (this.product.isProductFinal) {
            this.primaryProductSelected = response.data.data.compositions.map((o) => {
              return {
                ...o,
                selected: false,
              };
            });

            this.getPrimaryProduct();
          }
          if (this.product.hasColors) {

            this.colorCards = response.data.data.colors.map((o) => {
              return {
                id: o.id,
                name_color: o.name,
                stock: o.stock,
                hex_code: o.hex,
              };
            });
            console.log(this.colorCards);
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    getPrimaryProduct() {
      return this.$store
        .dispatch("general/getPrimaryProduct", { root: true })
        .then((response) => {
          this.primaryProduct = response.data.data.map((o) => {
            return {
              ...o,
              selected: false,
            };
          });
          console.log(this.primaryProduct);
          console.log(this.primaryProductSelected);
          this.filterById("primaryProductSelected", "primaryProduct", true);

        })
        .catch((error) => {})
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    getCategory() {
      return this.$store
        .dispatch("general/getCategory", { root: true })
        .then((response) => {
          this.categories = response.data.data.map((o) => {
            return {
              label: o.name,
              value: o.id,
            };
          });
        })
        .catch((error) => {})
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    searchData(query, arr, nameArrCopy) {
      const normalizeText = (text) =>
        text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      if (query) {
        const normalizedQuery = normalizeText(query);
        this.arrFilters[nameArrCopy] = arr.filter(
          (item) =>
            normalizeText(item.name).includes(normalizedQuery) ||
            normalizeText(item.category).includes(normalizedQuery)
        );
      } else {
        this.arrFilters[nameArrCopy] = [];
      }
    },

    transformPrimaryProduct() {
      return this.primaryProductSelected.map((o) => {
        return {
          id: o.id,
          quantity: o.quantity !== undefined ? o.quantity : 1,
        };
      });
    },

    onEdit() {
      //this.$q.loading.show();
      const payload = {
        id: this.product.id || null,
        code: this.product.code || "",
        name: this.product.name || "",
        stock: this.product.stock || 0,
        unit_cost: this.product.price || 0,
        category: this.product.category?.value || null,
        is_product_final: this.product.isProductFinal || false,
        has_colors: this.product.hasColors || false,
        compositions: this.transformPrimaryProduct() || [],
        colors: this.colorCards || [],
      };

      this.$store
        .dispatch("general/updatedProductId", payload, { root: true })
        .then((response) => {
          console.log(response);
          this.alertSuccess(response.data.msg);
          this.goTo("/product");
        })
        .catch((error) => {
          this.alertError(error.response.data.msg);
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
  },
}
</script>

<style lang="scss" scoped>

.q-field,
.q-color-picker {
  width: 100%;
  max-width: none;
}

.q-color-picker__footer {
    display: none;
}

</style>
