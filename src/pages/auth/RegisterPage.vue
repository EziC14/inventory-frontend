<template>
  <div class="row">
    <!-- Lado izquierdo con imagen y texto de bienvenida -->
    <div
      v-if="!$q.screen.lt.md"
      class="col-12 col-sm-12 col-md-7 bg-primary"
      style="height: 100vh;"
    >
      <div class="column items-center justify-center full-height">
        <div class="bg-white rounded-20 q-pa-md q-py-lg q-my-sm q-mb-xl column items-center justify-center q-mx-xl">
          <div class="text-primary text-uppercase text-center fw-600 text-h5 q-mb-sm">
            ¡Bienvenido a BROSS!
          </div>
          <div class="q-mb-sm q-px-md text-center text-primary">
            Únete a nuestra comunidad de moteros y disfruta de servicios exclusivos para ti
          </div>
        </div>
        <q-img
          style="width: 450px"
          src="/img/undraw_secure-login_m11a.svg"
          alt="Motorcycle"
        />

      </div>
    </div>

    <!-- Lado derecho con el formulario -->
    <div
      style="height: 100vh; padding: 2rem; display: flex; flex-direction: column; justify-content: center;"
      :class="{
        '': $q.screen.lt.md,
        'bg-white': !$q.screen.lt.md,
      }"
      class="col-12 col-sm-12 col-md-5 scroll-area-register"
    >
      <q-form @submit="onRegister" class="q-px-md">
        <!-- Título del formulario -->
        <div class="q-mb-lg">
          <h4 class="text-h5 text-primary q-mb-none"><b>Registrese aqui!!</b></h4>
          <p class="text-subtitle2 text-grey q-mt-sm">
            Completa tus datos para registrarte
          </p>
        </div>

        <!-- Grid de inputs -->
        <div class="row q-col-gutter-md">
          <!-- Nombre y Apellido en la misma fila -->
          <div class="col-12 col-sm-6">
            <ElementInput
              :text="user.name"
              @change-name="(e) => (user.name = e)"
              labelBody="Nombre (*)"
              :isRequired="true"
            />
          </div>
          <div class="col-12 col-sm-6">
            <ElementInput
              :text="user.last_name"
              @change-name="(e) => (user.last_name = e)"
              labelBody="Apellido (*)"
              :isRequired="true"
            />
          </div>

          <!-- Email y Teléfono en la misma fila -->
          <div class="col-12 col-sm-6">
            <ElementInput
              :text="user.email"
              @change-name="(e) => (user.email = e)"
              :isRequired="true"
              labelBody="Correo electrónico (*)"
              :isMail="true"
            />
          </div>
          <div class="col-12 col-sm-6">
            <ElementInput
              :text="user.phone"
              @change-name="(e) => (user.phone = e)"
              :isRequired="true"
              :isNumber="true"
              :min="9"
              labelBody="Celular (*)"
            />
          </div>

          <!-- Contraseñas en la misma fila -->
          <div class="col-12 col-sm-6">
            <q-input
              label="Contraseña (*)"
              v-model="user.password"
              lazy-rules
              :rules="[
                (val) => Boolean(val) || 'Campo requerido',
                (val) => (val && val.length >= 8) || 'Mínimo 8 caracteres'
              ]"
              :type="isPwd1 ? 'password' : 'text'"
              color="primary"
              bg-color="white"
              outlined
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd1 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd1 = !isPwd1"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              label="Repite tu contraseña (*)"
              v-model="user.repeatPassword"
              lazy-rules
              :rules="[
                (val) => Boolean(val) || 'Campo requerido',
                (val) => val === user.password || 'Las contraseñas no coinciden'
              ]"
              :type="isPwd2 ? 'password' : 'text'"
              color="primary"
              bg-color="white"
              outlined
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                />
              </template>
            </q-input>
          </div>
        </div>

        <!-- Botón de registro -->
        <div class="q-mt-lg">
          <q-btn
            type="submit"
            color="primary"
            rounded
            class="full-width q-py-sm text-subtitle1"
            label="Registrarme"
            :loading="loading.isLoadingRegister"
          >
            <template v-slot:loading>
              <q-spinner />
            </template>
          </q-btn>
        </div>

        <!-- Link a login -->
        <div class="q-mt-md text-center">
          <p class="text-subtitle2">
            ¿Ya tienes una cuenta?
            <span
              @click="goTo('/login')"
              class="text-primary cursor-pointer text-weight-bold"
            >
              Inicia sesión aquí
            </span>
          </p>
        </div>
      </q-form>
    </div>
  </div>
  <notVerifyCode v-model="showVerifyModal" @close="showVerifyModal = false" :email="user.email" />
</template>
<script>
import MethodsMixin from "src/mixins/MethodsMixin";
import ElementInput from "components/inputs/Simple.vue";
import DatePicker from "components/inputs/Date.vue";
import moment from "moment";
import { mapGetters, mapMutations } from "vuex";
import notVerifyCode from "src/components/modals/auth/notVerifyCode.vue";

export default {
  name: "RegisterComponent",
  mixins: [MethodsMixin],
  components: {
    ElementInput,
    notVerifyCode,
  },
  data() {
    return {
      showVerifyModal: false,
      isPwd1: true,
      isPwd2: true,
      user: {
        password: '12345678',
        name: 'asdsasa',
        last_name: 'dassa',
        phone: '123456789',
        email: 'ecalle@aios.pe',
        repeatPassword: '12345678',
      },
      loading: {
        isLoadingRegister: false,
      },
    };
  },
  methods: {
    ...mapMutations("auth", ["setVerifyUser"]),

    onRegister() {
      const payload = {
        name: this.user.name,
        last_name: this.user.last_name,
        email: this.user.email,
        phone: this.user.phone,
        password: this.user.password,
        password_confirmation: this.user.repeatPassword,
      };

      this.loading.isLoadingRegister = true;
      this.$store
        .dispatch("auth/register", payload, { root: true })
        .then((response) => {
          if (response.data.status === "OK") {
            const verify_token = response.data.token;

            this.setVerifyUser(verify_token);
            this.alertSuccess(response.data.msg);
            this.goTo("/verify");
          } else {
            this.alertError(response?.data?.msg);
          }
        })
        .catch((error) => {
          if (error?.response?.data?.verify === false) {
            return this.showVerifyModal = true;
          }

          this.alertError(
            error?.response?.data?.msg ||
              "No se pudo completar el registro, intente en otro momento"
          );
        })
        .finally(() => {
          this.loading.isLoadingRegister = false;
        });
    },
  },
};
</script>

<style scoped>
.q-field--error {
  color: #ffffff !important;
}
.scroll-area-register {
  max-height: 100vh;
  overflow: auto;
}
</style>
