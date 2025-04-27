// CUIDADO!!!
// PARA MOVIL:
//    descomentar la linea 8
//    comentar lineas 9-16
// PARA WEB:
//    descomentar lineas 9-16
//    comentar linea 8
// import { Preferences } from '@capacitor/preferences'
class StorageM {
  keys() {}
  set() {}
  get() {}
  remove() {}
  clear() {}
}
const Preferences = new StorageM();

class StorageClass {
  getAll() {
    Preferences.keys().then((result) => {
      return result.keys;
    });
  }

  set(key, value) {
    value = JSON.stringify(value);
    Preferences.set({
      key,
      value,
    });
  }

  get(key) {
    Preferences.get({ key }).then((result) => {
      return result !== null
        ? result.value !== null
          ? JSON.parse(result.value)
          : null
        : null;
    });
  }

  remove(key) {
    Preferences.remove({ key });
  }

  clear() {
    Preferences.clear();
  }
}

export const storage = new StorageClass();
