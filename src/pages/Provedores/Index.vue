<template>
  <q-page class="bg-page q-gutter-md q-pa-xl">
    <q-card class="shadow-0 bg-page">
      <Title name="Mis Proveedores">
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
          @click="goTo('/created-provider')"
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
      v-if="filteredSuppliers?.length > 0 && !loading"
      class="bg-white"
      style="border-radius: 20px;"
    >
      <q-table
        :rows="filteredSuppliers"
        :loading="loading"
        :columns="columns"
        :visible-columns="visibleColumns"
        row-key="id"
        virtual-scroll
        :grid="$q.screen.xs"
        v-model:pagination="pagination"
        :rows-per-page-options="[10]"
        flat
      >
        <template v-slot:header="props" v-if="!$q.screen.xs">
          <q-tr class="text-black text-upercase" :props="props" style="border-radius: 200px;">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th auto-width>Acciones</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr class="border-card rounded-10 q-my-sm" :props="props">
            <template v-for="col in props.cols" :key="col.name">
              <q-td
                :props="props"
              >
                {{ col.value }}
              </q-td>
            </template>
            <q-td auto-width>
              <div class="q-gutter-sm items-center justify-center">
                <q-btn
                  @click="viewSupplierProduct(props.row)"
                  icon="inventory_2"
                  class="bg-primary text-white"
                  size="sm"
                  round
                  flat
                >
                  <q-tooltip
                    v-if="!$q.screen.xs"
                    class="text-white text-center"
                  >
                    Productos que me ofrecen
                  </q-tooltip>
                </q-btn>
                <q-btn
                  @click="editSupplier(props.row)"
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
                <q-btn
                  @click="confirmDeleteSupplier(props.row)"
                  icon="delete"
                  class="bg-negative text-white"
                  size="sm"
                  round
                  flat
                >
                  <q-tooltip
                    v-if="!$q.screen.xs"
                    class="text-white text-center"
                  >
                    Eliminar
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:item="props">
  <div class="q-pa-md">
    <q-card class="supplier-card q-mb-md">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ props.row.company_name }}</div>
        <div class="text-subtitle2">{{ props.row.contact_name }}</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <!-- Teléfono con icono -->
          <div class="col-12 q-py-sm">
            <div class="row items-center">
              <q-icon name="phone" color="primary" size="sm" class="q-mr-sm" />
              <div>{{ props.row.phone }}</div>
            </div>
          </div>

          <!-- Email con icono -->
          <div class="col-12 q-py-sm">
            <div class="row items-center">
              <q-icon name="email" color="primary" size="sm" class="q-mr-sm" />
              <div>{{ props.row.email }}</div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="around">
        <q-btn
          @click="viewSupplierProduct(props.row)"
          icon="inventory_2"
          color="info"
          label="Productos"
          flat
          class="q-px-md"
        />
        <q-btn
          @click="editSupplier(props.row)"
          icon="edit"
          color="primary"
          label="Editar"
          flat
          class="q-px-md"
        />
        <q-btn
          @click="confirmDeleteSupplier(props.row)"
          icon="delete"
          color="negative"
          label="Eliminar"
          flat
          class="q-px-md"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
      </q-table>

      <div class="flex flex-center" style="padding: 10px;">
        <q-pagination
          v-model="pagination.page"
          :max="Math.ceil(filteredSuppliers.length / pagination.rowsPerPage)"
          input
          input-class="text-black"
          color="black"
        />
      </div>
    </div>

    <EmptyState
      info="No se encontraron proveedores en la búsqueda"
      v-if="!filteredSuppliers?.length && !loading"
    >
    </EmptyState>

    <q-page-sticky v-if="$q.screen.xs" position="bottom-right" :offset="fabPos">
      <div class="column q-gutter-y-sm" v-touch-pan.prevent.mouse="moveFab">
        <q-btn
          :disable="loading"
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
          :disable="loading"
          v-if="$q.screen.xs"
          @click="goTo('/created-provider')"
          color="primary"
          icon="add"
          :size="$q.screen.xs ? 'md' : 'lg'"
          round
        >
        </q-btn>
      </div>
    </q-page-sticky>

    <DrawerFilter
      :loading="loading"
      :isOpen="drawerFilter"
      @closeDrawer="onCloseDrawer"
      title="Filtrar proveedores"
    >
      <q-input
        v-model="filters.search"
        placeholder="Buscar por nombre, contacto, compañía o email..."
        outlined
        dense
        clearable
        class="q-mb-md"
        bg-color="white"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="primary" />
        </template>
      </q-input>
    </DrawerFilter>

    <!-- Diálogo de confirmación para eliminar -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="q-pa-sm">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-body1">¿Está seguro de eliminar este proveedor?</span>
        </q-card-section>

        <q-card-section class="q-pt-none text-grey-8">
          Esta acción no se puede deshacer y eliminará todos los datos asociados a <strong>{{ selectedSupplier?.name }}</strong>.
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="Cancelar" color="primary" outline v-close-popup />
          <q-btn
            label="Eliminar"
            color="negative"
            @click="deleteSupplier"
            v-close-popup
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <SupplierProductModal
      v-model:show="showProductsModal"
      :supplier="currentSupplier"
    />

  </q-page>
