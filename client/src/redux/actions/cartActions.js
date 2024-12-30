import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  INCREMENT,
  DECREMENT,
} from "../../utils/constants";

export const addToCart = (item) => {
  return {
    type: ADD_TO_CART,
    payload: item,
  };
};
export const incrementItem = (item) => {
  return {
    type: INCREMENT,
    payload: item,
  };
};
export const decrementItem = (item) => {
  return {
    type: DECREMENT,
    payload: item,
  };
};
export const removeFromCart = (itemId) => {
  return {
    type: REMOVE_FROM_CART,
    payload: itemId,
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};
