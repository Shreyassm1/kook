import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  INCREMENT,
  DECREMENT,
} from "../../utils/constants";

const initialState = {
  cartItems: {},
  canteenId: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const {
        _id,
        ItemName,
        ItemPrice,
        ItemDescription,
        ItemImage,
        canteenId,
      } = action.payload; // Getting item details from payload
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [_id]: {
            ItemName,
            ItemPrice,
            ItemDescription,
            ItemImage,
            itemCount: 1, // Adding new item with itemCount = 1
          },
        },
        canteenId,
      };

    case REMOVE_FROM_CART:
      const ItemId = action.payload; // Item ID from payload to remove
      const newCartItems = { ...state.cartItems };
      delete newCartItems[ItemId]; // Remove item from cart
      return {
        ...state,
        cartItems: newCartItems,
      };

    case INCREMENT:
      const {
        _id: incrementId,
        ItemName: incrementName,
        ItemPrice: incrementPrice,
        ItemDescription: incrementDesc,
        ItemImage: incrementImg,

        itemCount: incrementCount,
      } = action.payload;

      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [incrementId]: {
            ItemName: incrementName,
            ItemPrice: incrementPrice,
            ItemDescription: incrementDesc,
            ItemImage: incrementImg,

            itemCount: incrementCount + 1, // Incrementing itemCount
          },
        },
      };

    case DECREMENT:
      const {
        _id: decrementId,
        ItemName: decrementName,
        ItemPrice: decrementPrice,
        ItemDescription: decrementDesc,
        ItemImage: decrementImg,

        itemCount: decrementCount,
      } = action.payload;

      // Only decrement if count is greater than 1, otherwise remove item
      if (decrementCount === 1) {
        return {
          ...state,
          cartItems: {
            ...state.cartItems,
          },
        };
      }

      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [decrementId]: {
            ItemName: decrementName,
            ItemPrice: decrementPrice,
            ItemDescription: decrementDesc,
            ItemImage: decrementImg,

            itemCount: decrementCount - 1, // Decrementing itemCount
          },
        },
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: {}, // Clear all items from the cart
      };

    default:
      return state;
  }
};

export default cartReducer;
