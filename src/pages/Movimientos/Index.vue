<template>
  <q-page class="bg-page q-gutter-md q-pa-xl">
    <q-card class="shadow-0 bg-page">
      <Title name="Movimientos de Inventario">
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
          @click="goTo('/ia-created-movement')"
          class="bg-primary text-white"
          icon="add"
          :rounded="!$q.screen.xs"
          :round="$q.screen.xs"
          flat
          :label="!$q.screen.xs ? 'Subir documento' : ''"
        >
        </q-btn>
        <q-btn
          v-if="!$q.screen.xs"
          @click="goTo('/created-movement')"
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
      v-if="filteredMovements?.length > 0 && !loading"
      class="bg-white"
      style="border-radius: 20px;"
    >
      <q-table
        :rows="filteredMovements"
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
                :class="col.name === 'direction' ? getTypeClass(col.value) : ''"
              >
                <span v-if="col.name === 'direction'">{{ col.value === 'input' ? 'Entrada' : 'Salida' }}</span>
                <span v-else-if="col.name === 'date'">{{ formatDate(col.value) }}</span>
                <span v-else-if="col.name === 'reason_type'">{{ col.value ? col.value.name : '' }}</span>
                <span v-else-if="col.name === 'supplier'">{{ col.value ? col.value.name : '' }}</span>
                <span v-else>{{ col.value }}</span>
              </q-td>
            </template>
            <q-td auto-width>
              <div class="q-gutter-sm items-center justify-center">
                <q-btn
                  @click="viewMovementDetails(props.row)"
                  icon="visibility"
                  class="bg-primary text-white"
                  size="sm"
                  round
                  flat
                >
                  <q-tooltip
                    v-if="!$q.screen.xs"
                    class="text-white text-center"
                  >
                    Ver detalles
                  </q-tooltip>
                </q-btn>
                <q-btn
                  @click="editMovement(props.row)"
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
                  @click="confirmDeleteMovement(props.row)"
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
            <q-card class="movement-card q-mb-md">
              <q-card-section :class="getTypeBgClass(props.row.direction)">
                <div class="text-h6">{{ props.row.direction === 'input' ? 'Entrada' : 'Salida' }}</div>
                <div class="text-subtitle2">{{ formatDate(props.row.date) }}</div>
              </q-card-section>

              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <!-- Tipo de movimiento con icono -->
                  <div class="col-12 q-py-sm">
                    <div class="row items-center">
                      <q-icon name="category" color="primary" size="sm" class="q-mr-sm" />
                      <div>Tipo: {{ props.row.reason_type ? props.row.reason_type.name : 'Sin tipo' }}</div>
                    </div>
                  </div>

                  <!-- Proveedor con icono -->
                  <div class="col-12 q-py-sm" v-if="props.row.supplier">
                    <div class="row items-center">
                      <q-icon name="store" color="primary" size="sm" class="q-mr-sm" />
                      <div>Proveedor: {{ props.row.supplier.name }}</div>
                    </div>
                  </div>

                  <!-- Nota/Referencia con icono -->
                  <div class="col-12 q-py-sm" v-if="props.row.notes">
                    <div class="row items-center">
                      <q-icon name="note" color="primary" size="sm" class="q-mr-sm" />
                      <div>{{ props.row.notes }}</div>
                    </div>
                  </div>

                  <!-- Cantidad de productos -->
                  <div class="col-12 q-py-sm">
                    <div class="row items-center">
                      <q-icon name="inventory" color="primary" size="sm" class="q-mr-sm" />
                      <div>{{ props.row.details ? props.row.details.length : 0 }} producto(s)</div>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="around">
                <q-btn
                  @click="viewMovementDetails(props.row)"
                  icon="visibility"
                  color="info"
                  label="Detalles"
                  flat
                  class="q-px-md"
                />
                <q-btn
                  @click="editMovement(props.row)"
                  icon="edit"
                  color="primary"
                  label="Editar"
                  flat
                  class="q-px-md"
                />
                <q-btn
                  @click="confirmDeleteMovement(props.row)"
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
          :max="Math.ceil(filteredMovements.length / pagination.rowsPerPage)"
          input
          input-class="text-black"
          color="black"
        />
      </div>
    </div>

    <EmptyState
      info="No se encontraron movimientos en la búsqueda"
      v-if="!filteredMovements?.length && !loading"
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
          @click="goTo('/create-movement')"
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
      title="Filtrar movimientos"
    >

    <q-input
        v-model="filters.search"
        placeholder="Buscar por nota o referencia..."
        outlined
        rounded
        clearable
        class="q-mb-md"
        bg-color="white"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="primary" />
        </template>
      </q-input>
    <q-input
        v-model="filters.dateFrom"
        type="date"
        label="Desde fecha"
        outlined
        rounded
        clearable
        class="q-mb-md"
        bg-color="white"
      />

      <q-input
        v-model="filters.dateTo"
        type="date"
        label="Hasta fecha"
        outlined
        rounded
        clearable
        class="q-mb-md"
        bg-color="white"
      />

      <q-select
        v-model="filters.direction"
        :options="directionOptions"
        label="Tipo de Movimiento"
        outlined
        rounded
        emit-value
        map-options
        clearable
        class="q-mb-md"
        bg-color="white"
      />

      <q-select
        v-model="filters.reasonType"
        :options="reasonTypeOptions"
        label="Tipo de movimiento"
        outlined
        rounded
        emit-value
        map-options
        clearable
        class="q-mb-md"
        bg-color="white"
      />

    </DrawerFilter>

    <!-- Diálogo de confirmación para eliminar -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="q-pa-sm">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-body1">¿Está seguro de eliminar este movimiento?</span>
        </q-card-section>

        <q-card-section class="q-pt-none text-grey-8">
          Esta acción no se puede deshacer y eliminará permanentemente este registro.
          Se actualizará el inventario correspondiente.
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="Cancelar" color="primary" outline v-close-popup />
          <q-btn
            label="Eliminar"
            color="negative"
            @click="deleteMovement"
            v-close-popup
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de detalles de movimiento -->
    <q-dialog v-model="showDetailsModal" persistent>
  <q-card class="modal-card" style="width: 800px; max-width: 95vw; border-radius: 12px;">
    <!-- Encabezado -->
    <q-card-section class="row items-center q-pa-md bg-primary text-white">
      <div class="text-h6">Detalles del Movimiento</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup color="white" aria-label="Cerrar diálogo" />
    </q-card-section>

    <!-- Contenido -->
    <q-card-section v-if="selectedMovement" class="q-pa-md">
      <div class="row q-col-gutter-lg">
        <!-- Columna izquierda -->
        <div class="col-12 col-md-6">
          <q-list dense>
            <q-item class="q-mb-sm">
              <q-item-section avatar>
                <q-icon
                  name="swap_horiz"
                  :color="selectedMovement.direction === 'input' ? 'positive' : 'negative'"
                  size="sm"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Tipo de Movimiento</q-item-label>
                <q-item-label class="text-weight-medium">{{
                  selectedMovement.direction === 'input' ? 'Entrada' : 'Salida'
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
              <q-item-section avatar>
                <q-icon name="category" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Tipo de movimiento</q-item-label>
                <q-item-label class="text-weight-medium">{{
                  selectedMovement.reason_type ? selectedMovement.reason_type.name : 'Sin tipo'
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
              <q-item-section avatar>
                <q-icon name="event" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Fecha</q-item-label>
                <q-item-label class="text-weight-medium">{{
                  formatDate(selectedMovement.date)
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Columna derecha -->
        <div class="col-12 col-md-6">
          <q-list dense>
            <q-item v-if="selectedMovement.supplier" class="q-mb-sm">
              <q-item-section avatar>
                <q-icon name="store" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Proveedor</q-item-label>
                <q-item-label class="text-weight-medium">{{
                  selectedMovement.supplier.name
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedMovement.created_by" class="q-mb-sm">
              <q-item-section avatar>
                <q-icon name="person" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Creado por</q-item-label>
                <q-item-label class="text-weight-medium">{{
                  selectedMovement.created_by
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedMovement.notes" class="q-mb-sm">
              <q-item-section avatar>
                <q-icon name="note" color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Notas</q-item-label>
                <q-item-label class="text-weight-medium">{{
                  selectedMovement.notes
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <!-- Separador -->
      <q-separator class="q-my-lg" />

      <!-- Tabla de detalles -->
      <div class="text-h6 q-mb-md">Detalle de productos</div>
      <q-table
        :rows="selectedMovement.details || []"
        :columns="detailColumns"
        dense
        flat
        row-key="id"
        class="custom-table"
        :pagination="{ rowsPerPage: 0 }"
        wrap-cells
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-grey-2">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" class="hover-row">
            <q-td key="product" :props="props">
              {{ props.row.primary_product ? props.row.primary_product.name : 'Sin producto' }}
            </q-td>
            <q-td key="color" :props="props">
              {{ props.row.product_color ? props.row.product_color.name : 'N/A' }}
            </q-td>
            <q-td key="quantity" :props="props" class="text-right">
              {{ props.row.quantity }}
            </q-td>
            <q-td key="unit_price" :props="props" class="text-right">
              {{ formatCurrency(props.row.unit_price) }}
            </q-td>
            <q-td key="total_price" :props="props" class="text-right text-weight-bold">
              {{ formatCurrency(props.row.total_price) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- Total -->
      <div class="row justify-end q-mt-lg">
        <div class="text-subtitle1 q-mr-md text-weight-bold">Total:</div>
        <div class="text-subtitle1 text-weight-bold text-primary">{{
          calculateTotalMovement(selectedMovement)
        }}</div>
      </div>
    </q-card-section>

    <!-- Acciones -->
    <q-card-actions align="right" class="q-pa-md bg-grey-1">
      <q-btn
        flat
        label="Cerrar"
        color="primary"
        v-close-popup
        class="q-px-lg"
        unelevated
        aria-label="Cerrar diálogo"
      />
    </q-card-actions>
  </q-card>
</q-dialog>
  </q-page>
</template>

<script>
import MethodsMixin from "src/mixins/MethodsMixin.js";
import Title from 'components/elements/Title.vue'
import DrawerFilter from "components/elements/DrawerFilter.vue";
import EmptyState from "components/EmptyState.vue";
import { date } from 'quasar';

export default {
  components: {
    Title,
    DrawerFilter,
    EmptyState
  },

  mixins: [MethodsMixin],

  data() {
    return {
      fabPos: [18, 18],
      drawerFilter: false,
      movements: [],
      loading: false,
      deleting: false,
      deleteDialog: false,
      selectedMovement: null,
      visibleColumns: ["direction", "date", "quantity", "supplier", "total_price", "reason_type"],
      columns: [
        {
          name: "direction",
          label: "Tipo de Movimiento",
          align: "left",
          field: "direction",
          sortable: true
        },
        {
          name: "reason_type",
          label: "Razón de Movimiento",
          align: "left",
          field: "reason_type",
          sortable: true
        },
        {
          name: "quantity",
          label: "Cantidad de Registros",
          align: "left",
          field: row => row.details ? row.details.length : 0,
          sortable: true
        },
        {
          name: "total_price",
          label: "Precio Total",
          align: "left",
          field: "total_price"
        },
        {
          name: "date",
          label: "Fecha",
          align: "left",
          field: "date",
          sortable: true,
          sort: (a, b) => new Date(a) - new Date(b)
        },
      ],
      detailColumns: [
        {
          name: "product",
          label: "Producto",
          align: "left",
          field: row => row.primary_product ? row.primary_product.name : 'Sin producto'
        },
        {
          name: "color",
          label: "Color",
          align: "left",
          field: row => row.product_color ? row.product_color.name : 'N/A'
        },
        {
          name: "quantity",
          label: "Cantidad",
          align: "right",
          field: "quantity"
        },
        {
          name: "unit_price",
          label: "Precio Unitario",
          align: "right",
          field: "unit_price"
        },
        {
          name: "total_price",
          label: "Precio Total",
          align: "right",
          field: "total_price"
        }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'date',
        descending: true
      },
      filters: {
        search: '',
        direction: null,
        reasonType: null,
        supplier: null,
        dateFrom: '',
        dateTo: ''
      },
      directionOptions: [
        { label: 'Entrada', value: 'input' },
        { label: 'Salida', value: 'output' }
      ],
      reasonTypeOptions: [],
      supplierOptions: [],
      showDetailsModal: false
    };
  },

  async mounted() {
    await this.fetchMovements();
    await this.fetchReasonTypes();
    await this.fetchSuppliers();
  },

  computed: {
    filteredMovements() {
      let result = [...this.movements];

      // Filtro por término de búsqueda
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        result = result.filter(movement => {
          return movement.notes?.toLowerCase().includes(searchTerm);
        });
      }

      // Filtro por Tipo de Movimiento
      if (this.filters.direction) {
        result = result.filter(movement => movement.direction === this.filters.direction);
      }

      // Filtro por tipo de razón
      if (this.filters.reasonType) {
        result = result.filter(movement =>
          movement.reason_type && movement.reason_type.id === this.filters.reasonType
        );
      }

      // Filtro por proveedor
      if (this.filters.supplier) {
        result = result.filter(movement =>
          movement.supplier && movement.supplier.id === this.filters.supplier
        );
      }

      // Filtro por fecha desde
      if (this.filters.dateFrom) {
        const fromDate = new Date(this.filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        result = result.filter(movement => {
          const movDate = new Date(movement.date);
          return movDate >= fromDate;
        });
      }

      // Filtro por fecha hasta
      if (this.filters.dateTo) {
        const toDate = new Date(this.filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        result = result.filter(movement => {
          const movDate = new Date(movement.date);
          return movDate <= toDate;
        });
      }

      return result;
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
    async fetchMovements() {
      this.loading = true;
      return this.$store
        .dispatch("movement/getMovement", { root: true })
        .then((response) => {
          if (response.data.status === 'OK') {
            this.movements = response.data.data;
          } else {
            this.alertError(response.data.msg || 'Error al cargar movimientos');
          }
        })
        .catch((error) => {
          this.alertError(error?.response?.data?.msg || 'Error al cargar movimientos');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async fetchReasonTypes() {
      return this.$store
        .dispatch("movement/getReasonTypes", { root: true })
        .then((response) => {
          if (response.data.status === 'OK') {
            this.reasonTypeOptions = response.data.data.map(type => ({
              label: type.name,
              value: type.id
            }));
          }
        })
        .catch((error) => {
          console.error('Error al cargar tipos de razón:', error);
        });
    },

    async fetchSuppliers() {
      return this.$store
        .dispatch("provedores/getSupplier", { root: true })
        .then((response) => {
          if (response.data.status === 'OK') {
            this.supplierOptions = response.data.data.map(supplier => ({
              label: supplier.name,
              value: supplier.id
            }));
          }
        })
        .catch((error) => {
          this.alertError(error?.response?.data?.msg || 'Error al cargar proveedores');
        });
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString('es-PE', { timeZone: 'UTC' });
    },

    formatCurrency(value) {
      if (value === undefined || value === null) return '';
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(value);
    },

    calculateTotalMovement(movement) {
      if (!movement.details || movement.details.length === 0) {
        return this.formatCurrency(0);
      }

      const total = movement.details.reduce((sum, item) => {
        return sum + parseFloat(item.total_price || 0);
      }, 0);

      return this.formatCurrency(total);
    },

    getTypeClass(type) {
      return type === 'input' ? 'text-positive' : 'text-negative';
    },

    getTypeBgClass(type) {
      return type === 'input' ? 'bg-positive text-white' : 'bg-negative text-white';
    },

    onCloseDrawer() {
      this.drawerFilter = false;
    },

    onOpenDrawer() {
      this.drawerFilter = true;
    },

    viewMovementDetails(movement) {
      this.selectedMovement = movement;
      this.showDetailsModal = true;
    },

    editMovement(movement) {
      this.goTo(`/edit-movement/${movement.id}`);
    },

    confirmDeleteMovement(movement) {
      this.selectedMovement = movement;
      this.deleteDialog = true;
    },

    async deleteMovement() {
  this.deleting = true;
  try {
    const result = await this.$store.dispatch('movement/deleteMovement', this.selectedMovement.id);
    const response = result.data;
    console.log('Response:', response);
    if (response.status === 'OK') {
      await this.fetchMovements();
      this.alertSuccess('Movimiento eliminado correctamente');
    } else {
      this.alertError(response.msg || 'Error al eliminar el movimiento');
    }
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    this.alertError(error?.response?.data?.msg || 'Error al eliminar el movimiento');
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
.modal-card {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.custom-table {
  max-height: 300px;
  overflow-y: auto;
}

.custom-table .hover-row:hover {
  background-color: #f5f5f5;
}

.text-weight-medium {
  font-weight: 500;
}

.movement-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.movement-card:active {
  transform: scale(0.98);
}

/* Aplicar una sombra sutil */
.movement-card {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

/* Mejorar aspecto de los botones en las tarjetas */
.movement-card .q-card-actions .q-btn {
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

/* Estilo para tipo entrada/salida */
.text-positive {
  color: #21BA45 !important;
  font-weight: bold;
}

.text-negative {
  color: #C10015 !important;
  font-weight: bold;
}
</style>
