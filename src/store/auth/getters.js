import { LocalStorage, SessionStorage } from "quasar";

export function someGetter(/* state */) {}

export function getUser(state) {
  // const user = LocalStorage.getItem("user");
  //
  // return user || {};
  return state.user || {};
}

export function isAuthenticated(state) {
  return state.user !== null;
}

export function isLoadingAuth(state) {
  return state.isLoadingAuth;
}

export const getStorage = (state) => (key) => {
  let value = null;
  if (LocalStorage.has(key)) {
    value = LocalStorage.getItem(key);
  } else if (SessionStorage.has(key)) {
    value = SessionStorage.getItem(key);
  }
  return value;
};

export function getVerifyUser(state) {
  return state.verifyUser;
}

export function getTypeVerify(state) {
  return state.typeVerify;
}
