<template>
  <!-- box-shadow: 0 2px 12px rgba(0,0,0,0.08); -->
  <q-layout view="lHh Lpr lFf" style="background: #f5f5f5;">
    <!-- Header optimizado con mejor espaciado y contraste -->
    <q-header class="fixed-top q-mx-lg q-py-sm" style="right: 10px; border-radius: 0 0 12px 12px; background: #f5f5f5;">
      <q-toolbar style="margin-top: 10px; padding: 0 16px; ">
        <!-- Burger menu mejorado -->
        <q-btn
          v-if="$q.screen.lt.md"
          flat
          dense
          round
          icon="menu"
          color="primary"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm"
        />

        <!-- Componente de búsqueda mejorado -->
        <q-select
          rounded
          outlined
          v-model="selectedSearch"
          :options="filteredOptions"
          use-input
          hide-selected
          fill-input
          input-debounce="300"
          @filter="filterFn"
          @input-value="setInputValue"
          bg-color="white"
          dense
          placeholder="Buscar en el sistema..."
          style="width: 100%;"
          class="q-mr-lg search-field"
          @keyup.enter="performSearch"
          @update:model-value="handleSelection"
          option-value="path"
          option-label="label"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary"/>
          </template>
          <template v-slot:append>
            <q-icon v-if="searchText" name="close" color="grey-7" class="cursor-pointer" @click="clearSearch"/>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              class="q-py-sm search-result-item"
            >
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.description || 'Navegar a esta página' }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-space/>

        <!-- Área de usuario y notificaciones -->
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round flat color="primary" icon="help_outline" class="help-button">
            <q-tooltip>Ayuda</q-tooltip>
          </q-btn>

          <q-btn round flat color="primary" icon="notifications" class="notification-button">
            <q-badge color="negative" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notificaciones</q-tooltip>
            <q-menu anchor="bottom right" self="top right" class="notification-menu">
              <q-list style="min-width: 300px">
                <q-item-label header>Notificaciones</q-item-label>

                <q-item clickable v-ripple class="notification-item unread">
                  <q-item-section avatar>
                    <q-avatar icon="inventory_2" color="primary" text-color="white" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Inventario bajo</q-item-label>
                    <q-item-label caption>3 productos por debajo del mínimo</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>ahora</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-ripple class="notification-item">
                  <q-item-section avatar>
                    <q-avatar icon="local_shipping" color="warning" text-color="white" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Actualización de envío</q-item-label>
                    <q-item-label caption>Envío #2345 ha sido entregado</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>2h</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-ripple class="text-primary text-center">
                  <q-item-section>Ver todas</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn round flat class="user-profile-button">
            <q-avatar size="32px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User avatar">
            </q-avatar>
            <q-tooltip>Mi perfil</q-tooltip>
            <q-menu anchor="bottom right" self="top right" class="user-menu">
              <q-list style="min-width: 200px">
                <q-item class="q-pa-md">
                  <q-item-section avatar>
                    <q-avatar size="48px">
                      <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User avatar">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Usuario Demo</q-item-label>
                    <q-item-label caption>usuario@ejemplo.com</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>Mi perfil</q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="settings" color="grey-7" />
                  </q-item-section>
                  <q-item-section>Configuración</q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-ripple @click="handleLogout">
                  <q-item-section avatar>
                    <q-icon name="power_settings_new" color="negative" />
                  </q-item-section>
                  <q-item-section>Cerrar sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer mejorado con tema visual consistente -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState && !$q.screen.lt.md"
      :width="280"
      :breakpoint="1024"
      class="drawer-container"
      bordered
    >
      <!-- Botón de toggle mejorado -->
      <q-btn
        v-if="!$q.screen.lt.md"
        class="drawer-toggle"
        dense
        round
        @click="toggleMiniState"
        :icon="!miniState ? 'chevron_left' : 'chevron_right'"
      />

      <div class="full-height">
        <div class="column justify-between full-height">
          <!-- Logo con mejor posicionamiento -->
          <div class="logo-container q-pa-md text-center">
            <q-img
              src="/img/logo_black.png"
              class="q-mx-auto q-mb-md"
              style="max-height: 80px; max-width: 100%;"
              fit="contain"
            />
          </div>

          <!-- Menú principal mejorado -->
          <q-scroll-area class="col q-pt-md">
            <q-list padding class="menu-list" :style="{ margin: miniState && !$q.screen.lt.md ? '100px 8px' : '100px 14px' }">
              <template v-for="(menuItem, index) in menuItems" :key="index">
                <q-expansion-item
                  v-if="menuItem.children && menuItem.children.length"
                  :icon="menuItem.icon"
                  :label="menuItem.label"
                  :default-opened="menuItem.defaultOpened || isMenuItemActive(menuItem)"
                  expand-separator
                  :header-class="isMenuItemActive(menuItem) ? 'menu-item-parent active-parent-item' : 'menu-item-parent'"
                >
                  <q-list class="submenu-container">
                    <q-item
                      v-for="(subItem, subIndex) in menuItem.children"
                      :key="subIndex"
                      :to="subItem.path"
                      clickable
                      v-ripple
                      class="submenu-item"
                    >
                      <q-item-section avatar>
                        <q-icon :name="subItem.icon" />
                      </q-item-section>
                      <q-item-section>
                        {{ subItem.label }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>

                <q-item
                  v-else
                  :to="menuItem.path"
                  clickable
                  v-ripple
                  class="menu-item"
                  active-class="active-menu-item"
                  :active="isMenuItemActive(menuItem)"
                >
                  <q-item-section avatar>
                    <q-icon :name="menuItem.icon" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    {{ menuItem.label }}
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-scroll-area>

          <!-- Footer de drawer mejorado -->
          <div class="q-pa-md">

            <div class="row justify-center q-gutter-sm">
              <q-btn
                round
                flat
                icon="power_settings_new"
                color="negative"
                size="sm"
                aria-label="Logout"
                @click="handleLogout"
              >
                <q-tooltip>Cerrar sesión</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- Page container con mejor espaciado -->
    <q-page-container class="page-container">
      <div class="page-inner-container">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

export default {
  name: 'MainLayout',

  setup() {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const leftDrawerOpen = ref($q.screen.gt.sm)
    const miniState = ref(false)
    const searchText = ref('')
    const selectedSearch = ref(null)
    const filteredOptions = ref([])

    // Define main menu items with descriptions
    const menuItems = [
      {
        label: 'Inventario',
        path: '/product',
        icon: 'inventory_2',
        description: 'Administrar productos y stock'
      },
      {
        label: 'Proveedores',
        path: '/provider',
        icon: 'local_shipping',
        description: 'Gestionar proveedores'
      },
      {
        label: 'Movimientos',
        path: '/movements',
        icon: 'swap_horiz',
        description: 'Registrar entradas y salidas de productos',
      },
      {
        label: 'Reportes',
        path: '/reports',
        icon: 'bar_chart',
        description: 'Ver reportes y estadísticas'
      },
      {
        label: 'Configuración',
        path: '/settings',
        icon: 'settings',
        description: 'Configurar la aplicación',
        children: [
          {
            label: 'Categorías de Productos',
            path: '/settings/categories',
            icon: 'category',
            description: 'Administrar categorías de productos'
          },
          {
            label: 'Razones de Movimiento',
            path: '/settings/movement-reasons',
            icon: 'assignment_turned_in',
            description: 'Configurar razones de movimiento'
          }
        ]
      },
    ]

    // Función para verificar si un ítem del menú está activo
    const isMenuItemActive = (menuItem) => {
      const currentPath = route.path

      // Verifica si la ruta actual coincide exactamente con el path del menú
      if (currentPath === menuItem.path) {
        return true
      }

      // Verifica si la ruta actual comienza con el path del menú + '/'
      // Esto es para que las rutas anidadas funcionen (ej: '/settings/categories')
      if (menuItem.path !== '/' && currentPath.startsWith(menuItem.path + '/')) {
        return true
      }

      return false
    }

    const getAllSearchableItems = () => {
      let items = [...menuItems]

      // Add any child items from menu items with children
      menuItems.forEach(item => {
        if (item.children && item.children.length) {
          items = [...items, ...item.children]
        }
      })

      return items
    }

    // Get all searchable content
    const allSearchableItems = ref(getAllSearchableItems())

    // Filter function for the search dropdown
    const filterFn = (val, update) => {
      if (val === '') {
        // Show no options if search is empty
        update(() => {
          filteredOptions.value = []
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        filteredOptions.value = allSearchableItems.value.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const setInputValue = (val) => {
      searchText.value = val
    }

    const handleSelection = (item) => {
      if (item && item.path) {
        // Navigate to the selected path
        router.push(item.path)
        // Clear selection after navigation
        selectedSearch.value = null
        // Notify user with toast on small screens
        if ($q.screen.lt.md) {
          $q.notify({
            message: `Navegando a ${item.label}`,
            color: 'primary',
            position: 'bottom',
            timeout: 1500
          })
        }
      }
    }

    const performSearch = () => {
      if (!searchText.value.trim()) return

      const matchingOptions = allSearchableItems.value.filter(
        item => item.label.toLowerCase().includes(searchText.value.toLowerCase())
      )

      if (matchingOptions.length > 0) {
        // Navigate to the first matching result
        router.push(matchingOptions[0].path)
        // Notify user
        $q.notify({
          message: `Navegando a: ${matchingOptions[0].label}`,
          color: 'positive',
          position: 'bottom',
          timeout: 2000
        })
      } else {
        // Show no results notification
        $q.notify({
          message: 'No se encontraron resultados',
          color: 'warning',
          position: 'bottom',
          timeout: 2000
        })
      }

      // Clear after search
      selectedSearch.value = null
    }

    const clearSearch = () => {
      searchText.value = ''
      selectedSearch.value = null
      filteredOptions.value = []
    }

    // Update searchable items when routes change
    onMounted(() => {
      // This could also be done with a watcher on the route
      // or by pulling from your router configuration
      allSearchableItems.value = getAllSearchableItems()

      // Auto-close drawer on mobile after navigation
      if ($q.screen.lt.md) {
        router.afterEach(() => {
          leftDrawerOpen.value = false
        })
      }
    })

    const handleLogout = async () => {
      try {
        $q.dialog({
          title: 'Cerrar sesión',
          message: '¿Estás seguro que deseas cerrar sesión?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          // Show loading indicator
          $q.loading.show({
            message: 'Cerrando sesión...'
          })

          // Simulate logout delay
          setTimeout(async () => {
            $q.loading.hide()
            await router.push('/login')
            $q.notify({
              color: 'positive',
              message: 'Sesión cerrada exitosamente',
              icon: 'logout',
              position: 'bottom'
            })
          }, 800)
        })
      } catch (error) {
        console.error('Error during logout:', error)
        $q.notify({
          color: 'negative',
          message: 'Error al cerrar sesión',
          icon: 'error',
          position: 'bottom'
        })
      }
    }

    return {
      leftDrawerOpen,
      menuItems,
      handleLogout,
      miniState,
      searchText,
      selectedSearch,
      filteredOptions,
      filterFn,
      setInputValue,
      performSearch,
      clearSearch,
      handleSelection,
      isMenuItemActive, // Exportando la función para usarla en la plantilla
      $q,
      drawerClick (e) {
        if (miniState.value) {
          miniState.value = false
          e.stopPropagation()
        }
      },
      toggleMiniState () {
        miniState.value = !miniState.value
      },
    }
  }
}
</script>

<style>
/* Variables globales para colores */
:root {
  --primary-color: #5a0315;
  --primary-light: #7c1328;
  --primary-dark: #420210;
  --grey-bg: #f6f6f6;
  --accent-color: #e63946;
  --text-dark: #333333;
  --text-medium: #5b5b5b;
  --text-light: #888888;
  --border-radius: 12px;
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.08);
}


/* Header y barra de búsqueda */
.search-field {
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.search-field:focus-within {
  box-shadow: var(--shadow-md);
}

.search-result-item:hover {
  background: var(--grey-bg);
}

/* Drawer y menú lateral */
.drawer-container {
  background: white;
  border-right: 1px solid rgba(0,0,0,0.05);
}

.logo-container {
  padding-top: 22px;
  padding-bottom: 8px;
}

.menu-list {
  padding-top: 8px;
}

.menu-item {
  border-radius: var(--border-radius);
  margin: 4px 0;
  color: var(--text-medium) !important;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: var(--grey-bg);
}

.menu-item-parent {
  border-radius: var(--border-radius);
  margin: 4px 0;
  color: var(--text-medium) !important;
}

.active-menu-item {
  background-color: var(--primary-color) !important;
  color: white !important;
  font-weight: 500;
}

.active-menu-item .q-icon {
  color: white !important;
}

/* Estilo para el encabezado del menú padre cuando está activo */
.active-parent-item {
  background-color: var(--primary-color) !important;
  color: white !important;
  font-weight: 500;
  border-radius: var(--border-radius);
}

.active-parent-item .q-item__section--avatar .q-icon {
  color: white !important;
}

.active-parent-item .q-item__label {
  color: white !important;
}

.submenu-container {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  margin-top: -8px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.submenu-item {
  padding-left: 36px;
  border-radius: var(--border-radius);
  margin: 2px 8px;
}

/* Botón de drawer toggle */
.drawer-toggle {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2000;
  background: #5a0315;
  color: white;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.q-drawer--mini {
  width: 70px !important;
}

/* Notificaciones */
.notification-item.unread {
  background-color: rgba(var(--primary-color), 0.05);
}

.notification-button {
  margin: 0 8px;
}

.help-button, .user-profile-button {
  transition: transform 0.2s ease;
}

.help-button:hover, .user-profile-button:hover {
  transform: scale(1.1);
}

/* Estilos responsivos */
@media (max-width: 1023px) {
  .page-inner-container {
    padding: 16px;
  }

  .q-header {
    margin-left: 16px !important;
    margin-right: 16px !important;
  }
}

@media (max-width: 767px) {
  .page-inner-container {
    padding: 12px;
  }

  .q-header {
    margin-left: 8px !important;
    margin-right: 8px !important;
    padding: 4px !important;
  }

  .q-toolbar {
    margin-top: 15px !important;
  }
}

@media (max-width: 599px) {
  .page-inner-container {
    padding: 8px;
  }

  .q-header {
    margin-left: 4px !important;
    margin-right: 4px !important;
  }
}
</style>
