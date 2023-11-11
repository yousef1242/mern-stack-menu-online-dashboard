import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCartAction: (state, action) => {
      // Check if the product already exists in the cart
      const itemIndexToAdd = state.cart.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size
      );

      if (itemIndexToAdd !== undefined) {
        // If the product exists in the cart, increase its quantaty
        itemIndexToAdd.quantaty += 1;
      } else {
        // If the product doesn't exist in the cart, add it
        state.cart.push(action.payload);
      }
    },
    updateCartItemAction: (state, action) => {
      // Find the index of the cart item to be update
      const itemIndexToUpdate = state.cart.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size
      );

      if (itemIndexToUpdate !== undefined) {
        // If the product exists in the cart, increase its quantaty
        if (action.payload.quantaty) {
          itemIndexToUpdate.quantaty = action.payload.quantaty;
        }
      }
    },
    deleteCartItemAction: (state, action) => {
      // Find the index of the cart item to be deleted
      const itemIndexToDelete = state.cart.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size
      );

      if (itemIndexToDelete !== -1) {
        // Create a new array without the item to delete
        const newCart = [...state.cart];
        newCart.splice(itemIndexToDelete, 1); // Remove one item at the found index

        // Return the updated state with the item removed
        return { ...state, cart: newCart };
      }

      // If the item was not found, return the current state
      return state;
    },
    emptyCartItemsAction: (state) => {
      state.cart = []
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCartAction,
  updateCartItemAction,
  deleteCartItemAction,
  emptyCartItemsAction,
} = cartSlice.actions;

export default cartSlice.reducer;
