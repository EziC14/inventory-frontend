<template>
  <q-page class="bg-page q-px-xl q-pt-md">
    <!-- Cabecera con título y botón de nuevo -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold q-py-sm">Categorías de Productos</div>
      <q-btn
        @click="openCreateModal"
        color="primary"
        icon="add"
        label="Nueva Categoría"
        unelevated
        rounded
      />
    </div>

    <!-- Buscador simple -->
    <!-- <q-input
      v-model="searchTerm"
      placeholder="Buscar categorías..."
      outlined
      rounded
      clearable
      dense
      class="q-mb-lg"
      bg-color="white"
    >
      <template v-slot:prepend>
        <q-icon name="search" color="primary" />
      </template>
    </q-input> -->

    <!-- Grid de tarjetas de categorías -->
    <div v-if="filteredCategories.length > 0 && !loading" class="row q-col-gutter-md">
      <div v-for="category in filteredCategories" :key="category.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="category-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6 ellipsis">{{ category.name }}</div>
          </q-card-section>

          <q-card-section>
            <div class="text-body2 description-height">
              {{ category.description || 'Sin descripción' }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="around">
            <q-btn
              @click="openEditModal(category)"
              icon="edit"
              color="primary"
              label="Editar"
              flat
              class="q-px-md"
            />
            <q-btn
              @click="confirmDelete(category)"
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
      v-if="filteredCategories.length === 0 && !loading"
      class="column items-center justify-center q-py-xl"
    >
      <q-icon name="inventory_2" size="80px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">No se encontraron categorías</div>
      <q-btn
        @click="openCreateModal"
        color="primary"
        label="Crear categoría"
        unelevated
        rounded
        class="q-mt-md"
      />
    </div>

    <!-- Spinner de carga -->
    <div v-if="loading" class="column items-center justify-center" style="min-height: 300px;">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm text-grey-8">Cargando categorías...</div>
    </div>

    <!-- Modal para crear/editar categoría -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="width: 500px; max-width: 95vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">{{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveCategory" class="q-gutter-md">
            <q-input
              v-model="categoryForm.name"
              label="Nombre *"
              :rules="[val => !!val || 'El nombre es obligatorio']"
              outlined
              autofocus
            />

            <q-input
              v-model="categoryForm.description"
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
          <span class="q-ml-sm text-body1">¿Está seguro de eliminar esta categoría?</span>
        </q-card-section>

        <q-card-section class="q-pt-none text-grey-8">
          Esta acción no se puede deshacer y eliminará permanentemente esta categoría.
          Los productos asociados a esta categoría podrían verse afectados.
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="Cancelar" color="primary" outline v-close-popup />
          <q-btn
            label="Eliminar"
            color="negative"
            @click="deleteCategory"
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
  name: 'CategoriesPage',

  mixins: [MethodsMixin],

  data() {
    return {
      // Datos
      categories: [],
      searchTerm: '',
      loading: false,

      // Formulario
      showModal: false,
      isEditing: false,
      categoryForm: {
        id: null,
        name: '',
        description: ''
      },
      saving: false,

      // Eliminación
      deleteDialog: false,
      selectedCategory: null,
      deleting: false
    };
  },

  computed: {
    filteredCategories() {
      if (!this.searchTerm) {
        return this.categories;
      }

      const search = this.searchTerm.toLowerCase();
      return this.categories.filter(category =>
        category.name.toLowerCase().includes(search) ||
        (category.description && category.description.toLowerCase().includes(search))
      );
    }
  },

  mounted() {
    this.fetchCategories();
  },

  methods: {
    // Obtener categorías
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await this.$store.dispatch("general/getCategory", { root: true });
        if (response && response.data && response.data.status === 'OK') {
          this.categories = response.data.data || [];
        } else {
          throw new Error(response?.data?.msg || 'Error al cargar las categorías');
        }
      } catch (error) {
        this.alertError("Error al cargar las categorías", error);

        console.error('Error fetching categories:', error);
      } finally {
        this.loading = false;
      }
    },

    // Abrir modal para crear
    openCreateModal() {
      this.isEditing = false;
      this.categoryForm = {
        id: null,
        name: '',
        description: ''
      };
      this.showModal = true;
    },

    // Abrir modal para editar
    openEditModal(category) {
      this.isEditing = true;
      this.categoryForm = {
        id: category.id,
        name: category.name,
        description: category.description || ''
      };
      this.showModal = true;
    },

    // Guardar/actualizar categoría
    async saveCategory() {
      this.saving = true;
      try {
        const payload = {
          name: this.categoryForm.name,
          description: this.categoryForm.description || ''
        };

        let response;

        if (this.isEditing) {
          // Actualizar categoría existente usando store
          payload.id = this.categoryForm.id;
          response = await this.$store.dispatch("general/updatedCategoryId", payload, { root: true });

          if (response && response.data && response.data.status === 'OK') {
            // Actualizar la lista de categorías
            await this.fetchCategories();

            this.alertSuccess("Categoría actualizada correctamente");

          } else {
            throw new Error(response?.data?.msg || 'Error al actualizar la categoría');
          }
        } else {
          // Crear nueva categoría usando store
          response = await this.$store.dispatch("general/setCategory", payload, { root: true });

          if (response && response.data && response.data.status === 'OK') {
            // Actualizar la lista de categorías
            await this.fetchCategories();

            this.alertSuccess("Categoría creada correctamente");

          } else {
            throw new Error(response?.data?.msg || 'Error al crear la categoría');
          }
        }

        this.showModal = false;
      } catch (error) {
        this.alertError("Error al guardar la categoría", error);
        console.error('Error saving category:', error);
      } finally {
        this.saving = false;
      }
    },

    // Confirmar eliminación
    confirmDelete(category) {
      this.selectedCategory = category;
      this.deleteDialog = true;
    },

    // Eliminar categoría
    async deleteCategory() {
      this.deleting = true;
      try {
        const payload = { id: this.selectedCategory.id };
        const response = await this.$store.dispatch("general/deleteCategoryId", payload, { root: true });

        if (response && response.data && response.data.status === 'OK') {
          // Actualizar la lista de categorías
          await this.fetchCategories();

          this.alertSuccess("Categoría eliminada correctamente");
        } else {
          throw new Error(response?.data?.msg || 'Error al eliminar la categoría');
        }
      } catch (error) {
        this.alertError("Error al eliminar la categoría", error);
        console.error('Error deleting category:', error);
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script>

<style scoped>
.category-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
  height: 100%;
}

.category-card:hover {
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
