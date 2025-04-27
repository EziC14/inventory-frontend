<template>
  <q-dialog v-model="show" persistent>
    <q-card class="auth-modal">
      <q-card-section class="text-center q-pt-lg">
        <div class="text-h6 q-mb-md">Verificación Requerida</div>
        <q-avatar size="80px" class="q-mb-md">
          <q-icon name="mail" color="primary" size="50px" />
        </q-avatar>
        <div class="text-body1 q-mb-md">
          Tienes una cuenta registrada con este correo, pero aún no la has verificado.
        </div>
        <div class="text-body2 text-grey-7">
          ¿Deseas que te enviemos un correo de verificación?
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg" style="gap: 10px">
        <q-btn
          rounded
          outline
          color="grey"
          label="Cancelar"
          v-close-popup
          class="q-px-md"
          style="padding: 10px; width: 200px"
          @click="onCancel"
        />
        <q-btn
          rounded
          color="primary"
          label="Enviar correo"
          class="q-px-md q-ml-sm"
          @click="onVerify"
          style="padding: 10px; width: 200px"
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
import { mapGetters, mapMutations } from "vuex";
import MethodsMixin from "src/mixins/MethodsMixin";

export default {
  name: 'AuthVerificationModal',
  mixins: [MethodsMixin],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      loading: false
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
    ...mapMutations("auth", ["setVerifyUser"]),
    onVerify() {
      const payload = {
        email: this.email
      }
      this.loading = true
      this.$store.dispatch('auth/generateCodeEmail', payload)
        .then((response) => {
          this.show = false
          const verify_token = response.data.data.token;

          this.setVerifyUser(verify_token);
          this.goTo('/verify')
        })
        .catch((error) => {
          this.alertError(error?.response?.data?.msg)
        })
        .finally(() => {
          this.loading = false
        })
    },

    onCancel() {
      this.$emit('cancel')
      this.show = false
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
}
</style>
