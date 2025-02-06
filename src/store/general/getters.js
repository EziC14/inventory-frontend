export function someGetter (/* state */) {
}

export function getProductos(state) {
  const listItems = [];
  Object.keys(state.products).forEach((o) => {
    listItems.push({
      id: o,
      ...state.products[o],
    });
  });
  return listItems;
}
