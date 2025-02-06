import { boot } from "quasar/wrappers";

const settings = {
  IS_TEST: process.env.IS_TEST === "true",
  URL_API: process.env.www,
};

const images = {
  LOGIN_PORTADA: "/img/bg_portada.svg",
  LOGIN_REGISTRO: "/img/bg_registro.svg",
};

const routes = {
  events: "/trainer/event",
  event: "/trainer/event/{uid}",
  eventStatus: "/trainer/event/{uid}/status",
  typeEvents: "/trainer/typeevent",
  sedes: "/trainer/campus",
  employee: "/api/employee",
  planning: "/trainer/planning",
  iperc: "/iperc",
};

export default boot(({ app }) => {
  app.config.globalProperties.$settings = settings;
  app.config.globalProperties.$images = images;
  app.config.globalProperties.$routes = routes;
});

export { settings, images, routes };
