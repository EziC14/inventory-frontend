<template>
  <div>
    <div class="row col-12">
      <!-- <div class="text-grey-5 q-px-xs txt-Roboto-regular">{{ labelHead }}</div> -->
      <q-select
        outlined
        ref="selectRef"
        class="col-12 text-negative txt-Roboto-regular"
        :class="{ 'q-mb-md': !isRequired && isClearable }"
        standout
        use-input
        :rounded="isRounded"
        :label="labelBody"
        v-model="inputVal"
        :options="list.items"
        :readonly="localReadOnly && !isEditable ? true : false"
        :clearable="isClearable"
        input-debounce="0"
        @filter="filterFn"
        :rules="isRequired ? [(val) => !!val || 'Campo requerido'] : []"
        @update:model-value="onChange"
        map-options
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label
                class="fw-500"
                v-if="scope.opt?.description"
                caption
                >{{ scope.opt.description }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
import MethodsMixin from "src/mixins/MethodsMixin.js";
export default {
  emits: ["update:model-value", "change-name"],
  mixins: [MethodsMixin],
  props: {
    labelBody: {
      required: false,
      type: String,
    },
    optionLabel: {
      required: false,
      type: String,
      default: "label",
    },
    isRequired: {
      required: false,
      type: Boolean,
      default: true,
    },
    labelHead: {
      required: false,
      type: String,
    },
    isClearable: {
      type: Boolean,
      default: true,
    },
    text: {
      required: false,
      type: [String, Object],
    },
    options: {
      required: false,
      type: Array,
      default: () => [],
    },
    isReadOnly: {
      required: false,
      type: Boolean,
      default: false,
    },
    icon: {
      required: false,
      type: String,
    },
    iconPosition: {
      required: false,
      type: String,
      default: "append",
    },
    bg: {
      required: false,
      type: String,
    },
    isRounded: {
      required: false,
      type: Boolean,
      default: false,
    },
    hasEvent: {
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
  },
  data() {
    return {
      localReadOnly: this.isReadOnly,
      list: {
        items: [],
      },
      position: "append",
      localCopy: this.isCopy,
    };
  },

  computed: {
    inputVal: {
      get() {
        return this.text;
      },
      set(val) {
        this.$emit("change-name", val);
      },
    },
  },
  mounted() {
    if (this.iconPosition == "left") {
      this.position = "append";
    } else {
      this.position = "prepend";
    }
  },
  methods: {
    onEvent() {
      if (!this.inputVal) {
        this.alertError("Debes seleccionar un trabajador");
      } else {
        this.$emit("on-take-attendance", true, this.inputVal.label);
      }
    },
    filterFn(val, update, abort) {
      if (val === "") {
        update(() => {
          this.list.items = this.options;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.list.items = this.options.filter((v) => {
          const name = v.label.toLowerCase();
          const description = v?.description?.toLowerCase() || "";
          return name.indexOf(needle) > -1 || description.indexOf(needle) > -1;
        });
      });
    },

    onChange(val) {
      this.$emit("update:model-value", val);
    },
    unfocusSelect() {
      this.$refs.selectRef.blur();
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

<style scoped>
q-field__input q-placeholder col q-field__input--padding no-pointer-events {
  display: none !important;
}
</style>
