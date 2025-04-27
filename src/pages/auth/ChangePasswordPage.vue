<template>
  <q-page class="flex flex-center bg-primary">
    <q-card class="verification-card q-pa-xl shadow-none">
      <q-card-section class="q-pb-xl">
        <div class="text-h5 text-primary text-weight-bold text-center">Cambiar Contraseña</div>
        <div class="text-subtitle2 text-grey text-center q-mt-sm">
          Ingresa y confirma tu nueva contraseña
        </div>
      </q-card-section>

      <q-form @submit="changePassword" class="q-gutter-y-md">
        <q-card-section>
          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Nueva contraseña"
            filled
            outlined
            color="primary"
            bg-color="grey-3"
            class="password-input"
            :rules="[
              val => !!val || 'La contraseña es requerida',
              val => val.length >= 8 || 'Mínimo 8 caracteres',
              val => /[A-Z]/.test(val) || 'Debe incluir al menos una mayúscula',
              val => /[0-9]/.test(val) || 'Debe incluir al menos un número'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div class="password-strength q-mt-sm">
            <div class="text-subtitle2 q-mb-xs">Fortaleza de la contraseña:</div>
            <div class="strength-indicators row q-gutter-x-sm">
              <div
                v-for="(level, index) in strengthLevels"
                :key="index"
                class="strength-bar"
                :class="{ active: passwordStrength >= index + 1 }"
              ></div>
            </div>
          </div>

          <q-input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirmar contraseña"
            filled
            outlined
            color="primary"
            bg-color="grey-3"
            class="password-input q-mt-md"
            :rules="[
              val => !!val || 'La confirmación es requerida',
              val => val === password || 'Las contraseñas no coinciden'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="q-pt-xl">
          <q-btn
            type="submit"
            class="full-width q-py-sm"
            label="Cambiar contraseña"
            :disable="!isValid"
            color="primary"
            rounded
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner />
            </template>
          </q-btn>
        </q-card-section>
      </q-form>

      <q-card-section class="text-center q-pt-md">
        <p class="text-subtitle2 q-ma-none">
          ¿Recordaste tu contraseña?
          <span
            @click="goToLogin"
            class="text-primary cursor-pointer text-weight-bold"
          >
            Iniciar sesión
          </span>
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import MethodsMixin from "src/mixins/MethodsMixin";

export default {
  name: 'ChangePasswordPage',
  mixins: [MethodsMixin],
  data() {
    return {
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      strengthLevels: Array(4).fill(false)
    };
  },
  computed: {
    ...mapGetters('auth', ["getVerifyUser"]),
    isValid() {
      return this.password.length >= 8 &&
             this.password === this.confirmPassword &&
             /[A-Z]/.test(this.password) &&
             /[0-9]/.test(this.password);
    },
    passwordStrength() {
      let strength = 0;
      if (this.password.length >= 8) strength++;
      if (/[A-Z]/.test(this.password)) strength++;
      if (/[0-9]/.test(this.password)) strength++;
      if (/[!@#$%^&*]/.test(this.password)) strength++;
      return strength;
    }
  },
  methods: {
    changePassword() {
      if (!this.isValid) return;

      this.loading = true;
      const payload = {
        token: this.getVerifyUser,
        password: this.password
      };

      this.$store.dispatch('auth/changePassword', payload)
        .then(response => {
          if (response.data.status === "OK") {
            this.alertSuccess(response.data.msg);
            this.goTo('/login');
          }
        })
        .catch(error => {
          this.alertError(error?.response?.data?.msg || 'No se pudo cambiar la contraseña');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    goToLogin() {
      this.goTo('/login');
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.getVerifyUser) {
        this.goBack();
      }
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

.password-input {
  width: 100%;
}

.password-input :deep(.q-field__control) {
  border-radius: 12px;
}

.strength-indicators {
  display: flex;
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  flex: 1;
  background-color: #e0e0e0;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.strength-bar.active:nth-child(1) { background-color: #8a8bbf; }
.strength-bar.active:nth-child(2) { background-color: #6a67a9; }
.strength-bar.active:nth-child(3) { background-color: #4e4b91; }
.strength-bar.active:nth-child(4) { background-color: #342f78; }


.password-input :deep(.q-field--focused .q-field__control) {
  border-color: var(--q-primary);
  border-width: 2px;
}


@media (max-width: 599px) {
  .verification-card {
    width: 90%;
  }
}
</style>
