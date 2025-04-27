import { boot } from "quasar/wrappers";
import { Loading } from "quasar";
import { inArray } from "src/functions/array";
import { LocalStorage, SessionStorage } from "quasar";

export default boot(({ router, store, redirect }) => {
  router.afterEach((to, from, next) => {
    let record = to.matched.find((record) => record.meta.auth);
    console.log("record", record);
    if (record) {
      // Loading.show();
      store.commit("auth/setLoadingAuth", true, { root: true });
      store
        .dispatch("auth/fetch", null, { root: true })
        .then(() => {
          const isAuthenticated = store.getters["auth/isAuthenticated"];
          if (!isAuthenticated) {
            router.push("/logout");
          } else {
            const user = store.getters["auth/getUser"];
            // const user = LocalStorage.getItem("user");
            //
            // if (!inArray(record.meta.rol, user.rol)) {
            //   if (user.rol === "ADM") {
            //     router.push("/capacitaciones");
            //   } else {
            //     router.push("/logout");
            //   }
            // }
          }
        })
        .catch((error) => {
          router.push("/logout");
        })
        .finally(() => {
          store.commit("auth/setLoadingAuth", false, { root: true });
          // Loading.hide();
        });
    }
  });
});
