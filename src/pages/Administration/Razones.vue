<template>
  <q-page class="bg-page q-px-xl q-pt-md">
    <!-- Cabecera con título y botón de nuevo -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold q-py-sm">Razones de Movimiento</div>
      <q-btn
        @click="openCreateModal"
        color="primary"
        icon="add"
        label="Nueva Razón"
        unelevated
        rounded
      />
    </div>

    <!-- Grid de tarjetas de razones de movimiento -->
    <div v-if="filteredReasons.length > 0 && !loading" class="row q-col-gutter-md">
      <div v-for="reason in filteredReasons" :key="reason.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="reason-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6 ellipsis">{{ reason.name }}</div>
          </q-card-section>

          <q-card-section>
            <div class="text-body2 description-height">
              {{ reason.description || 'Sin descripción' }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="around">
            <q-btn
              @click="openEditModal(reason)"
              icon="edit"
              color="primary"
              label="Editar"
              flat
              class="q-px-md"
            />
            <q-btn
              @click="confirmDelete(reason)"
              icon="delete"
              color="negative"
              label="Eliminar"
              flat
              class="q-px-md"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Estado vacío -->
    <div
      v-if="filteredReasons.length === 0 && !loading"
      class="column items-center justify-center q-py-xl"
    >
      <q-icon name="sync_alt" size="80px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">No se encontraron razones de movimiento</div>
      <q-btn
        @click="openCreateModal"
        color="primary"
        label="Crear razón"
        unelevated
        rounded
        class="q-mt-md"
      />
    </div>

    <!-- Spinner de carga -->
    <div v-if="loading" class="column items-center justify-center" style="min-height: 300px;">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm text-grey-8">Cargando razones de movimiento...</div>
    </div>

    <!-- Modal para crear/editar razón -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="width: 500px; max-width: 95vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">{{ isEditing ? 'Editar Razón' : 'Nueva Razón' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveReason" class="q-gutter-md">
            <q-input
              v-model="reasonForm.name"
              label="Nombre *"
              :rules="[val => !!val || 'El nombre es obligatorio']"
              outlined
              autofocus
            />

            <q-input
              v-model="reasonForm.description"
              label="Descripción"
              type="textarea"
              outlined
              rows="3"
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                label="Cancelar"
                color="grey-7"
                v-close-popup
                flat
                class="q-mr-sm"
              />
              <q-btn
                :label="isEditing ? 'Actualizar' : 'Guardar'"
                type="submit"
                color="primary"
                unelevated
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card class="q-pa-sm">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-body1">¿Está seguro de eliminar esta razón de movimiento?</span>
        </q-card-section>

        <q-card-section class="q-pt-none text-grey-8">
          Esta acción no se puede deshacer y eliminará permanentemente esta razón.
          Los movimientos asociados a esta razón podrían verse afectados.
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="Cancelar" color="primary" outline v-close-popup />
          <q-btn
            label="Eliminar"
            color="negative"
            @click="deleteReason"
            v-close-popup
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import MethodsMixin from "src/mixins/MethodsMixin.js";

export default {
  name: 'MovementReasonsPage',

  mixins: [MethodsMixin],

  data() {
    return {
      // Datos
      reasons: [],
      searchTerm: '',
      loading: false,

      // Formulario
      showModal: false,
      isEditing: false,
      reasonForm: {
        id: null,
        name: '',
        description: ''
      },
      saving: false,

      // Eliminación
      deleteDialog: false,
      selectedReason: null,
      deleting: false
    };
  },

  computed: {
    filteredReasons() {
      if (!this.searchTerm) {
        return this.reasons;
      }

      const search = this.searchTerm.toLowerCase();
      return this.reasons.filter(reason =>
        reason.name.toLowerCase().includes(search) ||
        (reason.description && reason.description.toLowerCase().includes(search))
      );
    }
  },

  mounted() {
    this.fetchReasons();
  },

  methods: {
    // Obtener razones de movimiento
    async fetchReasons() {
      this.loading = true;
      try {
        const response = await this.$store.dispatch("movement/getReasonTypes", { root: true });
        if (response && response.data && response.data.status === 'OK') {
          this.reasons = response.data.data || [];
        } else {
          throw new Error(response?.data?.msg || 'Error al cargar las razones de movimiento');
        }
      } catch (error) {
        this.alertError("Error al cargar las razones de movimiento", error);
        console.error('Error fetching movement reasons:', error);
      } finally {
        this.loading = false;
      }
    },

    // Abrir modal para crear
    openCreateModal() {
      this.isEditing = false;
      this.reasonForm = {
        id: null,
        name: '',
        description: ''
      };
      this.showModal = true;
    },

    // Abrir modal para editar
    openEditModal(reason) {
      this.isEditing = true;
      this.reasonForm = {
        id: reason.id,
        name: reason.name,
        description: reason.description || ''
      };
      this.showModal = true;
    },

    // Guardar/actualizar razón
    async saveReason() {
      this.saving = true;
      try {
        const payload = {
          name: this.reasonForm.name,
          description: this.reasonForm.description || ''
        };

        let response;

        if (this.isEditing) {
          // Actualizar razón existente usando store
          payload.id = this.reasonForm.id;
          response = await this.$store.dispatch("movement/updatedReasonTypeId", payload, { root: true });

          if (response && response.data && response.data.status === 'OK') {
            // Actualizar la lista de razones
            await this.fetchReasons();
            this.alertSuccess("Razón de movimiento actualizada correctamente");
          } else {
            throw new Error(response?.data?.msg || 'Error al actualizar la razón de movimiento');
          }
        } else {
          // Crear nueva razón usando store
          response = await this.$store.dispatch("movement/setReasonType", payload, { root: true });

          if (response && response.data && response.data.status === 'OK') {
            // Actualizar la lista de razones
            await this.fetchReasons();
            this.alertSuccess("Razón de movimiento creada correctamente");
          } else {
            throw new Error(response?.data?.msg || 'Error al crear la razón de movimiento');
          }
        }

        this.showModal = false;
      } catch (error) {
        this.alertError("Error al guardar la razón de movimiento", error);
        console.error('Error saving movement reason:', error);
      } finally {
        this.saving = false;
      }
    },

    // Confirmar eliminación
    confirmDelete(reason) {
      this.selectedReason = reason;
      this.deleteDialog = true;
    },

    // Eliminar razón
    async deleteReason() {
      this.deleting = true;
      try {
        const response = await this.$store.dispatch("movement/deleteReasonType", this.selectedReason.id, { root: true });

        if (response && response.data && response.data.status === 'OK') {
          // Actualizar la lista de razones
          await this.fetchReasons();
          this.alertSuccess("Razón de movimiento eliminada correctamente");
        } else {
          throw new Error(response?.data?.msg || 'Error al eliminar la razón de movimiento');
        }
      } catch (error) {
        this.alertError("Error al eliminar la razón de movimiento", error);
        console.error('Error deleting movement reason:', error);
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script>

<style scoped>
.reason-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
  height: 100%;
}

.reason-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.description-height {
  min-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
