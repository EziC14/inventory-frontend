import { LocalStorage, SessionStorage } from "quasar"

export function setStorage(payload) {
  if (payload.value === null) {
    if (LocalStorage.has(payload.key)) {
      LocalStorage.remove(payload.key);
    } else if (SessionStorage.has(payload.key)) {
      SessionStorage.remove(payload.key);
    }
  } else {
    LocalStorage.set(payload.key, payload.value);
  }
}
