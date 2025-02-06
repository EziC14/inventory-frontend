<template>
    <div
      :class="{ 'column ': $q.screen.xs, 'row items-center': !$q.screen.xs }"
      class=""
    >
      <div v-if="loading" flat style="width: 160px">
        <q-skeleton type="text" class="text-subtitle1" />
      </div>
      <div
        v-else
        style="color: #111111"
        class="fw-900 text-uppercase"
        :class="{ size_title: $q.screen.xs, 'fs-20': !$q.screen.xs }"
      >
        {{ name }}
      </div>
      <div :class="{ ' row': $q.screen.xs, 'q-ml-auto': !$q.screen.xs }">
        <div :class="{ ' q-gutter-sm': !$q.screen.xs }" class="row col-12">
          <slot></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "CommonTitle",
    props: {
      loading: {
        type: Boolean,
        required: false,
        default: false,
      },
      name: {
        type: String,
        required: true,
      },
    },
  });
  </script>
  
  <style scoped>
  .size_title {
    font-size: 17px;
  }
  </style>
  