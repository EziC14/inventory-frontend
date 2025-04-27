<template>
  <q-card class="supplier-card" style="width: 100%;">
    <q-card-section>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5 text-primary">Resumen del Proveedor</div>
        <q-badge outline color="primary">{{ supplier.id }}</q-badge>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Nombre del Proveedor</div>
          <div class="text-subtitle1">{{ supplier.name || 'No especificado' }}</div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Nombre de la Empresa</div>
          <div class="text-subtitle1">{{ supplier.company_name || 'No especificado' }}</div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Nombre de Contacto</div>
          <div class="text-subtitle1">{{ supplier.contact_name || 'No especificado' }}</div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Teléfono</div>
          <div class="text-subtitle1">{{ supplier.phone || 'No especificado' }}</div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Correo Electrónico</div>
          <div class="text-subtitle1">{{ supplier.email || 'No especificado' }}</div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Dirección</div>
          <div class="text-subtitle1">{{ supplier.address || 'No especificado' }}</div>
        </div>
      </div>

      <div class="row q-gutter-md q-py-md">
        <q-chip outline icon="verified">
          Estado: {{ supplier.active ? 'Activo' : 'Inactivo' }}
        </q-chip>
        <q-chip outline icon="assessment">
          Rating: {{ supplier.rating || 'Sin calificar' }}
        </q-chip>
      </div>

      <div class="text-caption text-grey q-mt-md">Productos Ofrecidos</div>
      <div v-if="supplierProducts.length === 0" class="text-center q-pa-md">
        <q-icon name="inventory_2" size="48px" color="grey-5" />
        <div class="text-grey-6 q-mt-sm">No se han seleccionado productos</div>
      </div>
      <div v-else>
        <q-list padding class="rounded-borders bg-white">
          <div
            class="grid auto-grid q-gap-md q-pa-sm"
            style="--min-item-width: 200px;"
          >
            <q-item
              v-for="item in supplierProducts"
              :key="item.id"
              class="card"
            >
              <q-item-section avatar>
                <q-icon name="inventory_2" color="primary" size="32px" />
              </q-item-section>
              <q-item-section class="text-black">
                <div>Nombre: <b>{{ item.name }}</b></div>
                <div>Código: <b>{{ item.code }}</b></div>
                <div>Precio: <b>S/. {{ item.price }}</b></div>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </div>

      <div class="text-caption text-grey q-mt-md">Historial de Compras</div>
      <q-table
        :rows="purchaseHistory"
        :columns="purchaseColumns"
        row-key="id"
        dense
        flat
        bordered
        class="rounded-borders q-mt-sm"
        :pagination="{ rowsPerPage: 5 }"
      />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'SupplierDetails',
  props: {
    supplier: {
      type: Object,
      required: true
    },
    supplierProducts: {
      type: Array,
      default: () => []
    },
    purchaseHistory: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      purchaseColumns: [
        { name: 'date', align: 'left', label: 'Fecha', field: 'date' },
        { name: 'orderNumber', align: 'left', label: 'N° Orden', field: 'orderNumber' },
        { name: 'amount', align: 'right', label: 'Monto', field: 'amount', format: val => `S/. ${val}` },
        { name: 'status', align: 'center', label: 'Estado', field: 'status' }
      ]
    }
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min-item-width), 1fr));
}
.auto-grid {
  gap: 1rem;
}
.card {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #fff;
}

.q-card {
  box-shadow: none;
}

.supplier-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
