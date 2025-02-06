<template>
  <q-card class="product-card" style="width: 100%; ">
    <q-card-section>
      <!-- <div class="row items-center justify-between q-mb-md">
        <div class="text-h5 text-primary">Resumen</div>
        <q-badge outline color="primary">{{ product.code }}</q-badge>
      </div> -->

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Código</div>
          <div class="text-subtitle1">{{ product.code }}</div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Nombre</div>
          <div class="text-subtitle1">{{ product.name }}</div>
        </div>

        <div v-if="!product.hasColors" class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Stock</div>
          <div class="text-subtitle1">{{ product.stock }}</div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Precio Unitario</div>
          <div class="text-subtitle1">${{ product.price }}</div>
        </div>

        <div class="col-xs-12 col-sm-6">
          <div class="text-caption text-grey">Categoría</div>
          <div class="text-subtitle1">{{ product.category?.label }}</div>
        </div>
      </div>

      <div class="row q-gutter-md q-py-md">
        <q-chip outline icon="inventory_2">
          Producto Final: {{ product.isProductFinal ? 'Sí' : 'No' }}
        </q-chip>
        <q-chip outline icon="palette">
          Tiene Colores: {{ product.hasColors ? 'Sí' : 'No' }}
        </q-chip>
      </div>

      <template v-if="product.isProductFinal">
  <div class="text-caption text-grey q-mt-md">Productos Primarios</div>
  <q-list padding class="rounded-borders bg-white">
    <div
      class="grid auto-grid q-gap-md q-pa-sm"
      style="--min-item-width: 200px;"
    >
      <q-item
        v-for="item in primaryProductSelected"
        :key="item.id"
        class="card"
      >
        <q-item-section avatar>
          <q-icon name="local_offer" color="primary" size="32px" />
        </q-item-section>
        <q-item-section class="text-black">
          <div>Nombre: <b>{{ item.name }}</b></div>
          <div>Productos necesarios: <b>{{ item.quantity }}</b></div>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

      <template v-if="product.hasColors">
  <div class="text-caption text-grey q-mt-sm">Colores</div>
  <q-list padding class="rounded-borders bg-white">
    <div
      class="grid auto-grid q-gap-md q-pa-sm"
      style="--min-item-width: 120px;"
    >
      <q-item v-for="item in colorCards" :key="item.name_color" class="card">
        <q-item-section avatar>
          <q-badge :style="{ backgroundColor: item.hex_code }" rounded style="height: 40px;" />
        </q-item-section>
        <q-item-section class="text-black">
          <div> Nombre: <b>{{ item.name_color }}</b> </div>
          <div>Stock: <b>{{ item.stock }}</b></div>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'ProductDetails',
  props: {
    product: {
      type: Object,
      required: true
    },
    primaryProductSelected: {
      type: Array,
      default: () => []
    },
    colorCards: {
      type: Array,
      default: () => []
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

.q-card{
  box-shadow: none;
}
</style>
