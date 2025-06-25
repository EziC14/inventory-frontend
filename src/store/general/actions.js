import { api } from "src/boot/axios";
import { routes } from "src/boot/settings";

export function downloadExcelReport({ }, filters = {}) {
  // Construir query params
  const params = new URLSearchParams();
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);
  return api.get('api/reports/excel/', {
    params,
    responseType: 'blob'
  });
}

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
      .get(`/product/?${payload}`)
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

export function getCategoryId({ dispatch, commit }, id) {
  return api.get(`/product/category/${id}`);
}
export function updatedCategoryId({ dispatch, commit }, payload) {
  return api.put(`/product/category/${payload.id}`, payload);
}

export function deleteCategoryId({ dispatch, commit }, id) {
  return api.delete(`/product/category/${id}`);
}
export function setCategory({ dispatch, commit }, payload) {
  return api.post(`/product/category`, payload);
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

export function getProductColors({ dispatch, commit }, id) {
  return api.get(`/product/product-color/${id}`);
}
