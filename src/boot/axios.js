import { boot } from "quasar/wrappers";
import axios from "axios";

let api;

export default boot(({ app }) => {
  api = axios.create({
    baseURL: 'http://localhost:8000',
    "Content-Type": "application/json",
  });
  console.log(process.env.URL_API);
  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = api;
});

export { axios, api };

