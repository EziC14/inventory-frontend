<template>
  <div class="login-page">
    <!-- Fondo animado de amanecer -->
    <div class="animated-background">
      <div class="sun"></div>
      <div class="ray" v-for="n in 12" :key="n" :style="{ transform: `rotate(${n * 30}deg)` }"></div>
      <div class="star" v-for="n in 50" :key="n"></div>
      <div class="glow"></div>
    </div>

    <div class="login-container">
      <!-- Logo circular con diseño sol inca -->
      <div class="logo-circle">
        <q-img
                src="/img/logo.png"
                spinner-color="white"
                style="height: 140px; max-width: 150px; top: -10px;"
              />
        <div class="inca-sun">
          <div class="sun-ray" v-for="n in 8" :key="n" :style="{ transform: `rotate(${n * 45}deg)` }"></div>
        </div>
      </div>

      <!-- Formulario de login con estilo minimalista -->
      <div class="login-form-container">
        <q-form @submit="onSubmit" class="login-form">
          <q-input
            v-model="form.username"
            placeholder="Usuario"
            outlined
            dark
            dense
            class="login-input"
            lazy-rules
            :rules="[(val) => Boolean(val) || 'Campo requerido']"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="white" size="xs" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            placeholder="Contraseña"
            :type="isPwd ? 'password' : 'text'"
            outlined
            dark
            dense
            class="login-input"
            lazy-rules
            :rules="[
              (val) => Boolean(val) || 'Campo requerido',
              (val) => (val && val.length >= 6) || 'Mínimo 6 caracteres'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="white" size="xs" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="white"
                size="xs"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="Iniciar Sesión"
            color="primary"
            class="login-button"
            :loading="loading.isLoadingRequest"
            unelevated
            no-caps
          >
            <template v-slot:loading>
              <q-spinner color="white" size="24px" />
            </template>
          </q-btn>
        </q-form>

        <div class="forgot-password">
          <span @click="ChangePassword" class="cursor-pointer">
            ¿Olvidaste tu contraseña?
          </span>
        </div>
      </div>
    </div>

    <!-- Silueta de montañas andinas animada -->
    <div class="mountains-silhouette"></div>
  </div>
  <notVerifyCode v-model="showVerifyModal" @close="showVerifyModal = false" :email="form.username" />
  <changePassword v-model="showVerifyModal" @close="showVerifyModal = false"/>
</template>

<script>
import MethodsMixin from "src/mixins/MethodsMixin";
import { mapGetters } from "vuex";
import notVerifyCode from "src/components/modals/auth/notVerifyCode.vue";
import changePassword from "src/components/modals/auth/changePassword.vue";

export default {
  name: "LoginPage",
  mixins: [MethodsMixin],
  components: {
    notVerifyCode,
    changePassword
  },
  data() {
    return {
      showVerifyModal: false,
      isPwd: true,
      form: {
        username: "",
        password: "",
      },
      loading: {
        isLoadingRequest: false,
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch("auth/logout", null, { root: true });
      this.setupStars();
      this.setupSunAnimation();
    });
  },
  methods: {
    onSubmit() {
      this.loading.isLoadingRequest = true;
      this.$store
        .dispatch(
          "auth/login",
          { username: this.form.username.trim(), password: this.form.password },
          { root: true }
        )
        .then(() => {
          return this.goTo("/product");
        })
        .catch((error) => {
          if (error?.response?.data?.verify === false) {
            return this.showVerifyModal = true;
          }

          if (error?.response?.data?.detail)
            return this.alertError(error?.response?.data?.detail);
        })
        .finally(() => {
          this.loading.isLoadingRequest = false;
        });
    },
    ChangePassword() {
      this.showVerifyModal = true;
    },
    setupStars() {
      // Posiciona las estrellas aleatoriamente
      const stars = document.querySelectorAll('.star');
      stars.forEach(star => {
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 70}%`; // Solo en la parte superior del cielo
        star.style.animationDelay = `${Math.random() * 10}s`;
        star.style.animationDuration = `${5 + Math.random() * 10}s`;
      });
    },
    setupSunAnimation() {
      // Anima el sol y sus rayos
      const rays = document.querySelectorAll('.ray');
      rays.forEach((ray, index) => {
        ray.style.animationDelay = `${index * 0.2}s`;
      });
    }
  },
};
</script>

<style>
.login-page {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #0c0c20 0%, #1f1e36 25%, #473b5e 50%, #b86e56 75%, #ffa07a 100%);
  position: relative;
  overflow: hidden;
}

/* Fondo animado de amanecer */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

@keyframes glowRay {
  0% {
    opacity: 0.3;
    height: 120px;
  }
  100% {
    opacity: 0.7;
    height: 180px;
  }
}

.star {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 170, 0, 0.3) 0%, rgba(255, 170, 0, 0) 70%);
  border-radius: 50%;
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateX(-50%) scale(1.5);
    opacity: 0.5;
  }
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  max-width: 360px;
  z-index: 2;
}

/* Logo estilo sol inca */
.logo-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
}
/*
.inca-sun {
  width: 100%;
  height: 100%;
  position: relative;
}

.sun-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  background: linear-gradient(135deg, #ffaa00 0%, #ff7700 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(255, 170, 0, 0.5);
}

.sun-ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 45px;
  background: #ffaa00;
  transform-origin: center bottom;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  animation: pulseRay 3s ease-in-out infinite;
} */

@keyframes pulseRay {
  0%, 100% {
    transform-origin: center 5px;
    height: 45px;
  }
  50% {
    transform-origin: center 5px;
    height: 50px;
  }
}

.logo-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.login-form-container {
  width: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(26, 26, 46, 0.6);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-out;

}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.login-input {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.login-input:hover :deep(.q-field__control) {
  border-color: rgba(255, 170, 0, 0.7);
}

.login-input :deep(.q-field__control) {
  background-color: rgba(255, 255, 255, 0.1);
  height: 44px;
  transition: all 0.3s ease;
}

.login-input :deep(.q-field__marginal) {
  height: 44px;
  padding: 0 8px;
}



.forgot-password {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

.forgot-password span:hover {
  color: #ffaa00;
  text-decoration: underline;
}

/* Silueta de montañas andinas */
.mountains-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23110f1d' fill-opacity='0.8' d='M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: cover;
  background-position: center;
  z-index: 1;
  animation: moveUp 120s linear infinite alternate;
}

@keyframes moveUp {
  0% {
    background-position-x: 0%;
  }
  100% {
    background-position-x: 100%;
  }
}

/* Media query para dispositivos móviles */
@media (max-width: 600px) {
  .login-container {
    padding: 1.5rem;
  }

  .mountains-silhouette {
    height: 120px;
  }

  .sun {
    width: 150px;
    height: 150px;
    bottom: -100px;
  }
}
</style>
