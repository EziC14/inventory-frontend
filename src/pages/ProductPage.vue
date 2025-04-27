<template>
  <q-page class="bg-page q-gutter-md q-pa-xl">
    <q-card class="shadow-0 bg-page">
      <Title name="Mis Productos">
        <q-btn
          v-if="!$q.screen.xs"
          @click="onOpenDrawer"
          color="primary"
          class=""
          icon="filter_list"
          :rounded="!$q.screen.xs"
          :round="$q.screen.xs"
          outline
          :label="!$q.screen.xs ? 'filtros' : ''"
        >
          <q-badge rounded color="orange" floating>{{
            quantityFilter
          }}</q-badge>
        </q-btn>
        <q-btn
          v-if="!$q.screen.xs"
          @click="goTo('/created-product')"
          class="bg-primary text-white"
          icon="add"
          :rounded="!$q.screen.xs"
          :round="$q.screen.xs"
          flat
          :label="!$q.screen.xs ? 'nuevo' : ''"
        >
        </q-btn>
      </Title>
    </q-card>

    <div
      v-if="
        getProductos?.length > 0 && !isLoadingSection && !isLoadingFilter
      "
      class="bg-white"
      style="border-radius: 20px;"
    >
      <q-table
        :rows="getProductos"
        :loading="datatable.loading"
        :columns="datatable.columns"
        :visible-columns="datatable.visible"
        row-key="id"
        virtual-scroll
        :grid="$q.screen.xs"
        v-model:pagination="datatable.pagination"
        :rows-per-page-options="[10]"
        flat
      >
        <template v-slot:header="props" v-if="!$q.screen.xs">
          <q-tr class=" text-black text-upercase" :props="props" style="border-radius: 200px;">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" >
              {{ col.label }}
            </q-th>
            <q-th auto-width>Acciones</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr class="border-card rounded-10 q-my-sm" :props="props">
            <template v-for="col in props.cols" :key="col.name">
              <q-td
                v-if="col.name != 'type'"
                :key="col.name"
                :props="props"
              >
                <template
                  v-if="!Object.prototype.hasOwnProperty.call(col, 'tooltip')"
                >
                  {{ col.value }}
                </template>
                <template v-else>
                  {{ col.value }}
                  <q-tooltip v-if="!$q.screen.xs">
                    {{ col.tooltip(props.row[col.name]) }}
                  </q-tooltip>
                </template>
              </q-td>
              <!-- PERSONALIZADO -->
              <q-td
                v-if="col.name == 'type'"
                key="type"
                class="row items-center justify-start"
                :props="props"
              >
                <q-badge
                  rounded
                  :class="`'q-py-md q-px-md text-caption text-weight-medium type-product-${col.value}`"
                  :label="this.$filters.typeProduct(col.value)"
                />
              </q-td>
            </template>
            <q-td auto-width>
              <div class="q-gutter-sm row items-center justify-center">
                <q-btn
                  @click="onEdit(props.row)"
                  icon="edit"
                  class="bg-primary text-white"
                  size="sm"
                  round
                  flat
                >
                  <q-tooltip
                    v-if="!$q.screen.xs"
                    class="text-white text-center"
                  >
                    Editar
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:item="props">
          <div class="q-table__grid-item col-xs-12">
            <div class="q-table__grid-item-card q-table__card shadow-0">
              <div
                class="q-table__grid-item-row"
                v-for="col in props.cols"
                :key="col.name"
              >
                <div class="q-table__grid-item-title">
                  {{ col.label }}
                </div>
                <div
                  v-if="col.name !== 'type'"
                  class="q-table__grid-item-value"
                >
                  {{ col.value }}
                </div>

                <div
                  v-if="col.name === 'type'"
                  class="q-table__grid-item-value"
                >
                  <q-badge
                    outline
                    :class="`'text-caption text-weight-medium type-product-${col.value}`"
                    :label="this.$filters.typeProduct(col.value)"
                  />
                </div>
              </div>
              <div class="q-table__grid-item-row">
                <div class="q-table__grid-item-title">Acciones</div>
                <div class="q-table__grid-item-value">
                  <div class="q-gutter-sm">
                    <q-btn
                      @click="onEdit(props.row)"
                      icon="edit"
                      color="primary"
                      size="sm"
                      round
                    >
                      <q-tooltip
                        v-if="!$q.screen.xs"
                        class="text-white text-center"
                      >
                        Editar
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </q-table>

      <div class="flex flex-center" style="padding: 10px;">
        <q-pagination
          v-model="datatable.pagination.page"
          :max="Math.ceil(getProductos.length / datatable.pagination.rowsPerPage)"
          input
          input-class="text-black"
          color="black"
        />
      </div>
    </div>

    <EmptyState
      info="No se encontraron planificaciones en la búsqueda"
      v-if="
        !getProductos?.length && !isLoadingSection && !isLoadingFilter
      "
    >
    </EmptyState>

    <q-page-sticky v-if="$q.screen.xs" position="bottom-right" :offset="fabPos">
      <div class="column q-gutter-y-sm" v-touch-pan.prevent.mouse="moveFab">
        <q-btn
          :disable="isLoadingSection || isLoadingFilter"
          @click="onOpenDrawer"
          color="secondary"
          icon="filter_list"
          round
          :label="!$q.screen.xs ? 'filtros' : ''"
        >
          <q-badge rounded color="primary" floating>{{
            quantityFilter
          }}</q-badge>
        </q-btn>
        <q-btn
          :disable="isLoadingSection || isLoadingFilter"
          v-if="$q.screen.xs"
          @click="goTo('/planificaciones/create')"
          color="primary"
          icon="add"
          :size="$q.screen.xs ? 'md' : 'lg'"
          round
        >
        </q-btn>
      </div>
    </q-page-sticky>

    <DrawerFilter
      :loading="isLoadingFilter"
      :isOpen="drawerFilter"
      @closeDrawer="onCloseDrawer"
      title="Filtrar planificaciones"
    >
      <SelectInput
        bg="info"
        :isRounded="true"
        class="col-12 col-md-6"
        labelBody="Categoría"
        :text="filters.category"
        :options="categories"
        :rounded="true"
        :isRequired="false"
        @change-name="(e) => (filters.category = e)"
        @update:model-value="onChangeFilters"
      />

      <SelectInput
        bg="info"
        :isRounded="true"
        class="col-12 col-md-6"
        labelBody="Tipo de producto"
        :text="filters.type"
        :options="type_product"
        :rounded="true"
        optionLabel="label"
        :isRequired="false"
        @change-name="(e) => (filters.type = e)"
        @update:model-value="onChangeFilters"
      />
    </DrawerFilter>
  </q-page>
