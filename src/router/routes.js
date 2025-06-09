const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "product" , meta: { auth: true },component: () => import("pages/ProductPage.vue") },
      { path: "provider", meta: { auth: true },component: () => import("pages/Provedores/Index.vue") },
      { path: "movements", meta: { auth: true },component: () => import("pages/Movimientos/Index.vue") },
      { path: "settings/categories" , meta: { auth: true },component: () => import("pages/Administration/Category.vue") },
      { path: "settings/movement-reasons" , meta: { auth: true },component: () => import("pages/Administration/Razones.vue") },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: "created-product", meta: { auth: true },component: () => import("pages/NewProduct.vue") },
      { path: "created-provider", meta: { auth: true },component: () => import("pages/Provedores/New.vue") },
      { path: "created-movement", meta: { auth: true },component: () => import("pages/Movimientos/New.vue") },
      { path: "edit-provider/:id", meta: { auth: true },component: () => import("pages/Provedores/Edit.vue") },
      { path: "edit-product/:id", meta: { auth: true },component: () => import("pages/EditProduct.vue") },
      { path: "edit-movement/:id", meta: { auth: true },component: () => import("pages/Movimientos/Edit.vue") },
      { path: "ia-created-movement", meta: { auth: true },component: () => import("pages/Movimientos/IAmovent.vue") },
      { path: 'login', meta: { auth: false }, component: () => import('src/pages/auth/LoginPage.vue') },
      { path: 'register', meta: { auth: false }, component: () => import('src/pages/auth/RegisterPage.vue') },
      { path: 'logout', meta: { auth: false }, component: () => import('src/pages/auth/LogoutPage.vue') },
      { path: 'verify', meta: { auth: false }, component: () => import('src/pages/auth/VerifyPage.vue') },
      { path: 'change-password', meta: { auth: false }, component: () => import('src/pages/auth/ChangePasswordPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
