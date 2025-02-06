<template lang="">
  <div class="col column items-center justify-center">
    <!-- TODO: CAMBIAR LA IMAGEN -->
    <q-img  :style="{ width: $q.screen.lt.md ? '250px' : '300px' }"  src="https://workspace.aios.pe/assets/empty_data.aafff382.png" />
    <div class="color-primary fw-700 fs-20">No se encontraron resultados</div>
    <div class="fs-15 q-px-lg text-center">
      {{ info }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: String,
    bigText: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang=""></style>
