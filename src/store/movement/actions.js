import { api } from "src/boot/axios";
import { routes } from "src/boot/settings";

export function someAction(/* context */) {}

export function getMovement({ dispatch, commit }, payload) {
  return api.get(`/movement/`);
}

export function getMovementId({ dispatch, commit }, id) {
  return api.get(`/movement/${id}`);
}

export function updatedMovementId({ dispatch, commit }, payload) {
  return api.put(`/movement/${payload.id}`, payload);
}

export function deleteMovement({ dispatch, commit }, id) {
  return api.delete(`/movement/${id}`);
}

export function setMovement({ dispatch, commit }, payload) {
  return api.post(`/movement/`, payload);
}

export function getReasonTypes({ dispatch, commit }, payload) {
  return api.get(`/movement/reason-types`);
}

export function getReasonTypesId({ dispatch, commit }, id) {
  return api.get(`/movement/reason-types/${id}`);
}

export function updatedReasonTypeId({ dispatch, commit }, payload) {
  return api.put(`/movement/reason-types/${payload.id}`, payload);
}

export function setReasonType({ dispatch, commit }, payload) {
  return api.post(`/movement/reason-types/`, payload);
}

export function deleteReasonType({ dispatch, commit }, id) {
  return api.delete(`/movement/reason-types/${id}`);
}

export function iaCreated({ dispatch, commit }, payload) {
  return api.post(`/movement/analyze-document`, payload);
}
