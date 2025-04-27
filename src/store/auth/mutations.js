import { LocalStorage, SessionStorage, Platform } from "quasar";
import { storage } from "boot/storage";

export function setStorage(state, payload) {
  if (payload.value === null) {
    state[payload.key] = null;
    if (Platform.is.capacitor) {
      storage.remove(payload.key);
    }
    if (LocalStorage.has(payload.key)) {
      LocalStorage.remove(payload.key);
    } else if (SessionStorage.has(payload.key)) {
      SessionStorage.remove(payload.key);
    }
  } else {
    state[payload.key] = payload.value;
    if (Platform.is.capacitor) {
      storage.set(payload.key, payload.value);
    }
    LocalStorage.set(payload.key, payload.value);
  }
}

export function setLoggedIn(state, value) {
  state.loggedIn = value;
}

export function setRemember(state, payload) {
  state.remember = payload;
}

export function clearUser(state, payload) {
  state.user = {};
}

export function setUser(state, data) {
  state.user = { ...data };
}

export function setToken(state, value) {
  state.token = value;
}

export function clearToken(state) {
  state.token = null;
}
export function clear(state, payload) {
  state.remember = false;
  state.token = null;
  state.user = null;

  LocalStorage.clear();
  SessionStorage.clear();
}

export function setLoadingAuth(state, value) {
  state.isLoadingAuth = value;
}

export function setVerifyUser(state, value) {
  state.verifyUser = value;
}

export function setTypeVerify(state, value) {
  state.typeVerify = value;
}
