import { createContext, useContext, useReducer, useEffect } from "react";

const CART_KEY = "shophub_cart";

const initialState = {
  items: [], // { id, title, price, thumbnail, quantity }
};

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { items: Array.isArray(parsed.items) ? parsed.items : [] };
    }
  } catch (e) {
    console.warn("Cart load error", e);
  }
  return initialState;
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify({ items }));
  } catch (e) {
    console.warn("Cart save error", e);
  }
}

function cartReducer(state, action) {
  let nextItems;
  switch (action.type) {
    case "ADD_ITEM": {
      const { id, title, price, thumbnail, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        nextItems = state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + (quantity || 1) } : i
        );
      } else {
        nextItems = [...state.items, { id, title, price, thumbnail, quantity: quantity || 1 }];
      }
      break;
    }
    case "REMOVE_ITEM":
      nextItems = state.items.filter((i) => i.id !== action.payload.id);
      break;
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        nextItems = state.items.filter((i) => i.id !== id);
      } else {
        nextItems = state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
      }
      break;
    }
    case "SET_CART":
      nextItems = Array.isArray(action.payload) ? action.payload : state.items;
      break;
    case "CLEAR_CART":
      nextItems = [];
      break;
    default:
      return state;
  }
  saveCart(nextItems);
  return { items: nextItems };
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => loadCart());

  useEffect(() => {
    saveCart(state.items);
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity,
      },
    });
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = {
    items: state.items,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