</template>

<script>
import MethodsMixin from "src/mixins/MethodsMixin.js";
import Title from 'components/elements/Title.vue'
import DrawerFilter from "components/elements/DrawerFilter.vue";
import SelectInput from "components/inputs/Select.vue";
import { mapGetters, mapActions } from "vuex";
import EmptyState from "components/EmptyState.vue";

export default {
  components: {
    Title,
    DrawerFilter,
    SelectInput,
    EmptyState,
  },

  mixins: [MethodsMixin],
  data() {
    return {
      fabPos: [18, 18],
      drawerFilter: false,
      products: [],
      datatable: {
        search: null,
        loading: false,
        visible: ["id", "code", "name", 'type',"category", "unit_cost", "total_stock"],
        columns: [
          { name: "code", label: "Código", align: "left", field: "code" },
          { name: "name", label: "Nombre", align: "left", field: "name" },
          { name : "type", label: "Tipo de producto", align: "left", field: "type" },
          { name: "category", label: "Categoría", align: "left", field: "category" },
          { name: "unit_cost", label: "Costo unitario", align: "left", field: "unit_cost" },
          { name: "total_stock", label: "Stock total", align: "left", field: "total_stock" },
        ],
        rows: [],
        pagination: {
          page: 1,
          rowsPerPage: 10,
        },
      },
      planning: {
        id: null,
      },
      isLoadingFilter: false,
      isLoadingSection: false,
      sedes: [],
      types: [],
      trainers: [],
      type_product: [
        { label: "Primario", value: "PRI" },
        { label: "Final", value: "FIN" },
      ],

      filters: {
        category: null,
        type: null,
      },
      categories : [],

      confirmModal: {
        isOpen: false,
        title: null,
        info: null,
      },
    };
  },

  mounted() {
    this.onLoad();
  },

  computed: {
    ...mapGetters("general", [
      "getTypeEvents",
      "getSedesState",
      "getProductos",
    ]),
    quantityFilter() {
      let count = 0;
      for (const key in this.filters) {
        if (this.filters[key] !== null) {
          count++;
        }
      }
      return count;
    },
  },

  methods: {

    onLoad() {
      this.isLoadingSection = true;
      // this.$q.loading.show();
      Promise.all([this.getProduct(), this.getCategory()])
        .then(() => {
          // this.$q.loading.hide();
        })
        .finally(() => {
          this.isLoadingSection = false;
        });
    },

    onCloseDrawer() {
      this.drawerFilter = false;
    },
    onOpenDrawer() {
      this.drawerFilter = true;
    },

    onPageChange(page) {
      this.datatable.pagination.page = page;
    },

    getProducts() {
      return this.$store
        .dispatch("general/getProducts", { root: true })
        .then((response) => {
          getProductos = response.data.data;
          console.log(getProductos);
        })
        .catch((error) => {
          this.alertError(error.response.data.msg);
        });
    },

    onEdit(row) {
      this.goTo(`/edit-product/${row.id}`);
    },

    onChangeFilters() {
      this.filterData();
    },

    filterData(data) {
      this.$nextTick(() => {
        const copyFilters = { ...this.filters };
        console.log(data);
        if (data) {
          this.filters = { ...data };
        } else {
          this.filters.category = this.filters?.category?.value;
          this.filters.type = this.filters?.type?.value;
        }

        const payload = {
          ...this.filters,
        };
        const query = this.queryFilter(payload);
        console.log(query);
        this.getProductsFilter(query);
        this.filters = { ...copyFilters };
      });
    },
    queryFilter(payload) {
      const search = this.datatable.filter;
      const { type, category } = payload;
      const queryObj = {};

      if (category) {
        queryObj["category"] = category;
      }

      if (type) {
        queryObj["type"] = type;
      }

      if (search) {
        queryObj["search"] = search;
      }

      return this.objToQueryString(queryObj);
    },

    getProductsFilter(query) {
      this.isLoadingFilter = true;
      this.datatable.loading = true;
      this.$store
        .dispatch("general/getProductsFilter", query, { root: true })
        .then((response) => {})
        .catch((error) => {
          // this.alertError(error.response.data.msg);
        })
        .finally(() => {
          this.datatable.loading = false;
          this.isLoadingFilter = false;
        });
    },

    getProduct() {
      this.datatable.loading = true;
      return this.$store
        .dispatch("general/getProduct", { root: true })
        .then((response) => {})
        .catch((error) => {})
        .finally(() => {
          this.datatable.loading = false;
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

    moveFab(ev) {
      this.fabPos = [this.fabPos[0] - ev.delta.x, this.fabPos[1] - ev.delta.y];
    },
  },
};
</script>

<style>
.q-table__container {
    position: relative;
    padding: 10px;
    border-radius: 20px;
}

.q-table__bottom {
    display: none;
}
</style>
