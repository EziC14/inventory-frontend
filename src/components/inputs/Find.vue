<template>
  <q-input
    rounded
    standout="bg-grey-3 text-primary shadow-0"
    input-class="text-black"
    v-model="inputVal"
    label="Buscar"
    @focus="isFocused = true"
    @blur="isFocused = false"
    class="text-white"
    dense
  >
    <template v-slot:append>
      <q-icon
        name="search"
        :class="{
          'text-grey-6': isFocused,
          'text-grey': !isFocused,
        }"
      />
    </template>
  </q-input>
</template>

<script>
export default {
  props: {
    modelQuery: {
      type: String,
      required: true,
    },
    baseArr: Array,
    nameArrCopy: String,
  },
  data() {
    return {
      isFocused: false,
    };
  },

  computed: {
    inputVal: {
      get() {
        return this.modelQuery;
      },
      set(value) {
        this.$emit("update:model-query", value);
        this.$nextTick(() => {
          this.$emit(
            "findByQuery",
            this.inputVal,
            this.baseArr,
            this.nameArrCopy
          );
        });
      },
    },
  },
};
</script>

<style lang=""></style>
