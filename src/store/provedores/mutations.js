export function someMutation (/* state */) {
}

export function setProducts(state, payload) {
  state.products = {
    ...state.products,
    [payload.id]: payload,
  };
}

export function clearProducts(state) {
  state.products = {};
}
