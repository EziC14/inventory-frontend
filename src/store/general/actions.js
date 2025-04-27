import { api } from "src/boot/axios";
import { routes } from "src/boot/settings";

export function someAction(/* context */) {}

export function getProducts({ dispatch, commit }, payload) {
  return api.get(`/product/`);
}

export function setProducts({ commit }, payload) {
  commit("clearProducts");

  payload.forEach(function (data) {
    commit("setProducts", data);
  });
}

export function getProductsFilter({ dispatch, commit }, payload) {
  return new Promise(function (resolve, reject) {
    api
      .get(`/product?${payload}`)
      .then((response) => {
        if (response.data.status === "OK") {
          dispatch("general/setProducts", response.data.data, { root: true });
        } else if (response.data.status === "ERROR") {
          dispatch("general/setProducts", [], { root: true });
        }

        resolve(response);
      })
      .catch((error) => {
        //
        // dispatch("general/setProducts", [], { root: true });
        // reject(error);
      });
  });
}

export function getProduct({ dispatch, commit }) {
  return new Promise(function (resolve, reject) {
    api
      .get(`/product/`)
      .then((response) => {
        dispatch("general/setProducts", response.data.data, { root: true });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getProductId({ dispatch, commit }, id) {
  return api.get(`/product/${id}`);
}

export function updatedProductId({ dispatch, commit }, payload) {
  return api.put(`/product/${payload.id}`, payload);
}

export function getCategory({ dispatch, commit }, payload) {
    return api.get(`/product/category`);
}

export function getPrimaryProduct({ dispatch, commit }, payload) {
  return api.get(`/product/primary-product`);
}

export function getFinalProduct({ dispatch, commit }, payload) {
  return api.get(`/product/final-product`);
}

export function setPrimaryProduct({ dispatch, commit }, payload) {
  return api.post(`/product/primary-product`, payload);
}

export function setFinalProduct({ dispatch, commit }, payload) {
  return api.post(`/product/final-product`, payload);
}

export function getSupplier({ dispatch, commit }, payload) {
  return api.get(`/supplier/`);
}

export function setSupplier({ dispatch, commit }, payload) {
  return api.post(`/supplier/`, payload);
}
