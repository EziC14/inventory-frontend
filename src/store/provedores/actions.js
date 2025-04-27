import { api } from "src/boot/axios";
import { routes } from "src/boot/settings";

export function someAction(/* context */) {}

export function getSupplier({ dispatch, commit }, payload) {
  return api.get(`/supplier/`);
}

export function getSupplierId({ dispatch, commit }, id) {
  return api.get(`/supplier/${id}`);
}

export function updatedSupplierId({ dispatch, commit }, payload) {
  return api.put(`/supplier/${payload.id}`, payload);
}

export function setSupplier({ dispatch, commit }, payload) {
  return api.post(`/supplier/`, payload);
}


