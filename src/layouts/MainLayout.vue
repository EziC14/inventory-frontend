<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="fixed-top bg-primary shadow_custom q-mx-lg q-mt-md q-py-sm" style="right: 8px; border-radius: 4px;">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              5
            </q-badge>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-card class="text-center no-shadow no-border">
                  <q-btn
                    label="View All"
                    style="max-width: 120px !important;"
                    flat
                    dense
                    class="text-indigo-8"
                  />
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User avatar">
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
      style="border-radius: 0 50px 0px 0"
    >
      <div class="full-height">
        <div class="column justify-between full-height">
          <q-img>

          </q-img>
          <q-scroll-area class="col">
            <q-list>
              <template v-for="(menuItem, index) in menuItems" :key="index">
                <!-- Menú con submenús -->
                <q-expansion-item
                  v-if="menuItem.children && menuItem.children.length"
                  :icon="menuItem.icon"
                  :label="menuItem.label"
                  :default-opened="menuItem.defaultOpened"
                  expand-separator
                  class="text-white"
                >
                  <q-list>
                    <q-item
                      v-for="(subItem, subIndex) in menuItem.children"
                      :key="subIndex"
                      :to="subItem.path"
                      clickable
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-icon :name="subItem.icon" color="white" />
                      </q-item-section>
                      <q-item-section>
                        {{ subItem.label }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>

                <!-- Menú sin submenús -->
                <q-item
                  v-else
                  :to="menuItem.path"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon :name="menuItem.icon" color="white" />
                  </q-item-section>
                  <q-item-section>
                    {{ menuItem.label }}
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-scroll-area>

          <q-separator color="white" />

          <div class="text-white q-pa-sm row items-center justify-center">
            <q-btn
              round
              flat
              color="white"
              icon="power_settings_new"
              aria-label="Logout"
              @click="handleLogout"
            />
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container style="background: #f4f4f4;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MainLayout',

  setup() {
    const router = useRouter()
    const leftDrawerOpen = ref(false)

    // Define la estructura del menú
    const menuItems = [
      {
        label: 'PRODUCTOS',
        path: '/product',
        icon: 'home',
      },
      // {
      //   label: 'Planes',
      //   icon: 'assessment',
      //   defaultOpened: false,
      //   children: [
      //     {
      //       label: 'Lista de Planes',
      //       path: '/new-proyect',
      //       icon: 'list'
      //     },
      //     {
      //       label: 'Nuevo Plan',
      //       path: '/planes/nuevo',
      //       icon: 'add'
      //     }
      //   ]
      // },
      {
        label: 'PRODUCTOSEDO',
        path: '/created-product',
        icon: 'home',
      },
    ]

    const handleLogout = async () => {
      try {
        // Aquí deberías llamar a tu lógica de logout
        await router.push('/login')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    }

    return {
      leftDrawerOpen,
      menuItems,
      handleLogout
    }
  }
}
</script>

<style scoped>
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% { transform: scale(1); }
  5% { transform: scale(1.25); }
  20% { transform: scale(1); }
  30% { transform: scale(1); }
  35% { transform: scale(1.25); }
  50% { transform: scale(1); }
  55% { transform: scale(1.25); }
  70% { transform: scale(1); }
}

/* .q-drawer--left {

  border-radius: 0 20px 20px 0;
} */

.q-drawer--left.q-drawer--bordered {
  border: none;
}


.q-item {
  color: white !important;
}

.q-expansion-item__content {
  color: white !important;
  background: rgba(0, 0, 0, 0.1);
}

.q-expansion-item {
  color: white !important;
}

.q-item.q-router-link--active {
  background-color: white;
  color: #073b56 !important;
  border-radius: 8px;
}

.q-item.q-router-link--active i {
  color: #073b56 !important;
}

.q-item {
  margin: 4px 8px;
  border-radius: 8px;
}

.q-expansion-item--expanded {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  margin: 4px 8px;
}
</style>
