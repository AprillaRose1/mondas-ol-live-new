import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/lib/types';

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  message: string;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
}

const initialState: CartState = {
  items: [],
  appliedCoupon: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
    },
    setCoupon: (state, action: PayloadAction<AppliedCoupon>) => {
      state.appliedCoupon = action.payload;
    },
    clearCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setCoupon, clearCoupon } = cartSlice.actions;
export default cartSlice.reducer;
