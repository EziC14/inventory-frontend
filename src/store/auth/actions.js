import { Loading } from "quasar";
import { onSuccess, onError } from "src/functions/notify";
import { api } from "src/boot/axios";
import _ from "lodash";

const USER_TYPE = ["ADM", "USU", ];
const AUTH_TYPE = "Bearer";

export function login({ dispatch, commit }, payload) {
  return new Promise(async (resolve, reject) => {
    // Loading.show();

    return api
      .post(`/security/login`, payload)
      .then((response) => {
        api.defaults.headers.common.Authorization =
          "Bearer" + " " + response.data.token;
        dispatch("auth/setRemember", true, { root: true });
        if (response.status === 200) {
          commit("setStorage", {
            key: "token",
            value: response.data.access,
          });

          dispatch("auth/initUser", response.data, { root: true });
          resolve(response);
        } else {
          //
        }
      })
      .catch((error) => {
        return reject(error);
      })
      .finally(() => {
        // Loading.hide();
      });
  });
}

export async function initUser({ rootState, dispatch, commit }, payload) {
  const profile = {
    token: payload.access,
    user: {
      ...payload.user,
    },
  };

  if (_.includes(USER_TYPE, profile.user.rol)) {
    // if (payload.user.is_activated) {
    commit("setStorage", {
      key: "token",
      value: profile.token,
    });
    api.defaults.headers.common.Authorization = AUTH_TYPE + " " + profile.token;
    commit("setUser", profile.user);
    commit("setStorage", {
      key: "user",
      value: profile.user,
    });
    commit("setStorage", {
      key: "admin",
      value: profile.token,
    });
  } else {
    commit("clear", null);
    commit("setUser", null);
    alertError(
      "Hola, no cuentas con privilegios para acceder a la aplicación."
    );
  }
}

export function setRemember({ commit }, payload) {
  commit("setRemember", payload);
  commit("setStorage", {
    key: "remember",
    value: payload,
  });
}

export function fetch({ commit, dispatch, getters }) {
  const token = getters.getStorage("token");

  commit("setStorage", {
    key: "token",
    value: token,
  });

  if (token) {
    api.defaults.headers.common.Authorization = "Bearer" + " " + token;
    return api
      .post("/security/token/verify/", { token })
      .then((response) => {
        return dispatch("auth/initUser", response.data, { root: true });
      })
      .catch((error) => {
        commit("clear", null);
        if (error.response.status === 403 || error.response.status === 400) {
          return Promise.reject(error);
        }
      });
  }
}

export function logout({ commit }) {
  delete api.defaults.headers.common["Authorization"];
  commit("auth/clear", null, { root: true });
}

export function register({ dispatch, commit }, payload) {
  return api.post(`/security/register`, payload);
}

export function verifyCode({ commit }, payload) {
  return api.post(`/security/code/verify`, payload);
}

export function generateCodeEmail({ commit }, payload) {
  return api.post(`/security/token/email`, payload);
}

export function resendCode({ commit }, payload) {
  return api.post(`/security/code/resend`, payload);
}

export function codePassword({ commit }, payload) {
  return api.post(`/security/password/code`, payload);
}

export function verifyCodePassword({ commit }, payload) {
  return api.post(`/security/password/verify`, payload);
}

export function resendCodePassword({ commit }, payload) {
  return api.post(`/security/password/resend`, payload);
}

export function changePassword({ commit }, payload) {
  return api.post(`/security/password/change`, payload);
}

