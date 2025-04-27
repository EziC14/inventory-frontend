<template>
  <q-dialog v-model="show" persistent>
    <q-card class="auth-modal">
      <q-card-section class="text-center q-pt-lg">
        <div class="text-h6 q-mb-md">Restablecer Contraseña</div>
        <q-avatar size="80px" class="q-mb-md">
          <q-icon name="lock_reset" color="primary" size="50px" />
        </q-avatar>
        <div class="text-body1 q-mb-md">
          Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
        </div>

        <q-form @submit="onSubmit" class="q-mt-md">
          <q-input
            v-model="email"
            label="Correo electrónico"
            type="email"
            :rules="[
              val => !!val || 'El correo es requerido',
              val => isValidEmail(val) || 'Ingresa un correo válido'
            ]"
            outlined
            rounded
            dense
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="primary" />
            </template>
          </q-input>
        </q-form>

        <div class="text-body2 text-grey-7">
          Te enviaremos un código de verificación para confirmar tu identidad.
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg" style="gap: 10px">
        <q-btn
          rounded
          outline
          color="grey"
          label="Cancelar"
          v-close-popup
          class="q-px-md action-btn"
          @click="onCancel"
        />
        <q-btn
          rounded
          color="primary"
          label="Enviar código"
          class="q-px-md q-ml-sm action-btn"
          @click="onSubmit"
          :loading="loading"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapMutations } from "vuex";
import MethodsMixin from "src/mixins/MethodsMixin";

export default {
  name: 'PasswordResetModal',
  mixins: [MethodsMixin],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      email: ''
    }
  },

  computed: {
    show: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },

  methods: {
    ...mapMutations("auth", ["setVerifyUser","setTypeVerify"]),
    isValidEmail(email) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(email);
    },

    onSubmit() {
      if (!this.isValidEmail(this.email)) {
        return;
      }

      const payload = {
        email: this.email
      }

      this.loading = true;
      this.$store.dispatch('auth/codePassword', payload)
        .then((response) => {
          this.show = false;
          const token = response.data.data.token;
          this.setVerifyUser(token);
          this.setTypeVerify("password");
          this.goTo('/verify');

        })
        .catch((error) => {
          this.alertError(error?.response?.data?.msg);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onCancel() {
      this.email = '';
      this.$emit('cancel');
      this.show = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-modal {
  min-width: 350px;
  border-radius: 12px;

  @media (min-width: 600px) {
    min-width: 400px;
  }

  .q-card__section {
    padding-top: 35px;
    padding-bottom: 25px;
  }

  .q-avatar {
    background: rgba(25, 118, 210, 0.1);
    padding: 15px;
  }

  .action-btn {
    padding: 10px;
    width: 200px;
  }

  .q-form {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
