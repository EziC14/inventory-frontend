<template>
  <q-list class="q-mt-md border-card rounded-10" padding>
    <q-scroll-area style="height: 300px">
      <q-item
        v-for="product in listFilter?.length > 0 ? listFilter : list"
        :key="product.id"
        tag="label"
        v-ripple
      >
        <q-item-section>
          <div class="row items-center q-gutter-x-md">
            <div
              class="fw-700 q-pa-sm fs-12 text-uppercase background-profile-enable"
            >
              {{ this.$filters.textProfile(product?.name) }}
            </div>
            <div class="col">
              <q-item-label class="fw-600">{{ product?.name || "-" }}</q-item-label>
              <q-item-label style="color: #3a3a3a">
                {{ product?.category || "-" }}
              </q-item-label>
            </div>
          </div>
        </q-item-section>

        <q-item-section v-if="viewQuantity" side top>
          <div class="row items-center q-gutter-x-sm">
            <q-btn
              @click="decreaseQuantity(product)"
              :disable="!quantities[product.id] || quantities[product.id] <= 1"
              class="text-white q-px-sm q-py-sm"
              :class="quantities[product.id] > 1 ? 'bg-secondary' : 'bg-grey'"
              size="xs"
              icon="remove"
              flat
            />
            <q-input
              v-model.number="quantities[product.id]"
              type="number"
              class="text-center"
              dense
              style="width: 50px;"
              :min="1"
              @change="updateQuantity(product)"
            />
            <q-btn
              @click="increaseQuantity(product)"
              class="bg-primary text-white q-px-sm q-py-sm"
              size="xs"
              icon="add"
              flat
            />
          </div>
        </q-item-section>

        <q-item-section v-if="viewCheckBox" side top>
          <q-checkbox size="xs" v-model="product.selected" />
        </q-item-section>
      </q-item>
    </q-scroll-area>
  </q-list>
</template>

<script>
export default {
  props: {
    arrData: {
      type: Array,
      required: true,
    },
    arrFilter: {
      type: Array,
      required: true,
    },
    viewCheckBox: {
      type: Boolean,
      default: true,
    },
    viewQuantity: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const initialQuantities = this.arrData.reduce((acc, product) => {
      acc[product.id] = product.quantity || 1;
      return acc;
    }, {});

    return {
      list: this.arrData,
      listFilter: this.arrFilter,
      quantities: initialQuantities,
    };
  },
  watch: {
    arrData: {
      handler(value) {
        this.list = value;
        this.syncQuantities(value);
      },
      deep: true
    },
    arrFilter(value) {
      this.listFilter = value;
    },
  },
  methods: {
    syncQuantities(data) {
      this.quantities = data.reduce((acc, product) => {
        acc[product.id] = product.quantity || 1;
        return acc;
      }, {});
    },

    updateQuantity(product) {
      // Ensure quantity is at least 1
      if (this.quantities[product.id] < 1) {
        this.quantities[product.id] = 1;
      }

      // Create updated product with new quantity
      const updatedProduct = {
        ...product,
        quantity: this.quantities[product.id]
      };

      // Emit event with updated product
      this.$emit('update:quantity', updatedProduct);
    },

    decreaseQuantity(product) {
      if (this.quantities[product.id] > 1) {
        this.quantities[product.id] -= 1;
        this.updateQuantity(product);
      }
    },

    increaseQuantity(product) {
      this.quantities[product.id] = (this.quantities[product.id] || 0) + 1;
      this.updateQuantity(product);
    },
  },
};
</script>
