<template>
  <q-input
    :rules="isRequired ? [(val) => !!val || 'Campo requerido'] : []"
    :class="{ 'q-mb-md': !isRequired && isClearable }"
    :label="label"
    :rounded="isRounded"
    ref="qInputTo"
    locale="es" 
    :clearable="isClearable"
    v-model="inputVal"
    @focus="openDate"
    outlined
    :debounce="debounce"
    :readonly="localReadOnly && !isEditable ? true : false"
  >
    <template v-slot:append>
      <q-icon
        v-if="!(isEditable && localReadOnly && localCopy)"
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="inputVal"
            @update:model-value="closeDate"
            @input="inputVal"
          />
        </q-popup-proxy>
      </q-icon>

      <q-icon
        v-if="isEditable && localReadOnly && localCopy"
        size="20px"
        :name="
          isEditable && localReadOnly && localCopy
            ? 'some_icon'
            : 'content_copy'
        "
        class="cursor-pointer"
        @click="copyToClipboard(inputVal)"
      />
    </template>
  </q-input>
</template>

<script>
import MethodsMixin from "src/mixins/MethodsMixin.js";
export default {
  mixins: [MethodsMixin],
  props: {
    value: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      default: "Selecciona una fecha",
    },
    rules: {
      type: Array,
      required: false,
    },
    debounce: {
      type: [String, Number],
      default: 2000,
    },
    mask: {
      type: String,
      default: "YYYY/MM/DD",
    },
    isReadOnly: {
      required: false,
      type: Boolean,
      default: false,
    },
    isCopy: {
      required: false,
      type: Boolean,
      default: false,
    },
    isEditable: {
      required: false,
      type: Boolean,
      default: false,
    },
    isRounded: {
      required: false,
      type: Boolean,
      default: false,
    },
    isClearable: {
      required: false,
      type: Boolean,
      default: false,
    },
    isRequired: {
      required: false,
      type: Boolean,
      default: false,
    },
    bgWhite: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  emits: ["changeName:name", "update:model-value"],
  data() {
    return {
      localReadOnly: this.isReadOnly,
      localCopy: this.isCopy,
    };
  },

  mounted() {},

  computed: {
    inputVal: {
      get() {
        return this.value || null;
      },
      set(val) {
        this.$emit("changeName:name", val);
        this.$emit("update:model-value", val);
      },
    },
  },

  methods: {
    openDate() {
      this.$refs.qDateProxy.show();
    },
    closeDate() {
      this.$refs.qInputTo.blur();
      this.$refs.qDateProxy.hide();
    },
    onChange(val) {
      this.$emit("changeName:name", val);
    },
  },

  watch: {
    isReadOnly(newValue) {
      this.localReadOnly = newValue;
    },
    isCopy(newValue) {
      this.localCopy = newValue;
    },
  },
};
</script>
