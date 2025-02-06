<template lang="">
  <div
    :class="{
      'row q-col-gutter-x-md': $q.screen.lt.sm,
      'column q-col-gutter-y-sm': !$q.screen.lt.sm,
    }"
    class="items-center"
  >
    <div>
      <q-btn
        :class="{
          'q-py-sm': $q.screen.lt.md,
        }"
        :size="$q.screen.lt.md ? 'sm' : ''"
        :icon="
          $q.screen.lt.sm
            ? 'fa-regular fa-chevrons-down'
            : 'keyboard_double_arrow_right'
        "
        class="bg-page"
        flat
        @click="$emit('sendAll', arrName, arrNameSelected, arrNameFilterFirst)"
      ></q-btn>
    </div>

    <div>
      <q-btn
        :class="{
          'q-py-sm': $q.screen.lt.md,
        }"
        :size="$q.screen.lt.md ? 'sm' : ''"
        :icon="
          $q.screen.lt.sm
            ? 'fa-regular fa-chevron-down'
            : 'keyboard_arrow_right'
        "
        class="bg-page"
        flat
        :disable="verifyFirstList"
        @click="
          $emit('sendSelect', arrName, arrNameSelected, arrNameFilterFirst)
        "
      ></q-btn>
    </div>
    <div>
      <q-btn
        :class="{
          'q-py-sm': $q.screen.lt.md,
        }"
        :size="$q.screen.lt.md ? 'sm' : ''"
        :icon="
          $q.screen.lt.sm ? 'fa-regular fa-chevron-up' : 'keyboard_arrow_left'
        "
        class="bg-page"
        flat
        :disable="verifySecondList"
        @click="
          $emit('quitSelect', arrName, arrNameSelected, arrNameFilterSecond)
        "
      ></q-btn>
    </div>
    <div>
      <q-btn
        :class="{
          'q-py-sm': $q.screen.lt.md,
        }"
        :icon="
          $q.screen.lt.sm
            ? 'fa-regular fa-chevrons-up'
            : 'keyboard_double_arrow_left'
        "
        class="bg-page"
        :size="$q.screen.lt.md ? 'sm' : ''"
        flat
        @click="$emit('quitAll', arrName, arrNameSelected, arrNameFilterSecond)"
      ></q-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrName: String,
    arrNameSelected: String,
    arrNameFilterFirst: String,
    arrNameFilterSecond: String,
    verifyFirstList: Boolean,
    verifySecondList: Boolean,
  },
};
</script>

<style lang=""></style>
