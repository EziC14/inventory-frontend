<template>
  <div>
    <div class="row col-12">
      <div class="text-grey-5 q-px-xs txt-Roboto-regular">{{ labelHead }}</div>
      <q-input
        ref="inputRef"
        :label="labelBody ? labelBody : ''"
        outlined
        bottom-slots
        v-model="inputVal"
        :debounce="time"
        class="col-12 text-negative txt-Roboto-regular"
        :bg-color="bg ? 'info' : 'white'"
        input-class="cpm-input"
        :placeholder="placehol"
        @input="inputVal"
        :hint="hint"
        color="primary"
        :readonly="localReadOnly && !isEditable ? true : false"
        :type="
          isPwd
            ? 'password'
            : isMail
            ? 'email'
            : isTextArea
            ? 'textarea'
            : 'text'
        "
        :rules="computedRules"
      >
        <template v-slot:append>
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
          /> </template
      ></q-input>
    </div>
  </div>
</template>

<script>
import { is } from "quasar";
import MethodsMixin from "src/mixins/MethodsMixin.js";
export default {
  mixins: [MethodsMixin],
  props: {
    hint: {
      required: false,
      type: String,
      default: "",
    },
    isReadOnly: {
      required: false,
      type: Boolean,
      default: false,
    },
    isRequired: {
      required: false,
      type: Boolean,
      default: false,
    },
    isPwd: {
      required: false,
      type: Boolean,
      default: false,
    },
    isNumber: {
      required: false,
      type: Boolean,
      default: false,
    },
    isText: {
      required: false,
      type: Boolean,
      default: false,
    },
    isMail: {
      required: false,
      type: Boolean,
      default: false,
    },
    labelHead: {
      required: false,
      type: String,
    },
    labelBody: {
      required: false,
      type: String,
    },
    text: {
      required: false,
      type: [String, Number],
    },
    time: {
      required: false,
      type: String,
      default: "0",
    },
    min: {
      required: false,
      type: Number,
      default: 0,
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
    refVal: {
      required: false,
      type: String,
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
    isTextArea: {
      required: false,
      type: Boolean,
      default: false,
    },
    placehol: {
      required: false,
      type: String,
      default: "",
    },
    isDecimal: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  emits: ["change-name"],
  data() {
    return {
      localReadOnly: this.isReadOnly,
      localCopy: this.isCopy,
      position: "",
    };
  },

  mounted() {
    if (this.iconPosition == "left") {
      this.position = "prepend";
    } else {
      this.position = "append";
    }
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
    computedRules() {
      let rules = [];

      if (this.isRequired) {
        rules.push((val) => !!val || "Campo requerido");
      }

      if (this.isNumber) {
        rules.push(
          (val) =>
            /^[1-9][0-9]*$/.test(val) || "Ingrese un número válido"
        );
      }

      if (this.isDecimal) {
        rules.push(
          (val) =>
            /^(?!0$)([1-9][0-9]*|0?\.[0-9]+|[1-9][0-9]*\.[0-9]+)$/.test(val) ||
            "Ingrese un número válido"
        );
      }

      if (this.isText) {
        rules.push((val) => {
          if (val === null || val === undefined || val.trim() === "") {
            return true;
          }
          return /^[a-zA-Z\u00C0-\u017F\s]+$/.test(val) || "Ingrese solo texto";
        });
      }

      if (this.isMail) {
        rules.push(
          (val) => /\S+@\S+\.\S+/.test(val) || "Ingrese un correo válido"
        );
      }

      if (this.min > 0) {
        rules.push(
          (val) => val.length === this.min || `Debe tener ${this.min} dígitos`
        );
      }

      return rules;
    },
  },
  methods: {
    focusInput() {
      this.$refs.inputRef.focus();
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

<style scoped></style>
