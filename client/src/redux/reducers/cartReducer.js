import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../../utils/constants";

const initialState = {
  cartItems: {},
};
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { _id, ItemName, ItemPrice, ItemDescription, ItemImage } =
        action.payload;
      const existingItem = state.cartItems[_id];
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [_id]: existingItem
            ? { ...existingItem, itemCount: existingItem.itemCount + 1 }
            : { ItemName, ItemPrice, ItemDescription, ItemImage, itemCount: 1 },
        },
      };

    case REMOVE_FROM_CART:
      const updatedCart = { ...state.cartItems };
      if (updatedCart[action.payload]) {
        if (updatedCart[action.payload].itemCount > 1) {
          updatedCart[action.payload].itemCount -= 1;
        } else {
          delete updatedCart[action.payload];
        }
      }
      return {
        ...state,
        cartItems: updatedCart,
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: {}, // Clear the cart items on clearCart action
      };

    default:
      return state;
  }
};
export default cartReducer;
