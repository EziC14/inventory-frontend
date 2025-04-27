<template>
  <q-page class="flex flex-center bg-primary">
    <q-card class="verification-card q-pa-xl shadow-none">
      <q-card-section class="q-pb-xl">
        <div class="text-h5 text-primary text-weight-bold text-center">Verificación de Cuenta</div>
        <div class="text-subtitle2 text-grey text-center q-mt-sm">
          Ingresa el código de 6 dígitos que enviamos a tu correo
        </div>
      </q-card-section>

      <q-card-section class="row justify-center q-gutter-md">
        <q-input
          v-for="(digit, index) in code"
          :key="index"
          v-model="code[index]"
          filled
          class="digit-input"
          mask="#"
          maxlength="1"
          ref="inputs"
          @keyup="moveFocus(index, $event)"
          @paste.prevent="handlePaste"
          outlined
          color="primary"
          bg-color="grey-3"
        >

        </q-input>
      </q-card-section>

      <q-card-section class="q-pt-xl">
        <q-btn
          class="full-width q-py-sm"
          label="Verificar cuenta"
          :disable="!isComplete"
          @click="verifyCode"
          color="primary"
          rounded
          :loading="loading"
        >
          <template v-slot:loading>
            <q-spinner />
          </template>
        </q-btn>
      </q-card-section>

      <q-card-section class="text-center q-pt-md">
        <p class="text-subtitle2 q-ma-none">
          ¿No recibiste el código?
          <span
            @click="resendCode"
            class="text-primary cursor-pointer text-weight-bold"
          >
            Reenviar código
          </span>
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import MethodsMixin from "src/mixins/MethodsMixin";

export default {
  mixins: [MethodsMixin],
  data() {
    return {
      code: Array(6).fill(""),
      loading: false
    };
  },
  computed: {
    isComplete() {
      return this.code.every((digit) => digit !== "");
    },
    ...mapGetters('auth',["getVerifyUser", "getTypeVerify"])
  },
  methods: {
    ...mapMutations('auth', ["setVerifyUser"]),
    moveFocus(index, event) {
      if (event.key >= "0" && event.key <= "9") {
        if (index < 5) this.$refs.inputs[index + 1].focus();
      } else if (event.key === "Backspace") {
        this.code[index] = "";
        if (index > 0) {
          this.$refs.inputs[index - 1].focus();
        }
      }
    },
    handlePaste(event) {
      const pasteData = event.clipboardData.getData("text").slice(0, 6).split("");
      if (pasteData.length === 6) {
        this.code = pasteData;
      }
    },
    verifyCode() {
      this.loading = true;
      const payload = {
        token: this.getVerifyUser,
        code: this.code.join(""),
      };

      if (this.getTypeVerify === "password") {
        return this.$store
        .dispatch("auth/verifyCodePassword", payload, { root: true })
        .then((response) => {
          if (response.data.status === "OK") {
            this.setVerifyUser(this.getVerifyUser);
            this.alertSuccess(response.data.msg);
            console.log(this.getVerifyUser);
            this.goTo("/change-password");
          } else {
            console.log(response.data.msg);
            this.alertError(response?.data?.msg);
          }
        })
        .catch((error) => {
          this.alertError(
            error?.response?.data?.msg ||
              "No se pudo completar el registro, intente en otro momento"
          );
        })
        .finally(() => {
          this.loading = false;
        });
      }

      return this.$store
        .dispatch("auth/verifyCode", payload, { root: true })
        .then((response) => {
          if (response.data.status === "OK") {
            this.alertSuccess(response.data.msg);
            this.goTo("/login");
          } else {
            console.log(response.data.msg);
            this.alertError(response?.data?.msg);
          }
        })
        .catch((error) => {
          this.alertError(
            error?.response?.data?.msg ||
              "No se pudo completar el registro, intente en otro momento"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    },

    resendCode() {
      this.loading = true;
      const payload = {
        token: this.getVerifyUser,
      };

      if (this.getTypeVerify === "password") {
        return this.$store
        .dispatch("auth/resendCodePassword", payload, { root: true })
        .then((response) => {
          if (response.data.status === "OK") {
            this.alertSuccess(response.data.msg);
          } else {
            this.alertError(response?.data?.msg);
          }
        })
        .catch((error) => {
          this.alertError(
            error?.response?.data?.msg ||
              "No se pudo completar el registro, intente en otro momento"
          );
        })
        .finally(() => {
          this.loading = false;
        });
      }

      return this.$store
        .dispatch("auth/resendCode", payload, { root: true })
        .then((response) => {
          if (response.data.status === "OK") {
            this.alertSuccess(response.data.msg);
          } else {
            this.alertError(response?.data?.msg);
          }
        })
        .catch((error) => {
          this.alertError(
            error?.response?.data?.msg ||
              "No se pudo completar el registro, intente en otro momento"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.getVerifyUser) {
        this.goBack();
      }
      this.$refs.inputs[0].focus();
    });
  }
};
</script>

<style scoped>
.verification-card {
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
}

.digit-input {
  width: 52px;
}

.digit-input :deep(.q-field__native) {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.digit-input :deep(.q-field__control) {
  border-radius: 12px;
}

.digit-number {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* Estilo para el input activo */
.digit-input :deep(.q-field--focused .q-field__control) {
  border-color: var(--q-primary);
  border-width: 2px;
}

/* Ajustes para móvil */
@media (max-width: 599px) {
  .verification-card {
    width: 90%;
  }

  .digit-input {
    width: 45px;
  }
}
</style>