</template>

<script>
import MethodsMixin from "src/mixins/MethodsMixin.js";
import Title from 'components/elements/Title.vue'
import DrawerFilter from "components/elements/DrawerFilter.vue";
import EmptyState from "components/EmptyState.vue";
import SupplierProductModal from "components/supplier/SupplierProduct.vue";

export default {
  components: {
    Title,
    DrawerFilter,
    EmptyState,
    SupplierProductModal
  },

  mixins: [MethodsMixin],

  data() {
    return {
      fabPos: [18, 18],
      drawerFilter: false,
      suppliers: [],
      loading: false,
      deleting: false,
      deleteDialog: false,
      selectedSupplier: null,
      visibleColumns: ["ruc" ,"contact_name", "company_name", "phone", "email"],
      columns: [
        { name: "company_name", label: "Compañía", align: "left", field: "company_name" },
        { name: "ruc", label: "RUC", align: "left", field: "ruc" },
        { name: "contact_name", label: "Nombre de Contacto", align: "left", field: "contact_name" },
        { name: "phone", label: "Teléfono", align: "left", field: "phone" },
        { name: "email", label: "Email", align: "left", field: "email" },
      ],
      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      filters: {
        search: '',
      },
      showProductsModal: false,
      currentSupplier: null
    };
  },

  mounted() {
    this.fetchSuppliers();
  },

  computed: {
    filteredSuppliers() {
      if (!this.filters.search) {
        return this.suppliers;
      }

      const searchTerm = this.filters.search.toLowerCase();
      return this.suppliers.filter(supplier => {
        return supplier.name?.toLowerCase().includes(searchTerm) ||
               supplier.contact_name?.toLowerCase().includes(searchTerm) ||
               supplier.company_name?.toLowerCase().includes(searchTerm) ||
               supplier.email?.toLowerCase().includes(searchTerm);
      });
    },
    quantityFilter() {
      let count = 0;
      for (const key in this.filters) {
        if (this.filters[key] !== null && this.filters[key] !== '') {
          count++;
        }
      }
      return count;
    },
  },

  methods: {
    async fetchSuppliers() {
      this.loading = true;
      return this.$store
        .dispatch("provedores/getSupplier", { root: true })
        .then((response) => {
          this.suppliers = response.data.data;
        })
        .catch((error) => {
          this.alertError(error?.response?.data?.msg || 'Error al cargar proveedores');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onCloseDrawer() {
      this.drawerFilter = false;
    },

    onOpenDrawer() {
      this.drawerFilter = true;
    },

    viewSupplierProduct(supplier) {
      this.currentSupplier = supplier;
      this.showProductsModal = true;
      console.log(this.showProductsModal);
    },

    editSupplier(supplier) {
      // Implementar edición
      console.log('Editar proveedor:', supplier);
      // Redirigir a página de edición
      this.goTo(`/edit-provider/${supplier.id}`);
    },

    confirmDeleteSupplier(supplier) {
      this.selectedSupplier = supplier;
      this.deleteDialog = true;
    },

    async deleteSupplier() {
      this.deleting = true;
      try {
        // Implementar eliminación
        console.log('Eliminar proveedor:', this.selectedSupplier);
        // Recargar lista después de eliminar
        await this.fetchSuppliers();
        this.alertSuccess('Proveedor eliminado correctamente');
      } catch (error) {
        console.error('Error deleting supplier:', error);
        this.alertError('Error al eliminar el proveedor');
      } finally {
        this.deleting = false;
      }
    },

    moveFab(ev) {
      this.fabPos = [this.fabPos[0] - ev.delta.x, this.fabPos[1] - ev.delta.y];
    },
  }
};
</script>

<style>
.supplier-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.supplier-card:active {
  transform: scale(0.98);
}

/* Aplicar una sombra sutil */
.supplier-card {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

/* Mejorar aspecto de los botones en las tarjetas */
.supplier-card .q-card-actions .q-btn {
  border-radius: 8px;
  font-weight: 500;
}

/* Espaciado mejorado para las tarjetas */
.q-table__grid-item {
  padding: 8px !important;
}
.q-table__container {
    position: relative;
    padding: 10px;
    border-radius: 20px;
}

.q-table__bottom {
    display: none;
}

.border-card {
    border-bottom: 1px solid #f1f1f1;
}

.rounded-10 {
    border-radius: 10px;
}
</style>
