<!-- SupplierProductsModal.vue -->
<template>
  <q-dialog v-model="localShow" persistent>
    <q-card style="width: 850px; max-width: 95vw; border-radius: 12px;">
      <q-card-section class="row items-center bg-primary text-white q-py-md">
        <div class="text-h6">
          <q-icon name="inventory_2" class="q-mr-sm" />
          Productos de {{ supplier?.company_name || 'proveedor' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup text-color="white" />
      </q-card-section>

      <q-card-section class="q-pt-md bg-white">
        <div v-if="!supplier?.products?.length" class="text-center q-pa-xl">
          <q-icon name="inventory_2" size="64px" color="grey-5" />
          <div class="text-grey-6 q-mt-sm text-h6">No hay productos disponibles</div>
        </div>
        <div v-else>
          <!-- Buscador con estilo -->
          <div class="q-mb-lg">
            <q-input
              v-model="searchQuery"
              outlined
              dense
              placeholder="Buscar producto por nombre, código o categoría..."
              bg-color="white"
              class="search-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-slot:append v-if="searchQuery">
                <q-icon name="clear" class="cursor-pointer" @click="searchQuery = ''" />
              </template>
            </q-input>
          </div>

          <!-- Lista de productos mejorada -->
          <div class="row q-col-gutter-md">
            <div v-for="product in paginatedProducts" :key="product.id" class="col-12 col-sm-6 col-md-4">
              <q-card class="product-card">
                <!-- Encabezado de la tarjeta -->
                <div class="card-header">
                  <div class="category-badge">
                    <q-icon name="category" size="xs" class="q-mr-xs" />
                    {{ product.category }}
                  </div>
                </div>

                <!-- Contenido de la tarjeta -->
                <q-card-section class="q-pb-xs q-pt-xs">
                  <div class="text-subtitle1 product-title">{{ product.name }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <div class="row items-center justify-between q-mt-xs">
                    <div class="product-code">
                      <q-icon name="qr_code" size="xs" class="q-mr-xs" />
                      {{ product.code }}
                    </div>

                    <div class="product-price" v-if="product.unit_cost">
                      {{ formatCurrency(product.unit_cost) }}
                    </div>
                    <div class="no-price" v-else>
                      Sin precio
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Paginación mejorada -->
          <div class="text-center q-mt-lg" v-if="filteredProducts.length > itemsPerPage">
            <q-pagination
              v-model="currentPage"
              :max="Math.ceil(filteredProducts.length / itemsPerPage)"
              :max-pages="5"
              boundary-numbers
              direction-links
              color="primary"
              class="shadow-1 bg-white"
            />
          </div>

          <!-- Contador de resultados -->
          <div class="text-caption text-grey-7 q-mt-md text-center">
            Mostrando {{ filteredProducts.length }} productos
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white q-py-md">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'SupplierProductsModal',

  props: {
    supplier: {
      type: Object,
      default: () => null
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localShow: false,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 9, // Mostrar 9 productos por página para ver más de un vistazo
    }
  },

  computed: {
    filteredProducts() {
      if (!this.supplier || !this.supplier.products) return [];

      let filtered = this.supplier.products;

      // Filtrar por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query)
        );
      }

      return filtered;
    },

    paginatedProducts() {
      // Aplicar paginación
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
    }
  },

  methods: {
    formatCurrency(value) {
      if (!value) return '0.00';
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
      }).format(value);
    }
  },

  watch: {
    show: {
      immediate: true,
      handler(newVal) {
        this.localShow = newVal;
        if (newVal) {
          this.searchQuery = '';
          this.currentPage = 1;
        }
      }
    },
    searchQuery() {
      // Reset pagination when searching
      this.currentPage = 1;
    },
    localShow(newVal) {
      this.$emit('update:show', newVal);
    }
  }
}
</script>

<style lang="scss" scoped>
.product-card {
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  background: linear-gradient(to right, rgba(var(--q-primary-rgb), 0.05), transparent);
  padding: 5px 5px;
  border-bottom: 1px solid rgba(var(--q-primary-rgb), 0.1);
}

.category-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--q-primary);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 3px 10px;
  border-radius: 12px;
}

.category-tag {
  display: inline-block;
  background-color: rgba(var(--q-primary-rgb), 0.15);
  color: var(--q-primary);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 0px;
  border-radius: 12px;
}

.product-title {
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

}

.product-code {
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 2px 6px;
  display: inline-flex;
  align-items: center;
}

.product-price {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--q-primary);
}

.no-price {
  font-style: italic;
  color: #999;
  font-size: 0.9rem;
}

.search-input {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .q-field__control {
    background-color: white;
  }
}
</style>
