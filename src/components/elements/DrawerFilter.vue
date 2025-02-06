<template>
  <q-drawer
    behavior="mobile"
    side="right"
    v-model="isShowDrawer"
    :width="350"
    overlay
    bordered
    @hide="$emit('closeDrawer')"
  >
    <q-scroll-area class="fit">
      <div class="q-pt-md q-px-lg">
        <div class="row items-center justify-between">
          <div class="text-uppercase fw-600 fs-16 text-primary">
            <q-spinner-facebook v-if="isLoading" color="primary" size="1.5em" />
            {{ !isLoading ? title : "Filtrando..." }}
          </div>
          <div>
            <q-btn
              @click="$emit('closeDrawer')"
              icon="close"
              size="sm"
              color="grey-8"
              flat
              round
            />
          </div>
        </div>
        <div class="fs-13">
          * <span class="fw-600">Selecciona</span> un filtro de tu interés *
        </div>
      </div>
      <div class="column q-gutter-y-sm q-pa-lg">
        <slot></slot>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DrawerFilter",
  props: {
    title: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isShowDrawer: this.isOpen,
      isLoading: this.loading,
    };
  },
  watch: {
    isOpen(val) {
      this.isShowDrawer = val;
    },
    loading(val) {
      this.isLoading = val;
    },
  },
});
</script>

<style scoped>
.size_title {
  font-size: 17px;
}
</style>
